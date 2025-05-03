from flask import Flask, request, jsonify
from apify_client import ApifyClient
import json
import time
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the ApifyClient
client = ApifyClient('apify_api_UnsWeTAbRoaRQWAV9JEpTNTsatbg102NA6BW')  # Replace with your actual API key
task_client = client.task('playerxgaming/google-maps-scraper-task')  # Replace with your actual task ID

app = Flask(__name__)

@app.route('/generate', methods=['POST'])
def generate_leads():
    data = request.get_json()
    place = data.get('place')
    niche = data.get('niche')

    if not place or not niche:
        return jsonify({'status': 'error', 'message': 'Place and niche are required'}), 400

    # Define task input parameters
    task_input = {
        "locationQuery": place,
        "searchStringsArray": [niche]
    }

    try:
        run = task_client.call(
            task_input=task_input,
            timeout_secs=60,  # Timeout in seconds
            memory_mbytes=512  # Memory limit in megabytes
        )

        # Wait for the task to complete
        while run['status'] not in ('SUCCEEDED', 'FAILED'):
            time.sleep(5)
            run = task_client.get_run(run['id'])

        all_items = []

        if run['status'] == 'SUCCEEDED':
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

            all_items.extend(items_dict.values())

        if all_items:
            return jsonify({'status': 'success', 'leads': all_items}), 200
        else:
            return jsonify({'status': 'error', 'message': 'No leads found'}), 404

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
