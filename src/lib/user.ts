import { getPrisma } from "./prisma";

export async function getActiveUser() {
    const prisma = getPrisma();

    // Temporariamente, ignoramos a sessão do NextAuth para evitar o erro NO_SECRET na VPS
    // Quando o sistema estiver 100%, voltaremos com o login do Google aqui.

    const userEmail = "admin@example.com";

    // Tentamos achar o usuário Admin padrão
    let user = await prisma.user.findUnique({
        where: { email: userEmail }
    });

    if (!user) {
        // Se não existir, criamos o usuário inicial para a VPS
        console.log("🚀 Criando usuário Admin inicial na VPS...");
        user = await prisma.user.create({
            data: {
                name: "Admin VPS",
                email: userEmail,
                password: "vps-password-protected" // Valor dummy
            }
        });
    }

    return user;
}
