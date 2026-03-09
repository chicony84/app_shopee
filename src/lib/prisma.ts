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

    // Log de diagnóstico (Aparece no console da Easypanel)
    console.log("🛠️ Prisma Init Diagnostic:", {
        hasUrl: !!url,
        urlPrefix: url ? url.substring(0, 10) + "..." : "NONE",
        nodeEnv: process.env.NODE_ENV
    });

    if (!url) {
        // Se a URL sumir, o Prisma falha. Vamos avisar mas não deixar o construtor vazio.
        console.error("❌ DATABASE_URL FALTANDO NO AMBIENTE!");
        return new PrismaClient({
            datasourceUrl: "postgresql://missing_url_error@localhost:5432/error",
        });
    }

    try {
        const pool = new pg.Pool({ connectionString: url });
        const adapter = new PrismaPg(pool);

        return new PrismaClient({
            adapter,
            // @ts-ignore
            datasourceUrl: url, // Garante que as opções NÃO sejam vazias
            log: ["error", "warn"],
        });
    } catch (err) {
        console.error("❌ Erro ao criar o Pool de conexão ou Adapter:", err);
        // Fallback para evitar erro de inicialização vazia
        return new PrismaClient({ datasourceUrl: url });
    }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
