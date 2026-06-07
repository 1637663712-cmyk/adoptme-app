"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { parsePhotos, formatDate } from "@/lib/utils";

interface Favorite {
  id: string;
  pet: {
    id: string;
    title: string;
    species: string;
    breed: string;
    photos: string;
    status: string;
    location: string;
    createdAt: string;
  };
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") { window.location.href = "/login"; return; }
    if (status === "authenticated") {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then(setFavorites);
    }
  }, [status]);

  async function removeFavorite(petId: string) {
    await fetch("/api/favorites", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId }),
    });
    setFavorites((prev) => prev.filter((f) => f.pet.id !== petId));
  }

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">❤️ 我的收藏</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-lg">还没有收藏任何宠物</p>
          <Link href="/pets" className="text-orange-500 hover:text-orange-600 mt-2 inline-block font-semibold">去发现可爱的毛孩子 →</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const photos = parsePhotos(fav.pet.photos);
            return (
              <div key={fav.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm group">
                <Link href={`/pets/${fav.pet.id}`} className="block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden">
                    {photos[0] ? (
                      <img src={photos[0]} alt={fav.pet.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-4xl">{fav.pet.species === "DOG" ? "🐕" : fav.pet.species === "CAT" ? "🐈" : "🐾"}</span>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/pets/${fav.pet.id}`} className="font-semibold text-gray-900 hover:text-orange-600 truncate block">{fav.pet.title}</Link>
                  <p className="text-sm text-gray-500">📍 {fav.pet.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      fav.pet.status === "AVAILABLE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {fav.pet.status === "AVAILABLE" ? "可领养" : "已领养"}
                    </span>
                    <button onClick={() => removeFavorite(fav.pet.id)} className="text-sm text-red-500 hover:text-red-600">取消收藏</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
