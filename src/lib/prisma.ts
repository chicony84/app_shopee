import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const DATABASE_URL = process.env.DATABASE_URL;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        datasourceUrl: DATABASE_URL,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const getPrisma = () => prisma;
