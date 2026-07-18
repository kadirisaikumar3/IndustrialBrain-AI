import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { useTheme } from "../../context/ThemeContext";

function UploadTrendChart() {
  const [data, setData] = useState([]);

  const { theme } = useTheme();

  useEffect(() => {
    loadTrend();
  }, []);

  const loadTrend = async () => {
    try {
      const response = await API.get("/dashboard/trend");
      setData(response.data);
    } catch (error) {
      console.error("Unable to load upload trend:", error);
    }
  };

  return (
    <div className="card-bg rounded-3xl border border-theme p-6 shadow-xl">

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary">
          📈 Weekly Upload Trend
        </h2>

        <p className="mt-2 text-secondary">
          Number of documents uploaded over the past week.
        </p>
      </div>

      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === "dark" ? "#334155" : "#d1d5db"}
          />

          <XAxis
            dataKey="day"
            stroke={theme === "dark" ? "#94a3b8" : "#475569"}
          />

          <YAxis
            stroke={theme === "dark" ? "#94a3b8" : "#475569"}
          />

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

          <Line
            type="monotone"
            dataKey="uploads"
            stroke="#06b6d4"
            strokeWidth={4}
            dot={{
              r: 5,
              fill: "#06b6d4",
            }}
            activeDot={{
              r: 7,
            }}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}

export default UploadTrendChart;