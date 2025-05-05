from flask import Flask, request, jsonify
from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from apify_client import ApifyClient
import time
from supabase import create_client, Client
from flask_cors import CORS, cross_origin

# =============== Configuration ===============

SUPABASE_URL = "https://cpqwepcxnzdljomotorz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXdlcGN4bnpkbGpvbW90b3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjAwNDAsImV4cCI6MjA2MTgzNjA0MH0.2BdL8ToUwxcxuV5N5PZSr2UQC4VY8kwH9k_s2fRNe4k"

APIFY_API_KEY = 'apify_api_5TU7qobOdh2UmDvsRwoeBAF9bFTohO04V764'
TASK_ID = 'kushwahakunal733/google-maps-extractor-task'

# =============== Initialization ===============

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
apify_client = ApifyClient(APIFY_API_KEY)
task_client = apify_client.task(TASK_ID)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow all domains for CORS

# =============== Agent Definition ===============

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
            "locationQuery": place.strip(),
            "searchStringsArray": [niche.strip()]
        }

        try:
            run = task_client.call(
                task_input=task_input,
                timeout_secs=120,
                memory_mbytes=512
            )
            run_id = run.get('id')
            status = run.get('status')
            print(f"Task Run ID: {run_id} - Status: {status}")

            # Wait for task completion
            max_wait_time = 180  # 3 minutes max
            waited = 0
            while status not in ('SUCCEEDED', 'FAILED') and waited < max_wait_time:
                print(f"Waiting for task to complete... Current status: {status}")
                time.sleep(5)
                waited += 5
                run = task_client.get_run(run_id)
                status = run.get('status')

            if status != 'SUCCEEDED':
                print(f"Task failed or timed out after {waited} seconds: {status}")
                return []

            # Fetch dataset results
            dataset_id = run.get('defaultDatasetId')
            dataset = apify_client.dataset(dataset_id)

            all_items = []
            offset = 0
            page_size = 5  # Fetch 5 items max

            while True:
                page = dataset.list_items(offset=offset, limit=page_size)
                items = page.items
                if not items:
                    break
                all_items.extend(items)
                if len(all_items) >= page_size:
                    break
                offset += len(items)

            print(f"Retrieved {len(all_items)} items.")
            return all_items

        except Exception as e:
            print(f"❌ Error during scraping: {str(e)}")
            return []

# =============== Routes ===============

@app.route("/generate-leads", methods=["POST", "OPTIONS"])
@cross_origin()  # Handle preflight CORS requests
def generate_leads_route():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight request successful"}), 200

    data = request.get_json()
    place = data.get("place")
    niche = data.get("niche")

    if not place or not niche:
        return jsonify({"error": "Both 'place' and 'niche' are required"}), 400

    agent = SimplePhiDataAgent(name="LeadGenerationAgent")
    leads = agent.generate_leads(place, niche)

    saved_leads = []
    if leads:
        for lead in leads:
            lead_data = {
                "title": lead.get("title"),
                "address": lead.get("address"),
                "phone": lead.get("phone"),
                "website": lead.get("website"),
                "city": lead.get("city"),
                "state": lead.get("state"),
                "countryCode": lead.get("countryCode")
            }
            try:
                response = supabase.table("leads").insert(lead_data).execute()
                print(f"Inserted lead: {lead_data} - Response: {response}")
                saved_leads.append(lead_data)
            except Exception as e:
                print(f"❌ Error saving lead: {lead_data} - {str(e)}")

        return jsonify({
            "message": f"Leads saved successfully ({len(saved_leads)} leads)",
            "leads": saved_leads
        }), 200
    else:
        return jsonify({"message": "No leads found or scraping failed"}), 400

# =============== Main ===============

if __name__ == "__main__":
    app.run(debug=True)
