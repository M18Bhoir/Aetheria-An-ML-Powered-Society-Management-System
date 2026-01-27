import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

/* ================= HELPERS ================= */

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900 text-white p-2 rounded text-sm">
      <p className="font-semibold">{label}</p>
      {payload.map((item, index) => (
        <p key={index} style={{ color: item.color }}>
          {item.name}: {item.value}
        </p>
      ))}
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function Chart({
  data = [],
  type,
  dataKey,
  xAxis,
  showLabels = true,
}) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const actualData = data.filter((d) => d.type === "actual");
  const predictedData = data.filter((d) => d.type === "predicted");

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "line" && (
        <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey={xAxis}>
            <Label value={xAxis.toUpperCase()} position="bottom" />
          </XAxis>

          <YAxis>
            <Label
              value={dataKey.toUpperCase()}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip content={<CustomTooltip />} />

          {/* 🔵 ACTUAL */}
          <Line
            data={actualData}
            type="monotone"
            dataKey={dataKey}
            name="Actual"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ r: 3 }}
          />

          {/* 🔴 PREDICTED */}
          <Line
            data={predictedData}
            type="monotone"
            dataKey={dataKey}
            name="Predicted"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 4"
            dot={{ r: 4 }}
          />
        </LineChart>
      )}

      {type === "bar" && (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={dataKey} fill="#22c55e" />
        </BarChart>
      )}

      {type === "area" && (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxis} />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#f59e0b"
            fill="#fde68a"
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
