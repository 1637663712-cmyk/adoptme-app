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

    const userRole = (session.user as { role: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    const pets = await prisma.pet.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pets);
  } catch (error) {
    console.error("GET /api/admin/pets error:", error);
    return NextResponse.json({ error: "获取宠物列表失败" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userRole = (session.user as { role: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    const { id, isVerified } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "请指定宠物ID" }, { status: 400 });
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: { isVerified },
    });

    return NextResponse.json(pet);
  } catch (error) {
    console.error("PUT /api/admin/pets error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
