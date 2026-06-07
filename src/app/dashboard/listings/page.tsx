"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { parsePhotos, formatDate } from "@/lib/utils";

interface Pet {
  id: string;
  title: string;
  species: string;
  status: string;
  photos: string;
  location: string;
  viewCount: number;
  createdAt: string;
}

export default function MyListingsPage() {
  const { data: session, status } = useSession();
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/login";
      return;
    }
    if (status === "authenticated") {
      fetch("/api/pets?status=")
        .then((r) => r.json())
        .then((data) => {
          if (data.pets) setPets(data.pets.filter((p: Pet & { userId: string }) => p.userId === (session?.user as { id: string }).id));
        });
    }
  }, [status, session]);

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📋 我的发布</h1>
        <Link
          href="/dashboard/listings/new"
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600"
        >
          发布新信息
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-lg">你还没有发布领养信息</p>
          <Link href="/dashboard/listings/new" className="text-orange-500 hover:text-orange-600 mt-2 inline-block font-semibold">
            立即发布 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pets.map((pet) => {
            const photos = parsePhotos(pet.photos);
            return (
              <div key={pet.id} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {photos[0] ? (
                    <img src={photos[0]} alt={pet.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">{pet.species === "DOG" ? "🐕" : pet.species === "CAT" ? "🐈" : "🐾"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{pet.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      pet.status === "AVAILABLE" ? "bg-green-100 text-green-700" :
                      pet.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {pet.status === "AVAILABLE" ? "可领养" : pet.status === "PENDING" ? "领养中" : "已领养"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">📍 {pet.location} · 👁 {pet.viewCount} · 🕐 {formatDate(pet.createdAt)}</p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/listings/${pet.id}/edit`}
                    className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    编辑
                  </Link>
                  <Link
                    href={`/pets/${pet.id}`}
                    className="px-3 py-1.5 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50"
                  >
                    查看
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
