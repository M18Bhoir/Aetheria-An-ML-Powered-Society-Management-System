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

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f172a]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
      <p className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase">
        {label}
      </p>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <p className="text-sm font-semibold text-white">
            {item.name}:{" "}
            <span className="text-slate-300 font-normal">{item.value}</span>
          </p>
        </div>
      ))}
    </div>
  );
};

export default function Chart({ data = [], type, dataKey, xAxis }) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 italic">
        No data available
      </div>
    );
  }

  const actualData = data.filter((d) => d.type === "actual");
  const predictedData = data.filter((d) => d.type === "predicted");

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={250}>
      {type === "line" && (
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />
          <XAxis
            dataKey={xAxis}
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {actualData.length > 0 ? (
            <Line
              type="monotone"
              data={actualData}
              dataKey={dataKey}
              name="Actual"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            />
          )}
          {predictedData.length > 0 && (
            <Line
              type="monotone"
              data={predictedData}
              dataKey={dataKey}
              name="Predicted"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4, fill: "#ef4444" }}
            />
          )}
        </LineChart>
      )}

      {type === "bar" && (
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />
          <XAxis
            dataKey={xAxis}
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff05" }} />
          <Bar
            dataKey={dataKey}
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        </BarChart>
      )}

      {type === "area" && (
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorYhat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />
          <XAxis
            dataKey={xAxis}
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#64748b"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#f59e0b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorYhat)"
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
