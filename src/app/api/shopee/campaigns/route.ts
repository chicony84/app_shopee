export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getAmsCampaignProducts } from "@/lib/shopee/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const pageSize = parseInt(searchParams.get("page_size") || "20");
        const pageNo = parseInt(searchParams.get("page_no") || "1");
        const keyword = searchParams.get("keyword") || "";

        // 1. Get current user & Shopee account
        const user = await prisma.user.findFirst();
        if (!user || !user.shopeePartnerId || !user.shopeePartnerKey) {
            return NextResponse.json({ error: "Missing partner credentials" }, { status: 400 });
        }

        const account = await prisma.account.findFirst({
            where: { userId: user.id, provider: "shopee" }
        });

        if (!account || !account.accessToken) {
            return NextResponse.json({ error: "No connected Shopee account" }, { status: 401 });
        }

        const shopId = (account.metadata as any)?.shop_id;
        if (!shopId) {
            return NextResponse.json({ error: "Missing shop_id in metadata" }, { status: 400 });
        }

        // 2. Call Shopee AMS API
        const data = await getAmsCampaignProducts(
            account.accessToken,
            shopId,
            parseInt(user.shopeePartnerId),
            user.shopeePartnerKey,
            {
                page_size: pageSize,
                page_no: pageNo,
                search_keyword: keyword
            }
        );

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("AMS API Error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
    }
}
