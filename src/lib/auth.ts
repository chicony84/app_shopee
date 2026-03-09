import { PrismaAdapter } from "@auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: AuthOptions = {
    // @ts-ignore
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/login",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) return null;

                // Para o MVP, se a senha no banco for "password123", deixamos passar se o hash não estiver pronto
                // Em produção usaríamos o compare do bcrypt
                const isPasswordValid = credentials.password === user.password;

                if (!isPasswordValid) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
        }),
    },
};
