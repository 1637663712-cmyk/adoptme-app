"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const speciesOptions = [
  { value: "", label: "全部物种" },
  { value: "DOG", label: "🐕 狗狗" },
  { value: "CAT", label: "🐈 猫咪" },
  { value: "OTHER", label: "🐾 其他" },
];

const sizeOptions = [
  { value: "", label: "不限体型" },
  { value: "SMALL", label: "小型" },
  { value: "MEDIUM", label: "中型" },
  { value: "LARGE", label: "大型" },
];

const sourceOptions = [
  { value: "", label: "不限来源" },
  { value: "USER_POSTED", label: "用户发布" },
  { value: "SCRAPED", label: "平台抓取" },
];

export default function PetFilters({ currentParams }: { currentParams: Record<string, string | undefined> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      router.push(`/pets?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = e.currentTarget;
      const input = form.querySelector("input") as HTMLInputElement;
      const params = new URLSearchParams(searchParams.toString());
      if (input.value) {
        params.set("query", input.value);
      } else {
        params.delete("query");
      }
      params.delete("page");
      router.push(`/pets?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            name="query"
            type="text"
            placeholder="搜索宠物..."
            defaultValue={currentParams.query || ""}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500">
            🔍
          </button>
        </div>
      </form>

      {/* Species Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">物种</h4>
        <div className="space-y-1">
          {speciesOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilter("species", opt.value)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                (currentParams.species || "") === opt.value
                  ? "bg-orange-100 text-orange-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">体型</h4>
        <div className="space-y-1">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilter("size", opt.value)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                (currentParams.size || "") === opt.value
                  ? "bg-orange-100 text-orange-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Source Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">信息来源</h4>
        <div className="space-y-1">
          {sourceOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilter("source", opt.value)}
              className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                (currentParams.source || "") === opt.value
                  ? "bg-orange-100 text-orange-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">城市</h4>
        <input
          type="text"
          placeholder="输入城市筛选..."
          defaultValue={currentParams.location || ""}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleFilter("location", (e.target as HTMLInputElement).value);
            }
          }}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none"
        />
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => router.push("/pets")}
        className="w-full py-2 text-sm text-orange-600 hover:text-orange-700 font-medium border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
      >
        清除所有筛选
      </button>
    </div>
  );
}
