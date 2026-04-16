import requests
import json

data = [
    {"ds": "2024-01-01", "y": 10},
    {"ds": "2024-02-01", "y": 12},
    {"ds": "2024-03-01", "y": 11}
]

try:
    resp = requests.post("http://localhost:8000/predict-maintenance", json=data)
    print(f"Status: {resp.status_code}")
    print(f"Response: {resp.text}")
except Exception as e:
    print(f"Error: {e}")
