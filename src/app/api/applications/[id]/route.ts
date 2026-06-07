import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/applications/[id]">
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const { id } = await ctx.params;
    const userId = (session.user as { id: string; role: string }).id;
    const userRole = (session.user as { role: string }).role;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { pet: { select: { userId: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: "申请不存在" }, { status: 404 });
    }

    // Only pet owner or admin can update status
    if (application.pet.userId !== userId && userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权操作" }, { status: 403 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "无效的状态" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status },
    });

    // If approved, update pet status
    if (status === "APPROVED") {
      await prisma.pet.update({
        where: { id: application.petId },
        data: { status: "ADOPTED" },
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/applications/[id] error:", error);
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}
