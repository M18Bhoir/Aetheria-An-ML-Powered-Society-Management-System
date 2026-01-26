from fastapi import FastAPI
import pandas as pd
from sklearn.linear_model import LinearRegression
import numpy as np

app = FastAPI()

@app.post("/predict-maintenance")
def predict_maintenance(data: list):
    df = pd.DataFrame(data)

    # Convert month → number
    df["month_index"] = range(len(df))

    X = df[["month_index"]]
    y = df["collectionRate"]

    model = LinearRegression()
    model.fit(X, y)

    # Predict next 3 months
    future_months = 3
    future_index = np.array(
        range(len(df), len(df) + future_months)
    ).reshape(-1, 1)

    predictions = model.predict(future_index)

    results = []
    for i, pred in enumerate(predictions):
        results.append({
            "monthIndex": int(future_index[i][0]),
            "predictedCollectionRate": round(float(pred), 2)
        })

    return results
