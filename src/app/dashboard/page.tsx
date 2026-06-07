"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface DashboardStats {
  pets: number;
  applications: number;
  favorites: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats>({ pets: 0, applications: 0, favorites: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([
        fetch("/api/pets?status=&limit=1").then((r) => r.json()).catch(() => ({ pagination: { total: 0 } })),
        fetch("/api/applications").then((r) => r.json()).catch(() => []),
        fetch("/api/favorites").then((r) => r.json()).catch(() => []),
      ]).then(([petsData, applications, favorites]) => {
        setStats({
          pets: petsData.pagination?.total || 0,
          applications: Array.isArray(applications) ? applications.length : 0,
          favorites: Array.isArray(favorites) ? favorites.length : 0,
        });
        setLoading(false);
      });
    } else if (status === "unauthenticated") {
      window.location.href = "/login";
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin text-4xl">🐾</div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">👋 你好，{session?.user?.name || "用户"}</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-orange-500">{stats.pets}</div>
          <div className="text-sm text-gray-500 mt-1">我的发布</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-500">{stats.applications}</div>
          <div className="text-sm text-gray-500 mt-1">领养申请</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-red-500">{stats.favorites}</div>
          <div className="text-sm text-gray-500 mt-1">我的收藏</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/listings/new"
            className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
          >
            <span className="text-2xl">📝</span>
            <span className="text-sm font-medium text-gray-700">发布领养信息</span>
          </Link>
          <Link
            href="/dashboard/listings"
            className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <span className="text-sm font-medium text-gray-700">管理我的发布</span>
          </Link>
          <Link
            href="/dashboard/applications"
            className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
          >
            <span className="text-2xl">📨</span>
            <span className="text-sm font-medium text-gray-700">查看申请</span>
          </Link>
          <Link
            href="/dashboard/favorites"
            className="flex flex-col items-center gap-2 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <span className="text-2xl">❤️</span>
            <span className="text-sm font-medium text-gray-700">我的收藏</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
