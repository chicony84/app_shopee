export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/shopee/auth";
import { getPrisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const prisma = getPrisma();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.redirect(new URL("/login?callbackUrl=/dashboard", request.url));
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || !user.shopeePartnerId || !user.shopeePartnerKey) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_credentials", request.url));
    }

    // Use the host from the request to construct the callback URL dynamically
    const host = request.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/api/shopee/callback`;

    const partnerId = parseInt(user.shopeePartnerId, 10);
    const authUrl = generateAuthUrl(callbackUrl, partnerId, user.shopeePartnerKey);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
