from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import os
from apify_client import ApifyClient
import time
import json

# Load environment variables from .env file
load_dotenv()

# Initialize the ApifyClient
client = ApifyClient('apify_api_UnsWeTAbRoaRQWAV9JEpTNTsatbg102NA6BW')  # Replace with your actual API key
task_client = client.task('playerxgaming/google-maps-scraper-task')  # Replace with your actual task ID

# Define the agent
class SimplePhiDataAgent(Agent):
    def __init__(self, name: str):
        super().__init__(
            name=name,
            role="Conversational Lead Generation Agent",
            model=Groq(id="llama-3.3-70b-versatile"),
            storage=SqlAgentStorage(table_name="simple_phi_agent", db_file="agents.db"),
            add_history_to_messages=True,
            show_tool_calls=True,
            markdown=True
        )

    def interact(self):
        print("👋 Hey there! I'm your lead generation assistant.")
        print("I can help you find potential business leads based on location and type of business.")
        time.sleep(1)

        while True:
            print("\nLet's get started! 😊")
            place = input("🗺️ First, tell me which city or area you're targeting: ").strip()
            time.sleep(0.5)
            print(f"Nice! You’re looking in **{place}**.")

            niche = input("🏢 Now, what kind of business are you looking for? (e.g., restaurant, clinic, etc.): ").strip()
            print(f"Got it! You want leads for **{niche}** in **{place}**.")

            confirm = input("✅ Should I go ahead and get those leads? (yes/no): ").strip().lower()
            if confirm in ['yes', 'y']:
                self.generate_leads(place, niche)
            else:
                print("No worries. Let’s try again.\n")
                continue

            # Ask if user wants more
            again = input("\n🔁 Do you want to generate more leads? (yes/no): ").strip().lower()
            if again not in ['yes', 'y']:
                print("👋 Alright, goodbye and good luck with your leads!")
                break

    def generate_leads(self, place, niche):
        task_input = {
            "locationQuery": place,
            "searchStringsArray": [niche]
        }

        json_filename = f"leads_{place}_{niche}.json"

        try:
            print("🔄 Starting lead generation...")
            run = task_client.call(
                task_input=task_input,
                timeout_secs=60,
                memory_mbytes=512
            )

            while run['status'] not in ('SUCCEEDED', 'FAILED'):
                print(f"⏳ Waiting... Current status: {run['status']}")
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

                print(f"✅ Retrieved {len(items_dict)} leads.")

                all_items.extend(items_dict.values())

            else:
                print(f"❌ Task failed with status: {run['status']}")

            if all_items:
                with open(json_filename, mode='w', encoding='utf-8') as file:
                    json.dump(all_items, file, indent=4)
                print(f"💾 Leads saved to **{json_filename}**")
            else:
                print("⚠️ No leads were found. Try again with different inputs.")

        except Exception as e:
            print(f"🚨 Oops! Something went wrong: {str(e)}")

# Start the interaction
if __name__ == "__main__":
    agent = SimplePhiDataAgent(name="LeadGenBuddy")
    agent.interact()
