export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/shopee/auth";
import { getPrisma } from "@/lib/prisma";

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
    // 1. Exchange the code for the access token
    const tokenData = await getAccessToken(code, shopId);

    if (tokenData.error) {
      console.error("Shopee Auth Error:", tokenData);
      return NextResponse.json(
        { error: tokenData.error, message: tokenData.message },
        { status: 400 }
      );
    }

    const { access_token, refresh_token } = tokenData;

    // 2. Temporarily mock a user for testing purposes until NextAuth is implemented
    // Let's create or find a dummy user to link this account to.
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: "password123" // just a dummy
        }
      });
    }

    // 3. Upsert the Account into the database
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

    // 4. Redirect the user back to the dashboard or success page
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    return NextResponse.redirect(`${protocol}://${host}/?shopee_connected=true`);

  } catch (error) {
    console.error("Error during Shopee API callback processing:", error);
    return NextResponse.json({ error: "Internal Server Error during Token Exchange" }, { status: 500 });
  }
}
