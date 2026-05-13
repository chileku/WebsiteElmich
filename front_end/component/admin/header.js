"use client";

import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname(); // ✅ đúng

  const isDashboard = pathname === "/admin" || pathname === "/admin/";

  return (
    <div className="px-7 py-7">
      <header className="bg-[#1E1E1E] rounded-sm text-white px-6 py-3 flex items-center justify-between shadow">
        {/* LEFT */}
        <h1 className="text-lg font-semibold">
          {isDashboard ? "Dashboard" : ""}
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-6">
          <img
            src="https://flagcdn.com/w40/vn.png"
            alt="Vietnam"
            className="w-6 h-4 object-cover rounded-sm"
          />

          <Bell className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white" />

          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/admin.png"
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-200">Admin</span>
          </div>
        </div>
      </header>
    </div>
  );
}
