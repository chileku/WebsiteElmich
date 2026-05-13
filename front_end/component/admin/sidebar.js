"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // 👈 thêm
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  ShoppingCart,
  Settings,
  Mail,
  Bell,
  HelpCircle,
  Menu,
  Layers,
  Receipt,
} from "lucide-react";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Quản lý sản phẩm", icon: Package, path: "/admin/products" },
  { name: "Quản lý danh mục", icon: Layers, path: "/admin/categories" },
  { name: "Quản lý tài khoản", icon: Users, path: "/admin/users" },
  { name: "Quản lý mã giảm giá", icon: ShoppingCart, path: "/admin/discounts" },
  { name: "Quản lý hóa đơn bán", icon: Receipt, path: "/admin/salesInvoice" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); // 👈 lấy path hiện tại

  return (
    <div
      className={`min-h-screen  bg-[#1E1E1E] text-white flex flex-col justify-between p-4 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div>
        {/* Toggle */}
        <div className="mb-6">
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="inline-flex p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
          >
            <Menu className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Menu */}
        <ul className="space-y-2">
          {menu.map((item, index) => {
            const Icon = item.icon;

            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.path);

            return (
              <li
                key={index}
                onClick={() => router.push(item.path)}
                className={`flex items-center ${
                  collapsed ? "justify-center" : "gap-3"
                } px-3 py-3 rounded-lg cursor-pointer transition 
      ${
        isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
      }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />

                {!collapsed && <span className="text-sm">{item.name}</span>}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
