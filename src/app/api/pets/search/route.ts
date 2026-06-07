import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const species = searchParams.get("species");
    const size = searchParams.get("size");
    const location = searchParams.get("location");
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = {
      status: "AVAILABLE",
    };

    if (query) {
      where.OR = [
        { title: { contains: query } },
        { description: { contains: query } },
        { breed: { contains: query } },
      ];
    }
    if (species) where.species = species;
    if (size) where.size = size;
    if (location) where.location = { contains: location };
    if (source) where.source = source;

    const orderBy: Record<string, string> =
      sort === "oldest" ? { createdAt: "asc" } : sort === "views" ? { viewCount: "desc" } : { createdAt: "desc" };

    const [pets, total] = await Promise.all([
      prisma.pet.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { user: { select: { id: true, name: true, avatar: true } } },
      }),
      prisma.pet.count({ where }),
    ]);

    return NextResponse.json({
      pets,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("GET /api/pets/search error:", error);
    return NextResponse.json({ error: "搜索失败" }, { status: 500 });
  }
}
