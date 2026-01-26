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
  LabelList,
} from "recharts";

/* ================= HELPERS ================= */

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatXAxis = (value, xAxis) => {
  if (xAxis === "month") return MONTHS[value - 1] || value;
  return value;
};

const formatValue = (value, dataKey) => {
  if (dataKey.toLowerCase().includes("rate")) return `${value}%`;
  return value;
};

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label, xAxis, dataKey }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-900 text-white p-2 rounded text-sm">
      <p className="font-semibold">{formatXAxis(label, xAxis)}</p>
      <p>
        {dataKey}: {formatValue(payload[0].value, dataKey)}
      </p>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */

export default function Chart({
  data = [],
  type,
  dataKey,
  xAxis,
  showLabels = true, // 🔥 toggle labels
}) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No data available
      </div>
    );
  }

  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 50 },
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === "line" && (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={xAxis}
            tickFormatter={(v) => formatXAxis(v, xAxis)}
            angle={data.length > 6 ? -30 : 0}
            textAnchor="end"
          >
            <Label value={xAxis.toUpperCase()} position="bottom" />
          </XAxis>

          <YAxis tickFormatter={(v) => formatValue(v, dataKey)}>
            <Label
              value={dataKey.toUpperCase()}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip
            content={<CustomTooltip xAxis={xAxis} dataKey={dataKey} />}
          />

          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#8884d8"
            strokeWidth={2}
          >
            {showLabels && (
              <LabelList
                dataKey={dataKey}
                position="top"
                formatter={(v) => formatValue(v, dataKey)}
              />
            )}
          </Line>
        </LineChart>
      )}

      {type === "bar" && (
        <BarChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={xAxis}
            angle={data.length > 6 ? -30 : 0}
            textAnchor="end"
          >
            <Label value={xAxis.toUpperCase()} position="bottom" />
          </XAxis>

          <YAxis>
            <Label
              value={dataKey.toUpperCase()}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip
            content={<CustomTooltip xAxis={xAxis} dataKey={dataKey} />}
          />

          <Bar dataKey={dataKey} fill="#82ca9d">
            {showLabels && <LabelList dataKey={dataKey} position="top" />}
          </Bar>
        </BarChart>
      )}

      {type === "area" && (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey={xAxis}
            angle={data.length > 6 ? -30 : 0}
            textAnchor="end"
          >
            <Label value={xAxis.toUpperCase()} position="bottom" />
          </XAxis>

          <YAxis>
            <Label
              value={dataKey.toUpperCase()}
              angle={-90}
              position="insideLeft"
            />
          </YAxis>

          <Tooltip
            content={<CustomTooltip xAxis={xAxis} dataKey={dataKey} />}
          />

          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#ffc658"
            fill="#ffc658"
            fillOpacity={0.6}
          >
            {showLabels && <LabelList dataKey={dataKey} position="top" />}
          </Area>
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
