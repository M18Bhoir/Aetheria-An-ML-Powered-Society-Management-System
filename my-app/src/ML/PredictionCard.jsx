import { AlertTriangle, CheckCircle, DollarSign } from "lucide-react";

const PredictionCard = ({ prediction }) => {
  // ✅ Guard clause (MOST IMPORTANT)
  if (!prediction || prediction.type !== 'linear_regression') {
    return (
      <div className="p-6 rounded-xl bg-gray-800 text-white shadow-lg">
        <p className="text-gray-300">
          AI prediction is currently unavailable.
        </p>
      </div>
    );
  }

  const {
    predicted_amount = 0,
    risk_level = "Low",
    confidence = 0
  } = prediction;

  const riskStyles = {
    Low: {
      bg: "bg-green-700",
      text: "text-green-100",
      icon: <CheckCircle className="text-green-200" />
    },
    Medium: {
      bg: "bg-yellow-700",
      text: "text-yellow-100",
      icon: <AlertTriangle className="text-yellow-200" />
    },
    High: {
      bg: "bg-red-700",
      text: "text-red-100",
      icon: <AlertTriangle className="text-red-200" />
    }
  };

  const style = riskStyles[risk_level] || riskStyles.Low;

  return (
    <div className={`p-6 rounded-xl shadow-lg ${style.bg} text-white`}>
      <div className="flex items-center mb-4">
        <div className="p-3 bg-black/30 rounded-full mr-3">
          <DollarSign className="text-white" />
        </div>
        <h3 className="text-lg font-bold">AI Prediction</h3>
      </div>

      <p className="text-sm text-gray-200">
        Predicted Maintenance Amount
      </p>

      <p className="text-3xl font-bold mb-3">
        ₹ {Number(predicted_amount).toLocaleString("en-IN")}
      </p>

      <div className={`flex items-center gap-2 font-semibold ${style.text}`}>
        {style.icon}
        Risk Level: {risk_level}
      </div>

      <p className="text-xs text-gray-300 mt-1">
        Confidence: {(confidence * 100).toFixed(0)}%
      </p>
    </div>
  );
};

export default PredictionCard;
