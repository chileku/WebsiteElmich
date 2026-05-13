"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Box, ShoppingCart } from "lucide-react";
import { logoutClient } from "@/lib/auth-cookie";
import Sidebar from "@/component/admin/sidebar";
import Header from "@/component/admin/header";
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Products", href: "/admin/products", icon: Box },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  return (
    <div className="flex min-h-screen bg-[#111111]">
      <Sidebar></Sidebar>

      {/* CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <Header></Header>

        {/* MAIN */}
        <main className="p-3">
          <div className="rounded-2xl shadow-sm p-2">{children}</div>
        </main>
      </div>
    </div>
  );
}
