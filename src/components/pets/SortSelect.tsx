"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/pets?${params.toString()}`);
  }

  return (
    <select
      className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
      defaultValue={currentSort}
      onChange={handleSortChange}
    >
      <option value="newest">最新发布</option>
      <option value="oldest">最早发布</option>
      <option value="views">最多浏览</option>
    </select>
  );
}
