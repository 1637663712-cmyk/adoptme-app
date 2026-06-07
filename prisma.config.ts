import "dotenv/config";
import type { PrismaConfig } from "prisma";

export default {
  datasource: {
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
} satisfies PrismaConfig;
