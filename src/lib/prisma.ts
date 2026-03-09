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
    // Na VPS/Easypanel, DATABASE_URL pode não estar disponível no BUILD, apenas no RUNTIME.
    const url = process.env.DATABASE_URL || "postgresql://build_time_placeholder:5432/db";

    console.log("🛠️ Prisma Init Diagnostic:", {
        hasRealUrl: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
    });

    try {
        const pool = new pg.Pool({ connectionString: url });
        const adapter = new PrismaPg(pool);

        return new PrismaClient({
            adapter,
            // @ts-ignore - Ajudando o compilador a entender que passamos opções válidas
            datasourceUrl: url,
            log: ["error", "warn"],
        });
    } catch (err) {
        console.error("❌ Erro ao inicializar PrismaClient:", err);
        // Fallback básico para não travar o compilador
        return new PrismaClient({
            // @ts-ignore
            datasourceUrl: url
        });
    }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
