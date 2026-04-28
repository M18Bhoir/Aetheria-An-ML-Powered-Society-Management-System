// backend/routes/mlroutes.js
import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy to the dedicated ML FastAPI service
router.post("/predict", async (req, res) => {
  const { model, data } = req.body;

  if (!model || !data) {
    return res.status(400).json({ error: "Invalid ML input" });
  }

  try {
    // Route to the appropriate FastAPI endpoint based on model type
    let endpoint = "http://localhost:8000/predict-maintenance";

    // If the system expands to other models, logic can be added here
    const response = await axios.post(endpoint, data);
    res.json(response.data);
  } catch (err) {
    console.error("❌ ML Proxy Error:", err.message);
    res.status(500).json({
      error: "ML prediction service unreachable",
      details: err.message,
    });
  }
});

export default router;
