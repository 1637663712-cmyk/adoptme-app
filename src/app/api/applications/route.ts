import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validators";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const applications = await prisma.application.findMany({
      where: { userId },
      include: {
        pet: {
          select: {
            id: true,
            title: true,
            species: true,
            photos: true,
            status: true,
            location: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET /api/applications error:", error);
    return NextResponse.json({ error: "获取申请列表失败" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { message } = parsed.data;
    const petId = body.petId;

    if (!petId) {
      return NextResponse.json({ error: "请指定宠物" }, { status: 400 });
    }

    // Check pet exists
    const pet = await prisma.pet.findUnique({ where: { id: petId } });
    if (!pet) {
      return NextResponse.json({ error: "宠物信息不存在" }, { status: 404 });
    }

    // Check duplicate
    const existing = await prisma.application.findUnique({
      where: { petId_userId: { petId, userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "您已申请过领养该宠物" }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: { message, petId, userId },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("POST /api/applications error:", error);
    return NextResponse.json({ error: "提交申请失败" }, { status: 500 });
  }
}
