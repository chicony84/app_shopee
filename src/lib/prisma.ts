import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 🚀 CARREGAMENTO FORÇADO DO .ENV
try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = process.env[k] || envConfig[k];
        }
    }
} catch (e) {
    console.error("Erro no carregamento manual do .env:", e);
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const url = process.env.DATABASE_URL;

    console.log("🛠️ Prisma Init Diagnostic:", {
        hasUrl: !!url,
        nodeEnv: process.env.NODE_ENV
    });

    if (!url) {
        console.error("❌ DATABASE_URL FALTANDO NO AMBIENTE!");
        // Usamos a configuração padrão que buscará do env no runtime ou falhará graciosamente
        return new PrismaClient();
    }

    try {
        const pool = new pg.Pool({ connectionString: url });
        const adapter = new PrismaPg(pool);

        return new PrismaClient({
            adapter,
            log: ["error", "warn"],
        });
    } catch (err) {
        console.error("❌ Erro ao criar o Pool de conexão ou Adapter:", err);
        return new PrismaClient();
    }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
