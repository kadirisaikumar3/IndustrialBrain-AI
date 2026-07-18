import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useTheme } from "../../context/ThemeContext";

function FileTypeChart({ pdfCount, imageCount }) {
  const { theme } = useTheme();

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
    <div className="card-bg rounded-3xl border border-theme p-6 shadow-xl">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          📁 File Distribution
        </h2>

        <p className="mt-2 text-secondary">
          Distribution of uploaded PDF and image files.
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            innerRadius={55}
            paddingAngle={4}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background:
                theme === "dark"
                  ? "#1e293b"
                  : "#ffffff",
              border:
                theme === "dark"
                  ? "1px solid #334155"
                  : "1px solid #e5e7eb",
              borderRadius: "12px",
              color:
                theme === "dark"
                  ? "#f8fafc"
                  : "#0f172a",
            }}
          />

          <Legend
            wrapperStyle={{
              color:
                theme === "dark"
                  ? "#f8fafc"
                  : "#0f172a",
            }}
          />

        </PieChart>
      </ResponsiveContainer>

    </div>
  );
}

export default FileTypeChart;