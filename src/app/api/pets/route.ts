import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { petSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const species = searchParams.get("species");
    const status = searchParams.get("status") || "AVAILABLE";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);
    const sort = searchParams.get("sort") || "newest";

    const where: Record<string, unknown> = {};
    if (species) where.species = species;
    if (status) where.status = status;

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
    console.error("GET /api/pets error:", error);
    return NextResponse.json({ error: "获取列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = petSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const pet = await prisma.pet.create({
      data: {
        ...parsed.data,
        photos: JSON.stringify(parsed.data.photos),
        userId: (session.user as { id: string }).id,
        source: "USER_POSTED",
      },
    });

    return NextResponse.json(pet, { status: 201 });
  } catch (error) {
    console.error("POST /api/pets error:", error);
    return NextResponse.json({ error: "发布失败" }, { status: 500 });
  }
}
