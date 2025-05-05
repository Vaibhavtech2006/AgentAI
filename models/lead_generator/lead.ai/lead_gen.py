from phi.agent import Agent, Tool
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
from apify_client import ApifyClient
import json
import time
import os
from typing import ClassVar

# Load environment variables
load_dotenv()

# Create a Custom Tool for Apify Scraper
class ApifyScraperTool(Tool):
    description: ClassVar[str] = "Use this tool to scrape business leads from Google Maps using Apify."
    type: ClassVar[str] = "ApifyScraper"  # Set 'type' as a class variable, no need to set it in __init__()
    __name__: ClassVar[str] = "ApifyScraperTool"  # Manually set __name__ for the tool

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
    
    def __call__(self, location: str, query: str):
        # Initialize ApifyClient
        client = ApifyClient(os.getenv('APIFY_API_TOKEN'))  # Store your token in .env file
        task_client = client.task('playerxgaming/google-maps-scraper-task')  # Your task ID

        task_input = {
            "locationQuery": location,
            "searchStringsArray": [query]
        }

        try:
            # Start the Apify task
            run = task_client.call(task_input=task_input, timeout_secs=120, memory_mbytes=)
            print(f"Task started: {run['id']}")

            # Wait for the task to complete
            while run['status'] not in ['SUCCEEDED', 'FAILED']:
                time.sleep(5)
                run = task_client.get_run(run['id'])
                print(f"Waiting... Current status: {run['status']}")

            all_items = []

            if run['status'] == 'SUCCEEDED':
                dataset = client.dataset(run['defaultDatasetId'])
                offset = 0
                limit = 50  # Fetch up to 50 leads

                while True:
                    current_items = dataset.list_items(offset=offset, limit=limit).items
                    if not current_items:
                        break
                    all_items.extend(current_items)
                    offset += len(current_items)

                # Save to JSON file
                with open('leads.json', 'w', encoding='utf-8') as f:
                    json.dump(all_items, f, indent=4)

                return f"Scraping completed. {len(all_items)} leads saved to leads.json."

            else:
                return f"Task failed with status: {run['status']}"

        except Exception as e:
            return f"An error occurred: {str(e)}"


# Initialize the custom Apify tool
apify_scraper_tool = ApifyScraperTool(name="ApifyScraper")

# Lead Search Agent
lead_search_agent = Agent(
    name="Lead Search Agent",
    role="Ask user for business niche and location, then find potential leads using Apify Scraper.",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[apify_scraper_tool],
    instructions=[
        "First, ask the user what business niche they want leads for.",
        "Then ask the user for the target location.",
        "After receiving both, call the ApifyScraper tool with the given location and niche.",
        "Do not proceed until you have both niche and location clearly.",
        "Tell the user that a 'leads.json' file is being prepared after scraping."
    ],
    storage=SqlAgentStorage(table_name="lead_search_agent", db_file="agents.db"),
    add_history_to_messages=True,
    show_tool_calls=True,
    markdown=True,
)

# Formatter Agent (Optional for cleaner output)
lead_formatter_agent = Agent(
    name="Lead Formatter Agent",
    role="Format raw scraped lead data into a structured format",
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "If needed, organize the scraped business leads into a clean table: Company Name | Website | Email | Short Description."
    ],
    storage=SqlAgentStorage(table_name="lead_formatter_agent", db_file="agents.db"),
    add_history_to_messages=True,
    show_tool_calls=False,
    markdown=True,
)

# Team Agent (combining both)
lead_generation_team = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    team=[lead_search_agent, lead_formatter_agent],
    instructions=[
        "First, collect niche and location from the user.",
        "Then, scrape using ApifyScraper tool.",
        "Finally, inform the user that leads have been saved in leads.json."
    ],
    show_tool_calls=True,
    markdown=True,
)

# === Example Run ===
if __name__ == "__main__":
    lead_generation_team.print_response(
        "Hi! I want to generate leads.", stream=True
    )
