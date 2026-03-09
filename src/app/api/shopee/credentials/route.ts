import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getActiveUser } from "@/lib/user";

export async function POST(request: Request) {
    try {
        const prisma = getPrisma();
        const user = await getActiveUser();

        if (!user) {
            return NextResponse.json({ error: "No user found" }, { status: 404 });
        }

        const { partnerId, partnerKey } = await request.json();

        if (!partnerId || !partnerKey) {
            return NextResponse.json({ error: "Partner ID and Partner Key are required." }, { status: 400 });
        }

        // Update the user's Shopee credentials
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                shopeePartnerId: partnerId.toString(),
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
        const user = await getActiveUser();

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
