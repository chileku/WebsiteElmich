"use client";
import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import statsService from "@/service/stats";

const ORDER_COLORS = ["#fbbf24", "#3b82f6", "#a855f7", "#22c55e", "#ef4444"];
const PRODUCT_COLORS = ["#ff6b6b", "#4dabf7", "#ffd43b", "#38d9a9", "#9775fa"];

export default function CategoryChart() {
  const [orderData, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("orders"); // orders | products

  useEffect(() => {
    Promise.all([
      statsService.getOrderStatusStats(),
      statsService.getTopProducts(5),
    ])
      .then(([orderRes, productRes]) => {
        if (orderRes.success) setOrderData(orderRes.data);
        if (productRes.success) {
          setProductData(
            productRes.data.map((p) => ({ name: p.name, value: p.value }))
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const data = view === "orders" ? orderData : productData;
  const colors = view === "orders" ? ORDER_COLORS : PRODUCT_COLORS;
  const title = view === "orders" ? "Tỉ lệ trạng thái đơn" : "Top 5 sản phẩm bán chạy";

  return (
    <div className="bg-[#1E1E1E] p-5 rounded-xl text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex bg-[#2A2A2A] rounded-lg overflow-hidden text-xs">
          <button
            onClick={() => setView("orders")}
            className={`px-3 py-1.5 transition ${view === "orders" ? "bg-yellow-500 text-black font-semibold" : "text-gray-400 hover:text-white"}`}
          >
            Đơn hàng
          </button>
          <button
            onClick={() => setView("products")}
            className={`px-3 py-1.5 transition ${view === "products" ? "bg-red-500 text-white font-semibold" : "text-gray-400 hover:text-white"}`}
          >
            Sản phẩm
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-500 text-sm">
          Chưa có dữ liệu
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              outerRadius={100}
              label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1E1E1E", border: "1px solid #444", borderRadius: 8 }}
              formatter={(val, name) => [val, name]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: "#ccc", fontSize: 11 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
