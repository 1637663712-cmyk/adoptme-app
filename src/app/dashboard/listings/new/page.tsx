"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewListingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");

  function addPhoto() {
    if (photoInput && !photos.includes(photoInput)) {
      setPhotos([...photos, photoInput]);
      setPhotoInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, unknown> = { photos };
    const fields = ["title", "species", "breed", "age", "gender", "size", "color", "location", "description", "contactName", "contactPhone", "contactWechat"];
    for (const field of fields) {
      const val = formData.get(field) as string;
      if (val) data[field] = val;
    }

    const res = await fetch("/api/pets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const pet = await res.json();
      router.push(`/pets/${pet.id}`);
    } else {
      const err = await res.json();
      setError(typeof err.error === "string" ? err.error : "发布失败");
    }
    setLoading(false);
  }

  if (status === "loading") return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;
  if (status === "unauthenticated") { router.push("/login"); return null; }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">📝 发布领养信息</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input name="title" required placeholder="例如：可爱的橘猫找家" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物种 *</label>
            <select name="species" required className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none">
              <option value="DOG">🐕 狗</option>
              <option value="CAT">🐈 猫</option>
              <option value="OTHER">🐾 其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">品种</label>
            <input name="breed" placeholder="例如：金毛、橘猫" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
            <input name="age" placeholder="例如：1岁" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
            <select name="gender" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none">
              <option value="">不限</option>
              <option value="公">公</option>
              <option value="母">母</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体型</label>
            <select name="size" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none">
              <option value="">不限</option>
              <option value="SMALL">小型</option>
              <option value="MEDIUM">中型</option>
              <option value="LARGE">大型</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">毛色</label>
            <input name="color" placeholder="例如：橘色" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">所在地 *</label>
            <input name="location" required placeholder="例如：北京市朝阳区" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">照片URL <span className="text-gray-400 font-normal">(可添加多张)</span></label>
          <div className="flex gap-2">
            <input value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} placeholder="输入图片链接" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhoto(); } }} />
            <button type="button" onClick={addPhoto} className="px-4 py-2.5 bg-gray-100 rounded-lg text-sm hover:bg-gray-200">添加</button>
          </div>
          {photos.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {photos.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`照片 ${i + 1}`} className="w-16 h-16 object-cover rounded-lg border" />
                  <button type="button" onClick={() => setPhotos(photos.filter((_, j) => j !== i))} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">描述 *</label>
          <textarea name="description" required rows={5} placeholder="请详细描述宠物的情况：健康状况、性格特点、领养条件等..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none resize-none" />
          <p className="text-xs text-gray-400 mt-1">至少10个字</p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">📞 联系方式（选填）</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
              <input name="contactName" placeholder="称呼" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">电话</label>
              <input name="contactPhone" placeholder="手机号" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
              <input name="contactWechat" placeholder="微信号" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? "发布中..." : "发布领养信息 🐾"}
        </button>
      </form>
    </div>
  );
}
