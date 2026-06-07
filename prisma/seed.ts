import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const dbUrl = process.env.DATABASE_URL?.replace(/\\/g, "/") || "file:./dev.db";
console.log("Using DB URL:", dbUrl);
const adapter = new PrismaLibSql({ url: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123456",
    12
  );
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@weadopt.com" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@weadopt.com",
      passwordHash: adminPassword,
      name: "管理员",
      role: "ADMIN",
    },
  });
  console.log(`  ✅ Admin: ${admin.email}`);

  // Create demo user
  const userPassword = await bcrypt.hash("user123456", 12);
  const user = await prisma.user.upsert({
    where: { email: "user@weadopt.com" },
    update: {},
    create: {
      email: "user@weadopt.com",
      passwordHash: userPassword,
      name: "爱心用户",
      role: "USER",
    },
  });
  console.log(`  ✅ Demo user: ${user.email}`);

  // Create sample pets
  const samplePets = [
    {
      title: "可爱橘猫求领养",
      species: "CAT",
      breed: "中华田园猫",
      age: "6个月",
      gender: "公",
      size: "SMALL",
      color: "橘色",
      location: "北京市朝阳区",
      description: "小区里救助的小橘猫，已驱虫已疫苗，非常亲人，会用猫砂盆。寻找有爱心的永久家庭，要求封窗、科学喂养。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactWechat: "adopt_cat_bj",
      userId: user.id,
    },
    {
      title: "两岁金毛找新家",
      species: "DOG",
      breed: "金毛寻回犬",
      age: "2岁",
      gender: "母",
      size: "LARGE",
      color: "金色",
      location: "上海市浦东新区",
      description: "因工作变动无法继续饲养，金毛性格温顺亲人，已绝育，身体健康。送所有狗狗用品，寻找有养狗经验的家庭。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactPhone: "13800138000",
      userId: user.id,
    },
    {
      title: "小奶猫一窝免费领养",
      species: "CAT",
      breed: "英短",
      age: "2个月",
      gender: "母",
      size: "SMALL",
      color: "灰白",
      location: "广州市天河区",
      description: "自家猫咪生的一窝小奶猫，共3只，健康活泼，已会吃猫粮会用猫砂，求靠谱家长免费领养。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactWechat: "cat_lover_gz",
      userId: user.id,
    },
    {
      title: "边牧串串免费领养",
      species: "DOG",
      breed: "边境牧羊犬混血",
      age: "1岁",
      gender: "公",
      size: "MEDIUM",
      color: "黑白",
      location: "成都市武侯区",
      description: "流浪救助的边牧串串，非常聪明活泼，已打疫苗，未绝育。希望找到有耐心有爱心的主人，最好有养狗经验。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactPhone: "13912345678",
      userId: user.id,
    },
    {
      title: "纯种泰迪免费送养",
      species: "DOG",
      breed: "泰迪",
      age: "3岁",
      gender: "公",
      size: "SMALL",
      color: "棕色",
      location: "深圳市南山区",
      description: "自家养的泰迪因搬家无法继续养，狗狗非常健康，性格活泼可爱，送所有狗狗用品。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactPhone: "13712345678",
      userId: user.id,
    },
    {
      title: "流浪三花猫找领养",
      species: "CAT",
      breed: "中华田园猫",
      age: "1岁",
      gender: "母",
      size: "SMALL",
      color: "三花",
      location: "杭州市西湖区",
      description: "在小区救助的三花猫，性格温顺黏人，已做驱虫和疫苗。领养要求：封窗、科学喂养、定期回访。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: true,
      contactWechat: "hz_cat_rescue",
      userId: user.id,
    },
    {
      title: "阿拉斯加雪橇犬求领养",
      species: "DOG",
      breed: "阿拉斯加",
      age: "1岁半",
      gender: "公",
      size: "LARGE",
      color: "黑白",
      location: "重庆市渝北区",
      description: "朋友送的阿拉斯加，因工作太忙没时间遛狗，寻找有养大型犬经验、有充足时间陪伴的家庭。已绝育已疫苗。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: false,
      contactPhone: "13612345678",
      userId: user.id,
    },
    {
      title: "小黑猫找温暖的家",
      species: "CAT",
      breed: "中华田园猫",
      age: "4个月",
      gender: "公",
      size: "SMALL",
      color: "黑色",
      location: "武汉市洪山区",
      description: "在学校救助的小黑猫，非常亲人活泼，已经驱虫，会用猫砂，希望找到不离不弃的主人。",
      photos: JSON.stringify([]),
      status: "AVAILABLE",
      source: "USER_POSTED",
      isVerified: false,
      contactWechat: "wuhan_cat",
      userId: user.id,
    },
  ];

  for (const pet of samplePets) {
    const existing = await prisma.pet.findFirst({
      where: { title: pet.title, location: pet.location },
    });
    if (!existing) {
      await prisma.pet.create({ data: pet });
      console.log(`  🐾 Created: ${pet.title}`);
    }
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
