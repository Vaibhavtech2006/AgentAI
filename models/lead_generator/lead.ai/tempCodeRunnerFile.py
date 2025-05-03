from flask import Flask, request, jsonify
from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
from apify_client import ApifyClient
from pymongo import MongoClient
import os
import time

# Load environment variables
load_dotenv()

# Initialize Apify client
APIFY_API_KEY = os.getenv("APIFY_API_KEY")
APIFY_TASK_ID = os.getenv("APIFY_TASK_ID")
client = ApifyClient(APIFY_API_KEY)
task_client = client.task(APIFY_TASK_ID)

# Initialize MongoDB client with TLS
MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME", "leads_db")
COLLECTION_NAME = os.getenv("COLLECTION_NAME", "leads")

mongo_client = MongoClient(
    MONGODB_URI,
    tls=True
)
db = mongo_client[DB_NAME]
leads_collection = db[COLLECTION_NAME]

# Define the Phi Agent class
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

        try:
            run = task_client.call(
                task_input=task_input,
                timeout_secs=120,
                memory_mbytes=512
            )

            print(f"Task Run ID: {run['id']} - Status: {run['status']}")

            while run['status'] not in ('SUCCEEDED', 'FAILED'):
                print(f"Waiting for task to complete... Current status: {run['status']}")
                time.sleep(5)
                run = task_client.get_run(run['id'])

            if run['status'] == 'SUCCEEDED':
                dataset = client.dataset(run['defaultDatasetId'])
                all_items = []

                offset = 0
                limit = 10  # Adjust limit as needed
                while True:
                    items = dataset.list_items(offset=offset, limit=limit).items
                    if not items:
                        break
                    all_items.extend(items)
                    offset += len(items)
                    if len(all_items) >= limit:
                        break

                print(f"Retrieved {len(all_items)} leads from dataset.")

                # Store leads in MongoDB
                if all_items:
                    self.store_leads_in_mongo(all_items)
                return all_items

            else:
                print(f"Task failed with status: {run['status']}")
                return []

        except Exception as e:
            print(f"Error generating leads: {e}")
            return []

    def store_leads_in_mongo(self, leads):
        if not leads:
            print("No leads to store.")
            return
        try:
            result = leads_collection.insert_many(leads)
            print(f"Inserted {len(result.inserted_ids)} leads into MongoDB.")
        except Exception as e:
            print(f"Error inserting leads into MongoDB: {e}")

# Initialize Flask app
app = Flask(__name__)
agent = SimplePhiDataAgent(name="LeadGenerationAgent")

@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json()
    place = data.get('place')
    niche = data.get('niche')

    if not place or not niche:
        return jsonify({"error": "Missing 'place' or 'niche' parameter"}), 400

    leads = agent.generate_leads(place, niche)

    if leads:
        return jsonify({
            "status": "success",
            "leads": leads,
            "count": len(leads)
        })
    else:
        return jsonify({
            "status": "failed",
            "leads": [],
            "count": 0
        })

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
