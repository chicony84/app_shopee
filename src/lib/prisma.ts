import { PrismaClient } from "@prisma/client";

export const getPrisma = (): PrismaClient => {
    if (typeof window === "undefined") {
        if (!globalThis.prismaGlobal) {
            globalThis.prismaGlobal = new PrismaClient();
        }
        return globalThis.prismaGlobal;
    }
    return new PrismaClient();
};

declare const globalThis: {
    prismaGlobal: PrismaClient;
} & typeof global;
