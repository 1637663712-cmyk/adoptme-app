import { prisma } from "@/lib/prisma";
import { parsePhotos } from "@/lib/utils";
import Link from "next/link";
import PetFilters from "@/components/pets/PetFilters";
import SortSelect from "@/components/pets/SortSelect";

export const dynamic = "force-dynamic";

export default async function PetsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const species = params.species;
  const size = params.size;
  const location = params.location;
  const source = params.source;
  const query = params.query;
  const page = parseInt(params.page || "1");
  const limit = 12;
  const sort = params.sort || "newest";

  const where: Record<string, unknown> = { status: "AVAILABLE" };
  if (species) where.species = species;
  if (size) where.size = size;
  if (location) where.location = { contains: location };
  if (source) where.source = source;
  if (query) {
    where.OR = [
      { title: { contains: query } },
      { description: { contains: query } },
      { breed: { contains: query } },
    ];
  }

  const orderBy: Record<string, string> =
    sort === "oldest" ? { createdAt: "asc" } : sort === "views" ? { viewCount: "desc" } : { createdAt: "desc" };

  const [pets, total] = await Promise.all([
    prisma.pet.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.pet.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <PetFilters currentParams={params} />
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🐾 领养中心</h1>
              <p className="text-gray-500 text-sm mt-1">
                {query ? `搜索"${query}"的结果: ` : ""}共 {total} 只待领养宠物
              </p>
            </div>
            <SortSelect currentSort={sort} />
          </div>

          {/* Pet Grid */}
          {pets.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">没有找到匹配的宠物</p>
              <Link href="/pets" className="text-orange-500 hover:text-orange-600 mt-2 inline-block">
                清除筛选条件
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {pets.map((pet) => {
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
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-medium">
                          {pet.species === "DOG" ? "狗狗" : pet.species === "CAT" ? "猫咪" : "其他"}
                        </span>
                        {pet.gender && <span className="text-xs text-gray-500">{pet.gender}</span>}
                        {pet.age && <span className="text-xs text-gray-500">{pet.age}</span>}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/pets?${new URLSearchParams({ ...params, page: String(page - 1) }).toString()}`}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  上一页
                </Link>
              )}
              <span className="px-4 py-2 text-sm text-gray-600">
                第 {page} / {totalPages} 页
              </span>
              {page < totalPages && (
                <Link
                  href={`/pets?${new URLSearchParams({ ...params, page: String(page + 1) }).toString()}`}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                >
                  下一页
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
