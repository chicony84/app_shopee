import "server-only";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        console.error("DATABASE_URL is missing!");
        throw new Error("Missing DATABASE_URL");
    }

    const pool = new pg.Pool({
        connectionString: databaseUrl,
        max: 20
    });

    const adapter = new PrismaPg(pool);

    // Provide both adapter and datasourceUrl (even if ignored) 
    // to satisfy internal Prisma 7 validation checks if any.
    return new PrismaClient({
        adapter,
        // @ts-ignore - Some versions might complain about both, but let's try to satisfy the "non-empty" check 
        // if for some reason the adapter property is not enough.
        datasourceUrl: databaseUrl,
        log: ["error", "warn"]
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
