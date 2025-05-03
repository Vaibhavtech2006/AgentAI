from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import json
import os
from simple_agent import SimplePhiDataAgent  # Ensure this file exists in the same folder


app = Flask(__name__)
CORS(app)

# MongoDB setup
mongo_client = MongoClient("mongodb://localhost:27017")  # Make sure MongoDB is running
db = mongo_client["lead_generation"]
collection = db["leads"]

# Instantiate your agent once
agent = SimplePhiDataAgent(name="LeadGenerationAgent")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    place = data.get("place")
    niche = data.get("niche")

    if not place or not niche:
        return jsonify({"status": "error", "message": "Missing place or niche"}), 400

    try:
        print(f"[DEBUG] Starting lead generation for place={place}, niche={niche}")
        json_filename = f"leads_{place}_{niche}.json"

        # Call the agent to generate leads
        agent.generate_leads(place, niche)
        print(f"[DEBUG] Finished agent processing. Looking for {json_filename}")

        # Check if the file was generated
        if not os.path.exists(json_filename):
            raise FileNotFoundError(f"{json_filename} not found!")

        # Load JSON leads from file
        with open(json_filename, "r", encoding="utf-8") as f:
            leads = json.load(f)

        print(f"[DEBUG] Loaded {len(leads)} leads.")

        # Add extra metadata
        for lead in leads:
            lead["place"] = place
            lead["niche"] = niche

        # Save leads to MongoDB
        if leads:
            collection.insert_many(leads)
            print("[DEBUG] Leads inserted into MongoDB.")

        return jsonify({"status": "Leads generated successfully", "leads": leads}), 200

    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
