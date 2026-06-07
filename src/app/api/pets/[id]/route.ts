import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/pets/[id]">
) {
  try {
    const { id } = await ctx.params;

    const pet = await prisma.pet.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: { user: { select: { id: true, name: true, avatar: true, phone: true } } },
    });

    if (!pet) {
      return NextResponse.json({ error: "宠物信息不存在" }, { status: 404 });
    }

    return NextResponse.json(pet);
  } catch (error) {
    console.error("GET /api/pets/[id] error:", error);
    return NextResponse.json({ error: "获取详情失败" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/pets/[id]">
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const userId = (session.user as { id: string; role: string }).id;
    const userRole = (session.user as { role: string }).role;

    const existing = await prisma.pet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "宠物信息不存在" }, { status: 404 });
    }

    if (existing.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const body = await req.json();
    const updateData: Record<string, unknown> = {};
    const fields = [
      "title", "species", "breed", "age", "gender", "size", "color",
      "location", "description", "status", "contactName", "contactPhone", "contactWechat",
    ];
    for (const field of fields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    if (body.photos) {
      updateData.photos = JSON.stringify(body.photos);
    }

    const pet = await prisma.pet.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(pet);
  } catch (error) {
    console.error("PUT /api/pets/[id] error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/pets/[id]">
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const userId = (session.user as { id: string; role: string }).id;
    const userRole = (session.user as { role: string }).role;

    const existing = await prisma.pet.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "宠物信息不存在" }, { status: 404 });
    }

    if (existing.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    await prisma.pet.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/pets/[id] error:", error);
    return NextResponse.json({ error: "删除失败" }, { status: 500 });
  }
}
