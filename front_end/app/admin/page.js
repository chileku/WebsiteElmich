"use client";
import { useState, useEffect } from "react";
import StatsCards from "@/component/admin/StatsCards";
import SalesChart from "@/component/admin/chart/SalesChart";
import CategoryChart from "@/component/admin/chart/CategoryChart";
import statsService from "@/service/stats";

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService
      .getStats()
      .then((res) => {
        if (res.success) setStatsData(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <StatsCards data={statsData} loading={loading} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <SalesChart />
        <CategoryChart />
      </div>
    </div>
  );
}
