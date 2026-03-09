export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/shopee/auth";
import { getPrisma } from "@/lib/prisma";
import { getActiveUser } from "@/lib/user";

export async function GET(request: Request) {
  const prisma = getPrisma();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const shopIdStr = searchParams.get("shop_id");

  if (!code || !shopIdStr) {
    return NextResponse.json({ error: "Missing code or shop_id payload from Shopee" }, { status: 400 });
  }

  const shopId = parseInt(shopIdStr, 10);

  try {
    const user = await getActiveUser();

    if (!user || !user.shopeePartnerId || !user.shopeePartnerKey) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_credentials", request.url));
    }

    const partnerId = parseInt(user.shopeePartnerId, 10);

    // 1. Exchange the code for the access token
    const tokenData = await getAccessToken(code, shopId, partnerId, user.shopeePartnerKey);

    if (tokenData.error) {
      console.error("Shopee Auth Error:", tokenData);
      return NextResponse.json(
        { error: tokenData.error, message: tokenData.message },
        { status: 400 }
      );
    }

    const { access_token, refresh_token } = tokenData;

    // 2. Upsert the Account into the database
    await prisma.account.upsert({
      where: {
        userId_provider: {
          userId: user.id,
          provider: "shopee"
        }
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        metadata: { shop_id: shopId }
      },
      create: {
        userId: user.id,
        provider: "shopee",
        accessToken: access_token,
        refreshToken: refresh_token,
        metadata: { shop_id: shopId }
      }
    });

    // 3. Redirect the user back to the dashboard
    const host = request.headers.get("host") || "";
    const isIpOrDev = /^[0-9.]+(:[0-9]+)?$/.test(host) || host.includes("localhost");
    const protocol = isIpOrDev ? "http" : "https";
    return NextResponse.redirect(`${protocol}://${host}/dashboard?shopee_connected=true`);

  } catch (error) {
    console.error("Error during Shopee API callback processing:", error);
    return NextResponse.json({ error: "Internal Server Error during Token Exchange" }, { status: 500 });
  }
}
