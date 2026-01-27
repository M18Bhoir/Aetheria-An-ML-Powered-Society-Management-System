from fastapi import FastAPI
import pandas as pd
from prophet import Prophet

app = FastAPI()

@app.post("/predict-maintenance")
def predict_maintenance(data: list):
    # Convert incoming JSON to DataFrame
    df = pd.DataFrame(data)

    # Convert ds to datetime
    df["ds"] = pd.to_datetime(df["ds"])

    # Initialize Prophet
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False
    )

    # Train model
    model.fit(df)

    # Forecast next 3 months
    future = model.make_future_dataframe(periods=3, freq="M")
    forecast = model.predict(future)

    # Return only future predictions
    result = forecast.tail(3)[
        ["ds", "yhat", "yhat_lower", "yhat_upper"]
    ]

    return result.to_dict(orient="records")
