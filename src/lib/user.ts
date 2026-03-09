import { getPrisma } from "./prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getActiveUser() {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    let userEmail = session?.user?.email;

    if (!userEmail) {
        // Temporariamente, se não houver sessão, usamos o primeiro usuário ou criamos um Admin
        const firstUser = await prisma.user.findFirst();
        if (firstUser) {
            return firstUser;
        } else {
            return await prisma.user.create({
                data: {
                    name: "Admin",
                    email: "admin@example.com",
                    password: "password123"
                }
            });
        }
    }

    return await prisma.user.findUnique({
        where: { email: userEmail }
    });
}
