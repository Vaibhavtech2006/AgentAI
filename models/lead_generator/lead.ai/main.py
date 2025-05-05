from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import os
from apify_client import ApifyClient
import time
from supabase import create_client, Client

# Supabase credentials
SUPABASE_URL = "https://cpqwepcxnzdljomotorz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwcXdlcGN4bnpkbGpvbW90b3J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNjAwNDAsImV4cCI6MjA2MTgzNjA0MH0.2BdL8ToUwxcxuV5N5PZSr2UQC4VY8kwH9k_s2fRNe4k"

# Load environment variables from .env file
load_dotenv()

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize the ApifyClient
client = ApifyClient('apify_api_pwfGLoMWEAOfW7dJeTe3NYHuWcTXL43X7IWo')
task_client = client.task('nipun1a1b/google-maps-extractor-task')

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

    def interact(self):
        print("Hello! I am your lead generation assistant.")
        while True:
            place = input("Enter the place name (e.g., city or area): ")
            niche = input("Enter the business niche (e.g., restaurant, store): ")
            self.generate_leads(place, niche)
            more = input("Do you want to generate more leads? (yes/no): ").lower()
            if more not in ['yes', 'y']:
                print("Goodbye! Have a great day!")
                break

    def generate_leads(self, place, niche):
        task_input = {
            "locationQuery": place,
            "searchStringsArray": [niche]
        }

        try:
            run = task_client.call(
                task_input=task_input,
                timeout_secs=60,
                memory_mbytes=512
            )
            print(f"Task Run ID: {run['id']} - Status: {run['status']}")

            while run['status'] not in ('SUCCEEDED', 'FAILED'):
                print(f"Waiting for task to complete... Current status: {run['status']}")
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

                print(f"Retrieved {len(items_dict)} items.")
                all_items.extend(items_dict.values())

            else:
                print(f"Task failed with status: {run['status']}")

            if all_items:
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

                    response = supabase.table("leads").insert(lead_data).execute()

                    if hasattr(response, 'status_code') and response.status_code == 201:
                        print(f"✅ Lead saved: {lead_data['title']}")
                    elif hasattr(response, 'data'):
                        print(f"✅ Lead saved: {lead_data['title']}")
                    else:
                        print(f"❌ Error: {response}")
            else:
                print("No leads retrieved.")

        except Exception as e:
            print(f"❌ Error occurred: {str(e)}")


# Run the agent
if __name__ == "__main__":
    agent = SimplePhiDataAgent(name="LeadGenerationAgent")
    agent.interact()