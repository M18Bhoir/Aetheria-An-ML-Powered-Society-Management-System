import pandas as pd
from prophet import Prophet
import traceback

data = [
    {"ds": "2025-01", "y": 80},
    {"ds": "2025-02", "y": 85},
    {"ds": "2025-03", "y": 90}
]

try:
    df = pd.DataFrame(data)
    df["ds"] = pd.to_datetime(df["ds"], errors="coerce")
    print("DataFrame head:")
    print(df.head())
    
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False
    )
    print("Fitting model...")
    model.fit(df)
    
    print("Making future dataframe...")
    future = model.make_future_dataframe(periods=3, freq="ME")
    print(future.tail())
    
    print("Predicting...")
    forecast = model.predict(future)
    print("Forecast columns:", forecast.columns.tolist())
    
    result = forecast.tail(3)[["ds", "yhat", "yhat_lower", "yhat_upper"]]
    print("Result tail:")
    print(result)

except Exception as e:
    print("ERROR DETECTED:")
    traceback.print_exc()
