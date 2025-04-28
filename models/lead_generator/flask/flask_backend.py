from flask import Flask, request, jsonify, render_template
from apify_client import ApifyClient
import time

app = Flask(__name__)

# Initialize ApifyClient once (outside routes)
client = ApifyClient("apify_api_UnsWeTAbRoaRQWAV9JEpTNTsatbg102NA6BW")
task_client = client.task("playerxgaming/google-maps-scraper-task")  # Update with your task ID

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    location = request.form.get('location')
    query = request.form.get('query')

    if not location or not query:
        return jsonify({"error": "Missing location or query parameter."}), 400

    task_input = {
        "locationQuery": location,
        "searchStringsArray": [query]
    }

    all_items = []

    try:
        # Run the scraping task once
        run = task_client.call(task_input=task_input, timeout_secs=120, memory_mbytes=1024,)
        print(f"Task started: {run['id']}")

        # Wait for the task to complete
        while run['status'] not in ['SUCCEEDED', 'FAILED']:
            time.sleep(5)
            run = task_client.get_run(run['id'])
            print(f"Waiting... Current status: {run['status']}")

        if run['status'] == 'SUCCEEDED':
            dataset = client.dataset(run['defaultDatasetId'])
            offset = 0
            limit = 100  # Adjust the limit as needed (100 leads per request)

            while True:
                current_items = dataset.list_items(offset=offset, limit=limit).items
                if not current_items:
                    break
                all_items.extend(current_items)
                offset += len(current_items)

            print(f"Scraped {len(all_items)} leads.")
            return jsonify(all_items)

        else:
            return jsonify({"error": f"Task failed with status: {run['status']}"}), 500

    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
