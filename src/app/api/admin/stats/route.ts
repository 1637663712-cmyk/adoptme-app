import { NextResponse } from "next/server";
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

    const [totalUsers, totalPets, availablePets, adoptedPets, totalApplications, totalScrapeLogs] =
      await Promise.all([
        prisma.user.count(),
        prisma.pet.count(),
        prisma.pet.count({ where: { status: "AVAILABLE" } }),
        prisma.pet.count({ where: { status: "ADOPTED" } }),
        prisma.application.count(),
        prisma.scrapeLog.count(),
      ]);

    return NextResponse.json({
      totalUsers,
      totalPets,
      availablePets,
      adoptedPets,
      totalApplications,
      totalScrapeLogs,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "获取统计失败" }, { status: 500 });
  }
}
