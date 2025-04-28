# lead_generator_agent.py

from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from phi.tools.duckduckgo import DuckDuckGo
from dotenv import load_dotenv
import os

# Load environment variables (for GROQ_API_KEY from your .env)
load_dotenv()

# Setup the Search Agent (to find leads from the internet)
lead_search_agent = Agent(
    name="Lead Search Agent",
    role="Find potential business leads based on user query",
    model=Groq(id="llama-3.3-70b-versatile"),
    tools=[DuckDuckGo()],
    instructions=[
        "Use DuckDuckGo to find companies based on the given industry and location. "
        "Return their Company Name, Website, Email (if available), and a short 1-line Description. "
        "Always provide sources."
    ],
    storage=SqlAgentStorage(table_name="lead_search_agent", db_file="agents.db"),
    add_history_to_messages=True,
    show_tool_calls=True,
    markdown=True,
)

# Setup the Formatter Agent (to clean up and structure data)
lead_formatter_agent = Agent(
    name="Lead Formatter Agent",
    role="Format raw lead data into a structured table",
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "Take unstructured information about businesses and organize it into a neat table. "
        "The table should have columns: Company Name | Website | Email | Short Description. "
        "If no email found, leave it blank. Keep descriptions short and clear."
    ],
    storage=SqlAgentStorage(table_name="lead_formatter_agent", db_file="agents.db"),
    add_history_to_messages=True,
    show_tool_calls=False,
    markdown=True,
)

# Create a Lead Generator Team (combining both agents)
lead_generation_team = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    team=[lead_search_agent, lead_formatter_agent],
    instructions=[
        "Step 1: Search for companies based on user's industry and location.",
        "Step 2: Format the results into a clean table.",
        "Always ensure website and email fields are filled if available."
    ],
    show_tool_calls=True,
    markdown=True,
)

# === Example Run ===
if __name__ == "__main__":
    user_query = "IT companies in Bangalore"
    lead_generation_team.print_response(
        f"Find top 10 {user_query} with their website, email and a short description.",
        stream=True
    )
