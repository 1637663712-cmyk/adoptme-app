"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalUsers: number;
  totalPets: number;
  availablePets: number;
  adoptedPets: number;
  totalApplications: number;
  totalScrapeLogs: number;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { window.location.href = "/login"; return; }
    if (status === "authenticated") {
      const role = (session?.user as { role: string }).role;
      if (role !== "ADMIN") { window.location.href = "/"; return; }
      fetch("/api/admin/stats").then((r) => r.json()).then(setStats);
    }
  }, [status, session]);

  if (status === "loading" || !stats) return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🛡️ 管理后台</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: "总用户", value: stats.totalUsers, color: "text-blue-500" },
          { label: "总宠物", value: stats.totalPets, color: "text-orange-500" },
          { label: "可领养", value: stats.availablePets, color: "text-green-500" },
          { label: "已领养", value: stats.adoptedPets, color: "text-gray-500" },
          { label: "申请数", value: stats.totalApplications, color: "text-purple-500" },
          { label: "爬虫日志", value: stats.totalScrapeLogs, color: "text-teal-500" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/pets" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">🐾</div>
          <h3 className="font-semibold text-gray-900">宠物管理</h3>
          <p className="text-sm text-gray-500 mt-1">审核、管理所有宠物信息</p>
        </Link>
        <Link href="/admin/users" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900">用户管理</h3>
          <p className="text-sm text-gray-500 mt-1">查看和管理注册用户</p>
        </Link>
        <Link href="/admin/scraping" className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
          <div className="text-3xl mb-3">🕷️</div>
          <h3 className="font-semibold text-gray-900">爬虫管理</h3>
          <p className="text-sm text-gray-500 mt-1">管理爬虫任务和日志</p>
        </Link>
      </div>
    </div>
  );
}
