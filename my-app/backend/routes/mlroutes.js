import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ USE VENV PYTHON (CRITICAL)
const PYTHON_PATH =
  "C:/Users/Manas K. Bhoir/Desktop/Aetheria_Duplicate/venv/Scripts/python.exe";

router.post("/predict", (req, res) => {
  const { model, data } = req.body;

  console.log("🔮 ML REQUEST:", req.body);

  if (!model || !data) {
    return res.status(400).json({ error: "Invalid ML input" });
  }

  const pythonScript = path.join(__dirname, "../ml/predict.py");

  const python = spawn(PYTHON_PATH, [
    pythonScript,
    JSON.stringify({ model, data })
  ]);

  let output = "";
  let errorOutput = "";

  python.stdout.on("data", (data) => {
    output += data.toString();
  });

  python.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  python.on("close", () => {
    if (errorOutput) {
      console.error("❌ ML ERROR:", errorOutput);
      return res.status(500).json({
        error: "ML prediction failed",
        details: errorOutput
      });
    }

    try {
      const result = JSON.parse(output);
      res.json(result);
    } catch (err) {
      console.error("❌ JSON PARSE ERROR:", output);
      res.status(500).json({
        error: "Invalid ML response",
        rawOutput: output
      });
    }
  });
});

export default router;
