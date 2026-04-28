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

export default function Chart({ data = [], type, dataKey, xAxis, xLabel, yLabel }) {
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
    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
      {type === "line" && (
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />
          <XAxis
            dataKey={xAxis}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dy={10}
          >
            {xLabel && (
              <Label
                value={xLabel}
                offset={-20}
                position="insideBottom"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </XAxis>
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dx={-10}
          >
            {yLabel && (
              <Label
                value={yLabel}
                angle={-90}
                position="insideLeft"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          {actualData.length > 0 ? (
            <Line
              type="monotone"
              data={actualData}
              dataKey={dataKey}
              name="Actual"
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
            />
          ) : (
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#3b82f6"
              strokeWidth={4}
              dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
            />
          )}
          {predictedData.length > 0 && (
            <Line
              type="monotone"
              data={predictedData}
              dataKey={dataKey}
              name="Predicted"
              stroke="#f43f5e"
              strokeWidth={3}
              strokeDasharray="8 5"
              dot={{ r: 4, fill: "#f43f5e" }}
            />
          )}
        </LineChart>
      )}

      {type === "bar" && (
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#ffffff05"
            vertical={false}
          />
          <XAxis
            dataKey={xAxis}
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dy={10}
          >
            {xLabel && (
              <Label
                value={xLabel}
                offset={-20}
                position="insideBottom"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </XAxis>
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dx={-10}
          >
            {yLabel && (
              <Label
                value={yLabel}
                angle={-90}
                position="insideLeft"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff05" }} />
          <Bar
            dataKey={dataKey}
            fill="#10b981"
            radius={[6, 6, 0, 0]}
            barSize={40}
          />
        </BarChart>
      )}

      {type === "area" && (
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorYhat" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
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
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dy={10}
          >
            {xLabel && (
              <Label
                value={xLabel}
                offset={-20}
                position="insideBottom"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </XAxis>
          <YAxis
            stroke="#94a3b8"
            fontSize={11}
            tickLine={true}
            axisLine={true}
            dx={-10}
          >
            {yLabel && (
              <Label
                value={yLabel}
                angle={-90}
                position="insideLeft"
                style={{ fill: '#64748b', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
              />
            )}
          </YAxis>
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#f59e0b"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorYhat)"
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
