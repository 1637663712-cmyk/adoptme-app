"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoriteButton({ petId, isFavorited }: { petId: string; isFavorited: boolean }) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    if (favorited) {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId }),
      });
      if (res.ok) setFavorited(false);
    } else {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId }),
      });
      if (res.ok) setFavorited(true);
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`w-full py-3 rounded-xl font-semibold transition-colors ${
        favorited
          ? "bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100"
          : "border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
      }`}
    >
      {favorited ? "❤️ 已收藏" : "🤍 收藏"}
    </button>
  );
}
