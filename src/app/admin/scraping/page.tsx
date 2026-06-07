"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";

interface ScrapeLog {
  id: string;
  source: string;
  status: string;
  itemsFound: number;
  itemsNew: number;
  error: string;
  startedAt: string;
  finishedAt: string;
}

export default function AdminScrapingPage() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<ScrapeLog[]>([]);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      const role = (session?.user as { role: string }).role;
      if (role !== "ADMIN") { window.location.href = "/"; return; }
      loadLogs();
    } else if (status === "unauthenticated") { window.location.href = "/login"; }
  }, [status, session]);

  async function loadLogs() {
    const res = await fetch("/api/scraping");
    const data = await res.json();
    if (Array.isArray(data)) setLogs(data);
  }

  async function triggerScrape() {
    setTriggering(true);
    await fetch("/api/scraping", { method: "POST" });
    await loadLogs();
    setTriggering(false);
  }

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🕷️ 爬虫管理</h1>
        <button
          onClick={triggerScrape}
          disabled={triggering}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
        >
          {triggering ? "触发中..." : "手动触发爬虫"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-3">爬虫数据源</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "微博超话", key: "weibo", desc: "搜索 #宠物领养# #领养代替购买# 等话题" },
            { name: "闲鱼", key: "xianyu", desc: "搜索\"宠物领养\"分类下的商品" },
            { name: "58同城", key: "58tongcheng", desc: "宠物频道免费领养板块" },
          ].map((s) => (
            <div key={s.key} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 text-sm">{s.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
              <p className="text-xs text-gray-400 mt-1">状态: 就绪</p>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-4">📋 运行日志</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">来源</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">状态</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">发现</th>
              <th className="text-center px-4 py-3 text-sm font-semibold text-gray-600">新增</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">暂无日志</td></tr>
            ) : logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{log.source}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    log.status === "success" ? "bg-green-100 text-green-700" :
                    log.status === "failed" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>{log.status === "success" ? "成功" : log.status === "failed" ? "失败" : "部分"}</span>
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{log.itemsFound}</td>
                <td className="px-4 py-3 text-sm text-center text-gray-600">{log.itemsNew}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{formatDate(log.startedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
