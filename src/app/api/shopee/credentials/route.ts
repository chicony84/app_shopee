import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const prisma = getPrisma();
        const { partnerId, partnerKey } = await request.json();

        if (!partnerId || !partnerKey) {
            return NextResponse.json({ error: "Partner ID and Partner Key are required." }, { status: 400 });
        }

        // Mock NextAuth session by finding the first user (for testing)
        // In production, you would use getServerSession(authOptions)
        let user = await prisma.user.findFirst();

        if (!user) {
            user = await prisma.user.create({
                data: {
                    name: "Test User",
                    email: "test@example.com",
                    password: "password123"
                }
            });
        }

        // Update the user's Shopee credentials
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                shopeePartnerId: partnerId,
                shopeePartnerKey: partnerKey,
            },
        });

        return NextResponse.json({ success: true, user: { id: updatedUser.id } });
    } catch (error) {
        console.error("Error saving Shopee credentials:", error);
        return NextResponse.json({ error: "Failed to save credentials." }, { status: 500 });
    }
}

export async function GET() {
    try {
        const prisma = getPrisma();

        // Mock NextAuth session
        const user = await prisma.user.findFirst();

        if (!user) {
            return NextResponse.json({ partnerId: null, hasKey: false });
        }

        return NextResponse.json({
            partnerId: user.shopeePartnerId,
            hasKey: !!user.shopeePartnerKey // don't expose the actual key
        });
    } catch (err) {
        return NextResponse.json({ error: "Failed to fetch credentials." }, { status: 500 });
    }
}
