from fastapi import FastAPI, HTTPException
from typing import List, Dict
import pandas as pd
from prophet import Prophet
import joblib
import os
import uvicorn

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'ml_pipeline_registry.pkl')

app = FastAPI(
    title="Maintenance Prediction Service",
    description="Prophet-based time series forecasting for maintenance collection",
    version="1.0.0"
)

@app.post("/predict-maintenance")
def predict_maintenance(data: List[Dict]):
    """
    Train Prophet model on historical maintenance data
    and predict future collection rates.
    Expected input format:
    [
      { "ds": "2024-01", "y": 82.5 },
      { "ds": "2024-02", "y": 85.1 }
    ]
    """
    try:
        if not data or len(data) < 2:
            raise HTTPException(
                status_code=400,
                detail="At least two data points are required for prediction"
            )

        # Convert input JSON to DataFrame
        df = pd.DataFrame(data)

        # Validate required columns
        if "ds" not in df.columns or "y" not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="Input must contain 'ds' and 'y' fields"
            )

        # Convert ds to datetime
        df["ds"] = pd.to_datetime(df["ds"], errors="coerce")

        if df["ds"].isnull().any():
            raise HTTPException(
                status_code=400,
                detail="Invalid date format in 'ds' field"
            )

        # Initialize Prophet model
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False
        )

        # Train model
        model.fit(df)

        # Predict next 3 months
        future = model.make_future_dataframe(periods=3, freq="M")
        forecast = model.predict(future)

        # Extract only future predictions
        result = forecast.tail(3)[
            ["ds", "yhat", "yhat_lower", "yhat_upper"]
        ]

        return result.to_dict(orient="records")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

# backend/ml_services/main.py


# ... other imports

# Load your model at startup
try:
    equipment_model = joblib.load(MODEL_PATH)
except:
    equipment_model = None

@app.post("/predict-equipment-failure")
def predict_failure(data: List[Dict]):
    try:
        if not equipment_model:
            raise HTTPException(status_code=500, detail="ML Model file not found")

        df = pd.DataFrame(data)
        
        # 1. Standardize date format for the model
        df["ds"] = pd.to_datetime(df["ds"])
        
        # 2. Use your model to predict (Logic depends on your specific model)
        # If your model is a Prophet model:
        forecast = equipment_model.predict(df)
        
        # 3. Identify Risk Zones (e.g., if predicted value > 75)
        forecast['failure_risk'] = forecast['yhat'] > 75 
        
        # Return the last 7 days of predictions formatted for the frontend
        return forecast[['ds', 'yhat', 'failure_risk']].tail(7).to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
