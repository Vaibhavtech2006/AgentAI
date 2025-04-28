from apify_client import ApifyClient
import time
import json

# Initialize the ApifyClient
client = ApifyClient('apify_api_UnsWeTAbRoaRQWAV9JEpTNTsatbg102NA6BW')

# Set up the API request for running the task
task_client = client.task('playerxgaming/google-maps-scraper-task')  # Replace with your actual task ID

# Define task input parameters
task_input = {
    "locationQuery": "Ghaziabad, India",
    "searchStringsArray": ["restaurant"]
}

# Define JSON file name
json_filename = "leads.json"

# Open the JSON file for writing
with open(json_filename, mode='w', encoding='utf-8') as file:
    try:
        # Run the task and get the run details
        run = task_client.call(
            task_input=task_input,
            timeout_secs=60,   # Timeout in seconds
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
