import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function FileTypeChart({ pdfCount, imageCount }) {

  const data = [
    {
      name: "PDF",
      value: pdfCount,
    },
    {
      name: "Images",
      value: imageCount,
    },
  ];

  const COLORS = ["#06b6d4", "#8b5cf6"];

  return (

    <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6">

      <h2 className="mb-6 text-2xl font-bold text-white">
        📁 File Distribution
      </h2>

      <ResponsiveContainer width="100%" height={300}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />

            ))}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>

  );

}

export default FileTypeChart;