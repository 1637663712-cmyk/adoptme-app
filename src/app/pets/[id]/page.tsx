import { prisma } from "@/lib/prisma";
import { parsePhotos, formatDate } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ApplyButton from "./ApplyButton";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const pet = await prisma.pet.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    include: { user: { select: { id: true, name: true, avatar: true } } },
  });

  if (!pet) {
    return (
      <div className="text-center py-32">
        <p className="text-5xl mb-4">😿</p>
        <p className="text-lg text-gray-600">宠物信息不存在或已被删除</p>
        <Link href="/pets" className="text-orange-500 hover:text-orange-600 mt-4 inline-block font-semibold">
          返回列表 →
        </Link>
      </div>
    );
  }

  const photos = parsePhotos(pet.photos);
  const userId = session?.user ? (session.user as { id: string }).id : null;
  const userRole = session?.user ? (session.user as { role: string }).role : null;
  const isOwner = userId === pet.userId;
  const isAdmin = userRole === "ADMIN";

  // Check if already favorited / applied
  const [favorite, application] = userId
    ? await Promise.all([
        prisma.favorite.findUnique({ where: { petId_userId: { petId: id, userId } } }),
        prisma.application.findUnique({ where: { petId_userId: { petId: id, userId } } }),
      ])
    : [null, null];

  // Get similar pets
  const similarPets = await prisma.pet.findMany({
    where: {
      species: pet.species,
      status: "AVAILABLE",
      id: { not: id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-orange-600">首页</Link>
        <span className="mx-2">/</span>
        <Link href="/pets" className="hover:text-orange-600">领养中心</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{pet.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Photos */}
        <div className="lg:col-span-2">
          <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 rounded-xl flex items-center justify-center overflow-hidden mb-4">
            {photos[0] ? (
              <img src={photos[0]} alt={pet.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">{pet.species === "DOG" ? "🐕" : pet.species === "CAT" ? "🐈" : "🐾"}</span>
            )}
          </div>
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {photos.slice(1, 5).map((photo, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={photo} alt={`${pet.title} ${i + 2}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📝 详细信息</h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-xl p-6">
              {pet.description}
            </div>
          </div>
        </div>

        {/* Right - Info Card */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{pet.title}</h1>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${
                  pet.status === "AVAILABLE"
                    ? "bg-green-100 text-green-700"
                    : pet.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {pet.status === "AVAILABLE" ? "可领养" : pet.status === "PENDING" ? "领养中" : "已领养"}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">物种</span>
                <span className="font-medium">{pet.species === "DOG" ? "🐕 狗" : pet.species === "CAT" ? "🐈 猫" : "🐾 其他"}</span>
              </div>
              {pet.breed && (
                <div className="flex justify-between">
                  <span className="text-gray-500">品种</span>
                  <span className="font-medium">{pet.breed}</span>
                </div>
              )}
              {pet.age && (
                <div className="flex justify-between">
                  <span className="text-gray-500">年龄</span>
                  <span className="font-medium">{pet.age}</span>
                </div>
              )}
              {pet.gender && (
                <div className="flex justify-between">
                  <span className="text-gray-500">性别</span>
                  <span className="font-medium">{pet.gender}</span>
                </div>
              )}
              {pet.size && (
                <div className="flex justify-between">
                  <span className="text-gray-500">体型</span>
                  <span className="font-medium">{pet.size === "SMALL" ? "小型" : pet.size === "MEDIUM" ? "中型" : "大型"}</span>
                </div>
              )}
              {pet.color && (
                <div className="flex justify-between">
                  <span className="text-gray-500">毛色</span>
                  <span className="font-medium">{pet.color}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">所在地</span>
                <span className="font-medium">📍 {pet.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">浏览</span>
                <span className="font-medium">{pet.viewCount} 次</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">发布</span>
                <span className="font-medium">{formatDate(pet.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">来源</span>
                <span className="font-medium">{pet.source === "USER_POSTED" ? "用户发布" : "平台抓取"}</span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">📞 联系方式</h3>
              {pet.contactName && <p className="text-sm text-gray-700">联系人: {pet.contactName}</p>}
              {pet.contactPhone && <p className="text-sm text-gray-700">电话: {pet.contactPhone}</p>}
              {pet.contactWechat && <p className="text-sm text-gray-700">微信: {pet.contactWechat}</p>}
              {pet.user && !pet.contactName && (
                <p className="text-sm text-gray-700">发布者: {pet.user.name || "匿名用户"}</p>
              )}
            </div>

            {/* Action Buttons */}
            {pet.status === "AVAILABLE" && !isOwner && userId && (
              <div className="space-y-2 pt-2">
                <ApplyButton petId={id} alreadyApplied={!!application} />
                <FavoriteButton petId={id} isFavorited={!!favorite} />
              </div>
            )}
            {!userId && pet.status === "AVAILABLE" && (
              <Link
                href="/login"
                className="block text-center py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                登录后申请领养
              </Link>
            )}
            {isOwner && (
              <Link
                href={`/dashboard/listings/${id}/edit`}
                className="block text-center py-3 border-2 border-orange-300 text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-colors"
              >
                ✏️ 编辑信息
              </Link>
            )}
          </div>

          {/* Source Link */}
          {pet.sourceUrl && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm">
              <p className="text-blue-700">📎 信息来源于外部平台</p>
              <a
                href={pet.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline mt-1 inline-block"
              >
                查看原始链接 →
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Similar Pets */}
      {similarPets.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🐾 你可能还喜欢</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarPets.map((p) => {
              const pPhotos = parsePhotos(p.photos);
              return (
                <Link
                  key={p.id}
                  href={`/pets/${p.id}`}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                >
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden">
                    {pPhotos[0] ? (
                      <img src={pPhotos[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="text-4xl">{p.species === "DOG" ? "🐕" : p.species === "CAT" ? "🐈" : "🐾"}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{p.title}</h4>
                    <p className="text-xs text-gray-500">📍 {p.location}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
