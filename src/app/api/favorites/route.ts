import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        pet: {
          select: {
            id: true,
            title: true,
            species: true,
            breed: true,
            photos: true,
            status: true,
            location: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ error: "获取收藏列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { petId } = await req.json();

    if (!petId) {
      return NextResponse.json({ error: "请指定宠物" }, { status: 400 });
    }

    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      return NextResponse.json({ error: "宠物信息不存在" }, { status: 404 });
    }

    const existing = await prisma.favorite.findUnique({
      where: { petId_userId: { petId, userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "已经收藏过了" }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: { petId, userId },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json({ error: "收藏失败" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { petId } = await req.json();

    if (!petId) {
      return NextResponse.json({ error: "请指定宠物" }, { status: 400 });
    }

    await prisma.favorite.deleteMany({
      where: { petId, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/favorites error:", error);
    return NextResponse.json({ error: "取消收藏失败" }, { status: 500 });
  }
}
