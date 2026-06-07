import Link from "next/link";
import type { Pet } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parsePhotos } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getFeaturedPets(): Promise<Pet[]> {
  const pets = await prisma.pet.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
  return pets;
}

async function getStats() {
  const [totalPets, adoptedPets, userCount] = await Promise.all([
    prisma.pet.count({ where: { status: "AVAILABLE" } }),
    prisma.pet.count({ where: { status: "ADOPTED" } }),
    prisma.user.count(),
  ]);
  return { totalPets, adoptedPets, userCount };
}

export default async function HomePage() {
  const [pets, stats] = await Promise.all([getFeaturedPets(), getStats()]);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-orange-50 via-orange-100 to-amber-50 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            领养代替购买
            <span className="block text-orange-500 mt-2">给流浪动物一个家 🏠</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            我们聚合全网宠物领养信息，帮助你找到心仪的毛孩子。
            每一只被领养的动物，都是一次生命的拯救。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pets"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-200"
            >
              🐾 浏览待领养宠物
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-orange-600 bg-white border-2 border-orange-300 rounded-xl hover:bg-orange-50 transition-colors"
            >
              发布领养信息
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-500">{stats.totalPets}</div>
              <div className="text-gray-600 mt-1">只待领养宠物</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-500">{stats.adoptedPets}</div>
              <div className="text-gray-600 mt-1">已成功领养</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-500">{stats.userCount}</div>
              <div className="text-gray-600 mt-1">位爱心用户</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">🐶 最新待领养宠物 🐱</h2>
            <p className="text-gray-600">看看最近有哪些毛孩子在等待新家</p>
          </div>

          {pets.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-5xl mb-4">🐾</p>
              <p className="text-lg">暂无待领养宠物，快去发布第一条信息吧！</p>
              <Link href="/register" className="text-orange-500 hover:text-orange-600 mt-4 inline-block font-semibold">
                立即注册 →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pets.map((pet: Pet) => {
                const photos = parsePhotos(pet.photos);
                return (
                  <Link
                    key={pet.id}
                    href={`/pets/${pet.id}`}
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100"
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center overflow-hidden">
                      {photos[0] ? (
                        <img
                          src={photos[0]}
                          alt={pet.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <span className="text-5xl">
                          {pet.species === "DOG" ? "🐕" : pet.species === "CAT" ? "🐈" : "🐾"}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
                          {pet.species === "DOG" ? "狗狗" : pet.species === "CAT" ? "猫咪" : "其他"}
                        </span>
                        {pet.breed && (
                          <span className="text-xs text-gray-500">{pet.breed}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                        {pet.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">📍 {pet.location}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {pets.length > 0 && (
            <div className="text-center mt-10">
              <Link
                href="/pets"
                className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold"
              >
                查看全部 →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">📋 领养流程</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. 浏览搜索</h3>
              <p className="text-gray-600 text-sm">按品种、地点、年龄筛选，找到最合适的宠物</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                📝
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. 提交申请</h3>
              <p className="text-gray-600 text-sm">填写领养申请，介绍你的情况和领养意愿</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                🏡
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. 带它回家</h3>
              <p className="text-gray-600 text-sm">通过审核后，联系送养人，迎接新成员回家</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
