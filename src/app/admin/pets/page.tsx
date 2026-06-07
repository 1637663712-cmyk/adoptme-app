"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { parsePhotos, formatDate } from "@/lib/utils";

interface Pet {
  id: string;
  title: string;
  species: string;
  status: string;
  source: string;
  isVerified: boolean;
  photos: string;
  location: string;
  createdAt: string;
  user?: { id: string; name: string; email: string };
}

export default function AdminPetsPage() {
  const { data: session, status } = useSession();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as { role: string }).role;
      if (role !== "ADMIN") { window.location.href = "/"; return; }
      fetch("/api/admin/pets").then((r) => r.json()).then(setPets);
    } else if (status === "unauthenticated") { window.location.href = "/login"; }
  }, [status, session]);

  async function toggleVerify(id: string, current: boolean) {
    const res = await fetch("/api/admin/pets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isVerified: !current }),
    });
    if (res.ok) {
      setPets((prev) => prev.map((p) => (p.id === id ? { ...p, isVerified: !current } : p)));
    }
  }

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🐾 宠物管理</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">标题</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">物种</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">来源</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">审核</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">发布者</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <a href={`/pets/${pet.id}`} className="font-medium text-gray-900 hover:text-orange-600 text-sm">{pet.title}</a>
                  <div className="text-xs text-gray-400 mt-0.5">{pet.location}</div>
                </td>
                <td className="px-4 py-3 text-sm">{pet.species === "DOG" ? "🐕" : pet.species === "CAT" ? "🐈" : "🐾"}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    pet.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                    pet.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                  }`}>{pet.status === "AVAILABLE" ? "可领养" : pet.status === "PENDING" ? "领养中" : "已领养"}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{pet.source === "USER_POSTED" ? "用户发布" : "抓取"}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toggleVerify(pet.id, pet.isVerified)}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                      pet.isVerified ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {pet.isVerified ? "✅ 已审核" : "⏳ 待审核"}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{pet.user?.name || pet.user?.email || "-"}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(pet.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
