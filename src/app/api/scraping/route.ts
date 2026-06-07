import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.scrapeLog.findMany({
      orderBy: { startedAt: "desc" },
      take: 20,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("GET /api/scraping error:", error);
    return NextResponse.json({ error: "获取日志失败" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userRole = (session.user as { role: string }).role;
    if (userRole !== "ADMIN") {
      return NextResponse.json({ error: "无权访问" }, { status: 403 });
    }

    // Create a log entry — actual scraping would be triggered in production
    const log = await prisma.scrapeLog.create({
      data: {
        source: "manual",
        status: "started",
        itemsFound: 0,
        itemsNew: 0,
        startedAt: new Date(),
      },
    });

    // In production, this would spawn a background scraper process
    // For now, we just record the trigger
    await prisma.scrapeLog.update({
      where: { id: log.id },
      data: {
        status: "success",
        itemsFound: 0,
        itemsNew: 0,
        finishedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "爬虫任务已触发", logId: log.id });
  } catch (error) {
    console.error("POST /api/scraping error:", error);
    return NextResponse.json({ error: "触发失败" }, { status: 500 });
  }
}
