import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 🚀 FORÇA O CARREGAMENTO DO .ENV NA VPS
// O Next.js às vezes falha ao carregar em domínios públicos (Easypanel, etc)
try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
        const env = dotenv.parse(fs.readFileSync(envPath));
        for (const key in env) {
            process.env[key] = process.env[key] || env[key];
        }
    }
} catch (e) {
    console.error("Erro ao carregar .env manualmente:", e);
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const url = process.env.DATABASE_URL;

    if (!url) {
        console.error("❌ ERRO CRÍTICO: DATABASE_URL não encontrada no ambiente.");
        throw new Error("DATABASE_URL is missing");
    }

    const pool = new pg.Pool({
        connectionString: url,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    const adapter = new PrismaPg(pool);

    // No Prisma 7, PASSAR O adapter É OBRIGATÓRIO SE VOCÊ QUER USAR DRIVER ADAPTER
    // E passar a datasourceUrl ajuda a evitar o erro de construtor vazio.
    return new PrismaClient({
        adapter,
        // @ts-ignore
        datasourceUrl: url,
        log: ["error"],
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
