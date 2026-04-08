from fastapi import FastAPI, HTTPException
from typing import List, Dict
import pandas as pd
from prophet import Prophet
import uvicorn

app = FastAPI(
    title="Maintenance & Equipment Failure Prediction Service",
    description="Prophet-based time series forecasting for maintenance collection and equipment failure risk",
    version="2.0.0"
)

# =========================================================
# 🔧 MAINTENANCE PREDICTION (ON-THE-FLY TRAINING)
# =========================================================
@app.post("/predict-maintenance")
def predict_maintenance(data: List[Dict]):
    try:
        if not data or len(data) < 2:
            raise HTTPException(
                status_code=400,
                detail="At least two data points are required"
            )

        df = pd.DataFrame(data)

        if "ds" not in df.columns or "y" not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="Missing required fields: ds, y"
            )

        df["ds"] = pd.to_datetime(df["ds"], errors="coerce")

        if df["ds"].isnull().any():
            raise HTTPException(status_code=400, detail="Invalid date format in ds")

        # Train Prophet model
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False
        )

        model.fit(df)

        # Predict next 3 months
        future = model.make_future_dataframe(periods=3, freq="M")
        forecast = model.predict(future)

        result = forecast.tail(3)[["ds", "yhat", "yhat_lower", "yhat_upper"]]

        return result.to_dict(orient="records")

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


# =========================================================
# ⚙️ EQUIPMENT FAILURE PREDICTION (ON-THE-FLY TRAINING)
# =========================================================
@app.post("/predict-equipment-failure")
def predict_equipment_failure(data: List[Dict]):
    import traceback

    try:
        if not data or len(data) < 3:
            raise HTTPException(status_code=400, detail="At least 3 data points required")

        df = pd.DataFrame(data)

        # Validate required fields
        if "ds" not in df.columns or "y" not in df.columns:
            raise HTTPException(status_code=400, detail="Missing ds or y")

        # Convert datetime
        df["ds"] = pd.to_datetime(df["ds"], errors="coerce").dt.tz_localize(None)

        # Clean numeric values
        df["y"] = pd.to_numeric(df["y"], errors="coerce")
        df = df.dropna(subset=["ds", "y"])

        if df.empty or df["ds"].nunique() < 2:
            raise HTTPException(status_code=400, detail="Not enough valid time-series data")

        # Optional regressors
        regressors = []
        if "temperature_avg" in df.columns:
            df["temperature_avg"] = pd.to_numeric(df["temperature_avg"], errors="coerce")
            regressors.append("temperature_avg")

        if "equipment_age_days" in df.columns:
            df["equipment_age_days"] = pd.to_numeric(df["equipment_age_days"], errors="coerce")
            regressors.append("equipment_age_days")

        # Build model
        model = Prophet(
            yearly_seasonality=False,
            weekly_seasonality=True,
            daily_seasonality=False
        )

        for reg in regressors:
            model.add_regressor(reg)

        model.fit(df)

        # Future dataframe
        future = model.make_future_dataframe(periods=7, freq="D")

        for reg in regressors:
            future[reg] = df[reg].iloc[-1]

        forecast = model.predict(future)

        forecast["failure_risk"] = forecast["yhat"] > 75

        result = forecast[["ds", "yhat", "failure_risk"]].tail(7)

        return result.to_dict(orient="records")

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()  # 🔥 print full error
        raise HTTPException(
            status_code=500,
            detail=f"Equipment prediction failed: {str(e)}"
        )


# =========================================================
# 📊 TASK PRIORITIZATION (HEURISTIC-BASED ML SCORING)
# =========================================================
@app.post("/predict-priority")
def predict_priority(tasks: List[Dict]):
    """
    Calculates a priority score (0-100) for tasks based on:
    - Urgency (User provided)
    - Category Weight
    - Time Since Creation
    """
    weights = {
        "Plumbing": 1.5,
        "Electrical": 1.4,
        "Security": 1.6,
        "Cleanliness": 1.0,
        "Common Area": 1.2,
        "Other": 1.0
    }

    results = []
    for task in tasks:
        urgency = float(task.get("urgency", 1)) # 1 to 5
        category = task.get("category", "Other")
        days_open = float(task.get("days_open", 0))

        cat_weight = weights.get(category, 1.0)
        
        # Base Score: Urgency * Category Weight
        # Multiplier for aging tasks
        age_factor = 1 + (days_open / 10) # 10% increase every 10 days
        
        priority_score = (urgency * 15) * cat_weight * age_factor
        priority_score = min(100, max(0, priority_score))

        results.append({
            "id": task.get("id"),
            "priority_score": round(priority_score, 2),
            "label": "High" if priority_score > 75 else "Medium" if priority_score > 40 else "Low"
        })

    # Sort by priority score descending
    results.sort(key=lambda x: x["priority_score"], reverse=True)
    return results



# =========================================================
# 🚀 RUN SERVER
# =========================================================
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
