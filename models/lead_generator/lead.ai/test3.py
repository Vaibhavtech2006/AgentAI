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

# Define the Apify task client
task_client = client.task('playerxgaming/google-maps-scraper-task')  # Replace with your actual task ID

# Create a simple PhiData Agent
class SimplePhiDataAgent(Agent):
    def __init__(self, name: str):
        super().__init__(
            name=name,
            role="Agent to generate leads",
            model=Groq(id="llama-3.3-70b-versatile"),  # You can replace with another model if needed
            storage=SqlAgentStorage(table_name="simple_phi_agent", db_file="agents.db"),
            add_history_to_messages=True,
            show_tool_calls=True,
            markdown=True
        )

    def interact(self):
        # Agent introduces itself
        print("Hello! I am your lead generation assistant.")
        print("I can help you generate business leads based on location and niche.")

        while True:
            # Ask the user for place and business niche
            place = input("Enter the place name (e.g., city or area): ")
            niche = input("Enter the business niche (e.g., restaurant, store): ")

            # Proceed to generate leads
            self.generate_leads(place, niche)

            # Ask if they want to generate more leads
            more_leads = input("Do you want to generate more leads? (yes/no): ").lower()
            if more_leads not in ['yes', 'y']:
                print("Goodbye! Have a great day!")
                break

    def generate_leads(self, place, niche):
        # Define task input parameters
        task_input = {
            "locationQuery": place,
            "searchStringsArray": [niche]
        }

        # Define the JSON file name
        json_filename = f"leads_{place}_{niche}.json"

        # Open the JSON file for writing
        with open(json_filename, mode='w', encoding='utf-8') as file:
            try:
                # Run the task and get the run details
                run = task_client.call(
                    task_input=task_input,
                    timeout_secs=60,  # Timeout in seconds
                    memory_mbytes=512  # Memory limit in megabytes
                )

                print(f"Task Run ID: {run['id']} - Status: {run['status']}")

                # Wait for the task to complete
                while run['status'] not in ('SUCCEEDED', 'FAILED'):
                    print(f"Waiting for task to complete... Current status: {run['status']}")
                    time.sleep(5)
                    run = task_client.get_run(run['id'])

                all_items = []  # List to store all retrieved items

                if run['status'] == 'SUCCEEDED':
                    # Fetch the dataset items
                    dataset = client.dataset(run['defaultDatasetId'])
                    items_dict = {}

                    offset = 0
                    limit = 5  # Limit of items to fetch
                    counter = 1

                    while len(items_dict) < limit:
                        current_items = dataset.list_items(offset=offset, limit=limit - len(items_dict)).items
                        if not current_items:
                            break

                        for item in current_items:
                            items_dict[f"Lead {counter}"] = item
                            counter += 1

                        offset += len(current_items)

                    print(f"Retrieved {len(items_dict)} items from the dataset.")

                    all_items.extend(items_dict.values())

                else:
                    print(f"Task failed with status: {run['status']}")

                # Write the retrieved data to the JSON file
                if all_items:
                    json.dump(all_items, file, indent=4)
                    print(f"Leads saved to {json_filename}")
                else:
                    print("No leads retrieved.")

            except Exception as e:
                print(f"An error occurred: {str(e)}")


# Initialize the agent and start the interaction
if __name__ == "__main__":
    agent = SimplePhiDataAgent(name="LeadGenerationAgent")
    agent.interact()
