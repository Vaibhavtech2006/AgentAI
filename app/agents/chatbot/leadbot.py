from flask import Flask, request, jsonify
from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import os
from apify_client import ApifyClient
import time
from supabase import create_client, Client

# Initialize Flask
app = Flask(__name__)

# Supabase credentials
SUPABASE_URL = "https://cpqwepcxnzdljomotorz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXdlcGN4bnpkbGpvbW90b3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjAwNDAsImV4cCI6MjA2MTgzNjA0MH0.2BdL8ToUwxcxuV5N5PZSr2UQC4VY8kwH9k_s2fRNe4k"


load_dotenv()

# Initialize Supabase & Apify
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
client = ApifyClient('apify_api_nrEZV8beCjVGNrxMT8OftptNHQMrbe0insCD')
task_client = client.task('vaibhavhackeer/google-maps-scraper-task')

class SimplePhiDataAgent(Agent):
    def __init__(self, name: str):
        super().__init__(
            name=name,
            role="Agent to generate leads",
            model=Groq(id="llama-3.3-70b-versatile"),
            storage=SqlAgentStorage(table_name="simple_phi_agent", db_file="agents.db"),
            add_history_to_messages=True,
            show_tool_calls=True,
            markdown=True
        )

    def generate_leads(self, place, niche):
        task_input = {
            "locationQuery": place,
            "searchStringsArray": [niche]
        }

        run = task_client.call(
            task_input=task_input,
            timeout_secs=60,
            memory_mbytes=512
        )

        # Wait for task completion
        while run['status'] not in ('SUCCEEDED', 'FAILED'):
            time.sleep(5)
            run = task_client.get_run(run['id'])

        all_items = []
        if run['status'] == 'SUCCEEDED':
            dataset = client.dataset(run['defaultDatasetId'])
            items_dict = {}
            offset = 0
            limit = 5
            counter = 1

            while len(items_dict) < limit:
                current_items = dataset.list_items(offset=offset, limit=limit - len(items_dict)).items
                if not current_items:
                    break

                for item in current_items:
                    items_dict[f"Lead {counter}"] = item
                    counter += 1

                offset += len(current_items)

            all_items.extend(items_dict.values())

            # Save to Supabase
            for lead in all_items:
                lead_data = {
                    "title": lead.get("title"),
                    "address": lead.get("address"),
                    "phone": lead.get("phone"),
                    "website": lead.get("website"),
                    "city": lead.get("city"),
                    "state": lead.get("state"),
                    "countryCode": lead.get("countryCode")
                }
                supabase.table("leads").insert(lead_data).execute()

            return all_items
        else:
            return []

# Initialize agent
agent = SimplePhiDataAgent(name="LeadAgent")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    session_id = data.get('session_id')
    message = data.get('message')  # You may want to send both place & niche here.

    place = data.get('place')
    niche = data.get('niche')

    if not place or not niche:
        return jsonify({"bot": "Please provide both place and niche."}), 400

    leads = agent.generate_leads(place, niche)

    if leads:
        leads_simple = [
            {
                "title": lead.get("title"),
                "address": lead.get("address"),
                "phone": lead.get("phone"),
                "website": lead.get("website"),
                "city": lead.get("city"),
                "state": lead.get("state"),
                "countryCode": lead.get("countryCode")
            }
            for lead in leads
        ]
        return jsonify({
            "bot": f"I found {len(leads_simple)} leads for {niche} in {place}.",
            "leads": leads_simple
        })
    else:
        return jsonify({
            "bot": "Sorry, no leads found or an error occurred.",
            "leads": []
        })

if __name__ == '__main__':
    app.run(debug=True)
