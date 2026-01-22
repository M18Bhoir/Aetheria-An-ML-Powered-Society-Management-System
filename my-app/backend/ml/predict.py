import sys
import json
import joblib
import pandas as pd
import os
import warnings

# Silence sklearn warnings in production output
warnings.filterwarnings("ignore")

def main():
    """
    Entry point for Node.js → Python ML bridge
    """

    # ---------------- PATH SETUP ----------------
    BASE_DIR = os.path.dirname(__file__)
    PIPELINES_PATH = os.path.join(BASE_DIR, "models", "ml_pipeline_registry.pkl")

    # ---------------- LOAD PIPELINES ----------------
    try:
        pipelines = joblib.load(PIPELINES_PATH)
    except Exception as e:
        print(json.dumps({
            "error": "Failed to load ML pipelines",
            "details": str(e)
        }))
        sys.exit(1)

    # ---------------- READ INPUT ----------------
    try:
        input_payload = json.loads(sys.argv[1])
        model_name = input_payload["model"]
        input_data = input_payload["data"]
    except Exception as e:
        print(json.dumps({
            "error": "Invalid input payload",
            "details": str(e)
        }))
        sys.exit(1)

    # ---------------- VALIDATE MODEL ----------------
    if model_name not in pipelines:
        print(json.dumps({
            "error": f"Model '{model_name}' not found"
        }))
        sys.exit(1)

    model_info = pipelines[model_name]
    pipeline = model_info["pipeline"]
    features = model_info["features"]
    model_type = model_info["type"]  # regression | classification | clustering

    # ---------------- BUILD INPUT DATAFRAME ----------------
    # Ensure ALL required features exist
    safe_input = {}
    for feature in features:
        safe_input[feature] = input_data.get(feature, 0)

    X = pd.DataFrame([safe_input])

    # ---------------- PREDICTION ----------------
    try:
        if model_type == "clustering":
            cluster_id = int(pipeline.predict(X)[0])
            response = {
                "model": model_name,
                "type": "clustering",
                "cluster": cluster_id
            }

        elif model_type == "classification":
            pred_class = int(pipeline.predict(X)[0])
            confidence = float(max(pipeline.predict_proba(X)[0]))

            response = {
                "model": model_name,
                "type": "classification",
                "prediction": pred_class,
                "confidence": round(confidence, 3)
            }

        else:  # regression
            prediction = float(pipeline.predict(X)[0])

            # Example business logic
            risk_level = (
                "High" if prediction > 4000
                else "Medium" if prediction > 2500
                else "Low"
            )

            response = {
                "model": model_name,
                "type": "regression",
                "predicted_amount": round(prediction, 2),
                "risk_level": risk_level,
                "confidence": 0.85
            }

    except Exception as e:
        print(json.dumps({
            "error": "Prediction failed",
            "details": str(e)
        }))
        sys.exit(1)

    # ---------------- OUTPUT ----------------
    print(json.dumps(response))


if __name__ == "__main__":
    main()
