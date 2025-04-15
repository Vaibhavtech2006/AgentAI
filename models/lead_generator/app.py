from flask import Flask, render_template, request
import requests

app = Flask(__name__)

API_URL = "https://api.apify.com/v2/actor-tasks/honhaar.engineer2024~google-maps-scraper-task/run-sync-get-dataset-items?token=apify_api_5gjXmwixLft6dhPAlijFzp9bgNUj3u2pOafs"

@app.route('/', methods=['GET', 'POST'])
def index():
    results = []
    if request.method == 'POST':
        location = request.form['location']
        business_type = request.form['business_type']
        
        payload = {
            "includeWebResults": False,
            "language": "en",
            "locationQuery": location,
            "maxImages": 0,
            "maxQuestions": 0,
            "maxReviews": 0,
            "scrapeContacts": False,
            "scrapeDirectories": False,
            "scrapeImageAuthors": False,
            "scrapePlaceDetailPage": False,
            "scrapeReviewsPersonalData": True,
            "scrapeTableReservationProvider": False,
            "searchStringsArray": [business_type],
            "maxCrawledPlaces": 10,
            "skipClosedPlaces": False
        }

        response = requests.post(API_URL, json=payload)

        if response.status_code == 200:
            results = response.json()
        else:
            print("❌ API request failed:", response.status_code, response.text)

    return render_template('index.html', results=results)

if __name__ == '__main__':
    app.run(debug=True)
