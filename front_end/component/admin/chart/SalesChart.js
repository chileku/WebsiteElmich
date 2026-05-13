"use client";
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend,
} from "recharts";
import statsService from "@/service/stats";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { notation: "compact", compactDisplay: "short" }).format(value) + "đ";

const currentYear = new Date().getFullYear();
const YEARS = [currentYear, currentYear - 1, currentYear - 2];

export default function SalesChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(currentYear);
  const [chartType, setChartType] = useState("revenue"); // revenue | orders

  useEffect(() => {
    setLoading(true);
    statsService
      .getRevenueByMonth(year)
      .then((res) => {
        if (res.success) setData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year]);

  return (
    <div className="bg-[#1E1E1E] p-5 rounded-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">Tổng quan doanh thu</h2>
        <div className="flex items-center gap-2">
          {/* Toggle chart type */}
          <div className="flex bg-[#2A2A2A] rounded-lg overflow-hidden text-xs">
            <button
              onClick={() => setChartType("revenue")}
              className={`px-3 py-1.5 transition ${chartType === "revenue" ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Doanh thu
            </button>
            <button
              onClick={() => setChartType("orders")}
              className={`px-3 py-1.5 transition ${chartType === "orders" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              Đơn hàng
            </button>
          </div>
          {/* Year select */}
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-[#2A2A2A] text-gray-300 text-xs px-2 py-1.5 rounded-lg border border-gray-700 outline-none"
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          {chartType === "revenue" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 12 }} />
              <YAxis stroke="#aaa" tickFormatter={formatCurrency} width={70} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1E1E1E", border: "1px solid #444", borderRadius: 8 }}
                formatter={(val) => [new Intl.NumberFormat("vi-VN").format(val) + "đ", "Doanh thu"]}
                labelFormatter={(l) => `Tháng ${l.replace("T", "")}`}
              />
              <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid stroke="#333" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#aaa" tick={{ fontSize: 12 }} />
              <YAxis stroke="#aaa" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#1E1E1E", border: "1px solid #444", borderRadius: 8 }}
                formatter={(val) => [val, "Đơn hàng"]}
                labelFormatter={(l) => `Tháng ${l.replace("T", "")}`}
              />
              <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
