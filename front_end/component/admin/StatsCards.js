"use client";
import { Package, Boxes, TrendingUp, Layers, Users, ShoppingCart, Clock } from "lucide-react";

const formatNumber = (num) => new Intl.NumberFormat("vi-VN").format(num);
const formatCurrency = (num) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);

const STAT_CONFIGS = [
  {
    key: "revenue",
    title: "Doanh thu",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-500/10",
    format: "currency",
  },
  {
    key: "orders",
    title: "Tổng đơn hàng",
    icon: ShoppingCart,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    format: "number",
  },
  {
    key: "products",
    title: "Tổng sản phẩm",
    icon: Package,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    format: "number",
  },
  {
    key: "users",
    title: "Khách hàng",
    icon: Users,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    format: "number",
  },
  {
    key: "stock",
    title: "Tổng tồn kho",
    icon: Boxes,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    format: "number",
  },
  {
    key: "pendingOrders",
    title: "Đơn chờ xử lý",
    icon: Clock,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    format: "number",
  },
  {
    key: "categories",
    title: "Danh mục",
    icon: Layers,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    format: "number",
  },
];

export default function StatsCards({ data, loading = false }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {STAT_CONFIGS.map((item) => {
        const Icon = item.icon;
        const raw = data?.[item.key] ?? 0;
        const display =
          item.format === "currency" ? formatCurrency(raw) : formatNumber(raw);

        return (
          <div
            key={item.key}
            className="bg-[#1E1E1E] text-white p-5 rounded-xl flex items-center justify-between
                       hover:bg-[#2A2A2A] transition-all duration-300 hover:scale-[1.02] border border-transparent
                       hover:border-gray-700"
          >
            <div>
              <p className="text-gray-400 text-sm">{item.title}</p>
              {loading ? (
                <div className="h-7 w-24 bg-gray-700 animate-pulse rounded mt-2" />
              ) : (
                <h2 className={`text-xl font-bold mt-1 ${item.color}`}>
                  {display}
                </h2>
              )}
            </div>
            <div className={`${item.bg} p-3 rounded-xl`}>
              <Icon className={`w-6 h-6 ${item.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
