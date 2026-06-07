"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PetData {
  id: string;
  title: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  size: string;
  color: string;
  location: string;
  description: string;
  status: string;
  photos: string;
  contactName: string;
  contactPhone: string;
  contactWechat: string;
  userId: string;
}

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [pet, setPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoInput, setPhotoInput] = useState("");
  const [_id, setId] = useState("");

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      fetch(`/api/pets/${id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) { router.push("/dashboard/listings"); return; }
          setPet(data);
          try { setPhotos(JSON.parse(data.photos || "[]")); } catch { setPhotos([]); }
        });
    });
  }, [params, router]);

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
    const fields = ["title", "species", "breed", "age", "gender", "size", "color", "location", "description", "status", "contactName", "contactPhone", "contactWechat"];
    for (const field of fields) {
      const val = formData.get(field) as string;
      if (val) data[field] = val;
    }

    const res = await fetch(`/api/pets/${_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/listings");
    } else {
      const err = await res.json();
      setError(typeof err.error === "string" ? err.error : "更新失败");
    }
    setLoading(false);
  }

  if (authStatus === "loading" || !pet) return <div className="text-center py-16"><div className="animate-spin text-4xl inline-block">🐾</div></div>;
  if (authStatus === "unauthenticated") { router.push("/login"); return null; }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">✏️ 编辑领养信息</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">标题 *</label>
          <input name="title" required defaultValue={pet.title} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物种 *</label>
            <select name="species" required defaultValue={pet.species} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
              <option value="DOG">🐕 狗</option>
              <option value="CAT">🐈 猫</option>
              <option value="OTHER">🐾 其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">品种</label>
            <input name="breed" defaultValue={pet.breed || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 focus:border-orange-400 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">年龄</label><input name="age" defaultValue={pet.age || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">性别</label><select name="gender" defaultValue={pet.gender || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"><option value="">不限</option><option value="公">公</option><option value="母">母</option></select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">体型</label><select name="size" defaultValue={pet.size || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm"><option value="">不限</option><option value="SMALL">小型</option><option value="MEDIUM">中型</option><option value="LARGE">大型</option></select></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">毛色</label><input name="color" defaultValue={pet.color || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">所在地 *</label><input name="location" required defaultValue={pet.location} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
          <select name="status" defaultValue={pet.status} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm">
            <option value="AVAILABLE">可领养</option>
            <option value="PENDING">领养中</option>
            <option value="ADOPTED">已领养</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">照片URL</label>
          <div className="flex gap-2">
            <input value={photoInput} onChange={(e) => setPhotoInput(e.target.value)} placeholder="输入图片链接" className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhoto(); } }} />
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
          <textarea name="description" required rows={5} defaultValue={pet.description} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none resize-none" />
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-900 mb-3">📞 联系方式</h3>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">联系人</label><input name="contactName" defaultValue={pet.contactName || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">电话</label><input name="contactPhone" defaultValue={pet.contactPhone || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">微信</label><input name="contactWechat" defaultValue={pet.contactWechat || ""} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-300 outline-none" /></div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
          {loading ? "保存中..." : "保存修改 💾"}
        </button>
      </form>
    </div>
  );
}
