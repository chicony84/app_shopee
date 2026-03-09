import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// 🚀 CARREGAMENTO FORÇADO DO .ENV PARA AMBIENTES VPS
try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) {
            process.env[k] = process.env[k] || envConfig[k];
        }
    }
} catch (e) {
    // Silencioso no build
}

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const url = process.env.DATABASE_URL;

    console.log("🛠️ [Prisma Logger]:", {
        hasUrl: !!url,
        env: process.env.NODE_ENV
    });

    // Se não houver URL, retornamos um cliente com log ativado para satisfazer o "non-empty"
    // mas sem tentar conectar ao banco (evita erro durante o build estático).
    if (!url) {
        return new PrismaClient({
            log: ["error"]
        });
    }

    try {
        const pool = new pg.Pool({
            connectionString: url,
            max: 10
        });
        const adapter = new PrismaPg(pool);

        // No Prisma 7, passar o 'adapter' já o torna "non-empty".
        // Não passamos 'datasources' ou 'datasourceUrl' para evitar erros de validação
        // já que o adapter assume o controle da conexão.
        return new PrismaClient({
            adapter,
            log: ["error", "warn"]
        });
    } catch (err) {
        console.error("❌ Falha ao criar PrismaClient com Adapter:", err);
        return new PrismaClient({ log: ["error"] });
    }
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const getPrisma = () => prisma;
