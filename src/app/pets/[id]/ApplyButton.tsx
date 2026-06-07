"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ApplyButton({ petId, alreadyApplied }: { petId: string; alreadyApplied: boolean }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (message.length < 10) {
      setError("申请信息至少10个字");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ petId, message }),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "提交失败");
    }
    setLoading(false);
  }

  if (alreadyApplied) {
    return (
      <button
        disabled
        className="w-full py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
      >
        ✅ 已申请领养
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
      >
        📝 申请领养
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📝 领养申请</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  申请信息 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="请介绍您的情况：是否有养宠经验、居住环境、家庭成员等信息..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">至少10个字</p>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? "提交中..." : "提交申请"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
