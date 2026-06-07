"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { parsePhotos, formatDate } from "@/lib/utils";

interface Application {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  pet: {
    id: string;
    title: string;
    species: string;
    photos: string;
    status: string;
    location: string;
  };
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") { window.location.href = "/login"; return; }
    if (status === "authenticated") {
      fetch("/api/applications")
        .then((r) => r.json())
        .then(setApplications);
    }
  }, [status]);

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📨 我的申请</h1>

      {applications.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">📨</p>
          <p className="text-lg">还没有提交领养申请</p>
          <Link href="/pets" className="text-orange-500 hover:text-orange-600 mt-2 inline-block font-semibold">去看看待领养宠物 →</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const photos = parsePhotos(app.pet.photos);
            return (
              <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <Link href={`/pets/${app.pet.id}`} className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {photos[0] ? (
                    <img src={photos[0]} alt={app.pet.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{app.pet.species === "DOG" ? "🐕" : app.pet.species === "CAT" ? "🐈" : "🐾"}</span>
                  )}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Link href={`/pets/${app.pet.id}`} className="font-semibold text-gray-900 hover:text-orange-600 truncate">{app.pet.title}</Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      app.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      app.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {app.status === "PENDING" ? "审核中" : app.status === "APPROVED" ? "已通过" : "已拒绝"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-1 mb-1">{app.message}</p>
                  <p className="text-xs text-gray-400">📍 {app.pet.location} · 🕐 {formatDate(app.createdAt)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
