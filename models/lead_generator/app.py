from flask import Flask, render_template, request, send_file
import http.client
import json
import urllib.parse

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        place_name = request.form["place"]
        search_keyword = request.form["keyword"]
        limit = int(request.form["limit"])

        token = "apify_api_5gjXmwixLft6dhPAlijFzp9bgNUj3u2pOafs"
        actor_id = "compass~crawler-google-places"

        params = urllib.parse.urlencode({
            'token': token,
            'format': 'csv',
            'clean': 'true',
            'limit': limit
        })
        endpoint = f"/v2/acts/{actor_id}/run-sync-get-dataset-items?{params}"

        payload = json.dumps({
            "includeWebResults": False,
            "language": "en",
            "locationQuery": place_name,
            "maxCrawledPlaces": limit,
            "maxImages": 0,
            "maxQuestions": 0,
            "maxReviews": 0,
            "scrapeContacts": False,
            "scrapeDirectories": False,
            "scrapeImageAuthors": False,
            "scrapePlaceDetailPage": False,
            "scrapeReviewsPersonalData": True,
            "scrapeTableReservationProvider": False,
            "searchStringsArray": [search_keyword],
            "skipClosedPlaces": False
        })

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

        conn = http.client.HTTPSConnection("api.apify.com")
        conn.request("POST", endpoint, payload, headers)
        res = conn.getresponse()
        data = res.read()

        filename = f"{place_name.replace(',', '').replace(' ', '_').lower()}_{search_keyword.lower()}.csv"
        with open(filename, "wb") as f:
            f.write(data)

        return send_file(filename, as_attachment=True)

    return render_template("index.html")
