from flask import Flask, request, jsonify, render_template
from apify_client import ApifyClient
import time

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    location = request.form['location']
    query = request.form['query']

    client = ApifyClient("apify_api_gK18DAYeTpaDac0JlVYnzAkZQep72r2cKEuA")
    task_client = client.task("mrigaanksh~google-maps-scraper-task")

    task_input = {
        "locationQuery": location,
        "searchStringsArray": [query]
    }

    all_items = []

    try:
        for i in range(5):  # Run 5 times
            run = task_client.call(task_input=task_input, timeout_secs=60, memory_mbytes=512)

            while run['status'] not in ['SUCCEEDED', 'FAILED']:
                time.sleep(5)
                run = task_client.get_run(run['id'])

            if run['status'] == 'SUCCEEDED':
                dataset = client.dataset(run['defaultDatasetId'])
                offset = 0
                limit = 5

                while True:
                    current_items = dataset.list_items(offset=offset, limit=limit).items
                    all_items.extend(current_items)
                    offset += len(current_items)
                    if len(current_items) == 0:
                        break
            else:
                return jsonify({"error": f"Task failed with status: {run['status']}"})

        return jsonify(all_items)  # Send all items together

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
