"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  createdAt: string;
  _count: { pets: number; applications: number };
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as { role: string }).role;
      if (role !== "ADMIN") { window.location.href = "/"; return; }
      fetch("/api/admin/users").then((r) => r.json()).then(setUsers);
    } else if (status === "unauthenticated") { window.location.href = "/login"; }
  }, [status, session]);

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">👥 用户管理</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">用户</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">邮箱</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">角色</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">发布</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">申请</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">注册时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{user.name || "未设置"}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${user.role === "ADMIN" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-600"}`}>
                    {user.role === "ADMIN" ? "管理员" : "用户"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{user._count.pets}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{user._count.applications}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
