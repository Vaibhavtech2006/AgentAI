# simple_agent.py

import json
import time

class SimplePhiDataAgent:
    def __init__(self, name="Agent"):
        self.name = name

    def generate_leads(self, place, niche):
        # Simulate a lead generation (normally you'd run Apify here)
        dummy_leads = [
            {"name": "ABC Company", "email": "abc@example.com", "phone": "1234567890"},
            {"name": "XYZ Pvt Ltd", "email": "xyz@example.com", "phone": "0987654321"}
        ]
        filename = f"leads_{place}_{niche}.json"
        time.sleep(1)  # simulate API delay
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(dummy_leads, f, ensure_ascii=False, indent=4)
