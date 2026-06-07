import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createAdapter() {
  const url = process.env.DATABASE_URL || "file:./dev.db";

  // PostgreSQL production adapter
  if (url.startsWith("postgresql://") || url.startsWith("postgres://")) {
    return new PrismaPg({ connectionString: url });
  }

  // SQLite local development adapter
  return new PrismaLibSql({ url: url.replace(/\\/g, "/") });
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createAdapter() });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
