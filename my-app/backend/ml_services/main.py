from fastapi import FastAPI, HTTPException
from typing import List, Dict
import pandas as pd
from prophet import Prophet

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
