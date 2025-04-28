from phi.agent import Agent
from phi.model.groq import Groq
from phi.storage.agent.sqlite import SqlAgentStorage
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Create a simple PhiData Agent that will ask for user input and respond
class SimplePhiDataAgent(Agent):
    def __init__(self, name: str):
        # Define the model and the storage for the agent
        super().__init__(
            name=name,
            role="Simple agent to interact with the user and provide responses",
            model=Groq(id="llama-3.3-70b-versatile"),  # You can replace with another model if needed
            storage=SqlAgentStorage(table_name="simple_phi_agent", db_file="agents.db"),
            add_history_to_messages=True,
            show_tool_calls=True,
            markdown=True
        )

    def interact(self):
        # Sample interaction loop
        print("Hello! I am your assistant. Ask me anything.")
        while True:
            user_input = input("You: ")
            if user_input.lower() in ['exit', 'quit']:
                print("Goodbye!")
                break

            # Process the input and generate a response
            response = self.run(message=user_input)
            
            # Access only the response content and print it
            # The message is now an object, so we access its 'content' directly
            print(f"Agent: {response.messages[-1].content}")  # Access the content attribute directly

# Initialize the agent and start the interaction
if __name__ == "__main__":
    agent = SimplePhiDataAgent(name="User-Interactive Agent")
    agent.interact()
