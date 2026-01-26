import {
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* ===============================
   PDF EXPORT UTILITY
   =============================== */
const exportChartToPDF = async (id, title) => {
  const element = document.getElementById(id);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF("landscape");
  pdf.text(title, 10, 10);
  pdf.addImage(imgData, "PNG", 10, 20, 270, 150);
  pdf.save(`${title}.pdf`);
};

/* ===============================
   LINE CHART
   =============================== */
export function LineChartComponent({
  id,
  data,
  xKey,
  yKey,
  title,
  yDomain = [0, 100],
}) {
  return (
    <div id={id} className="bg-gray-800 text-white p-4 rounded relative">
      <button
        onClick={() => exportChartToPDF(id, title)}
        className="absolute top-2 right-2 text-sm bg-blue-600 px-2 py-1 rounded"
      >
        Export PDF
      </button>

      <h3 className="mb-3 font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <ReLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis domain={yDomain} />
          <Tooltip />
          <Line type="monotone" dataKey={yKey} strokeWidth={3} />
        </ReLineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ===============================
   BAR CHART
   =============================== */
export function BarChartComponent({ id, data, xKey, yKey, title }) {
  return (
    <div id={id} className="bg-gray-800 text-white p-4 rounded relative">
      <button
        onClick={() => exportChartToPDF(id, title)}
        className="absolute top-2 right-2 text-sm bg-green-600 px-2 py-1 rounded"
      >
        Export PDF
      </button>

      <h3 className="mb-3 font-semibold">{title}</h3>

      <ResponsiveContainer width="100%" height={250}>
        <ReBarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey} radius={[6, 6, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ===============================
   PIE CHART
   =============================== */
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d84d8b"];

export default function PieChartComponent({
  id,
  data = [],
  nameKey,
  valueKey,
  title,
}) {
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <div
      id={id}
      className="bg-gray-800 text-white p-4 rounded relative min-h-[320px]"
    >
      <button
        onClick={() => exportChartToPDF(id, title)}
        className="absolute top-2 right-2 text-sm bg-purple-600 px-2 py-1 rounded"
      >
        Export PDF
      </button>

      <h3 className="mb-3 font-semibold">{title}</h3>

      {!hasData ? (
        <div className="flex items-center justify-center h-[250px] text-gray-400">
          No data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <RePieChart>
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              outerRadius={90}
              label
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RePieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
