export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/shopee/auth";
import { getActiveUser } from "@/lib/user";

export async function GET(request: Request) {
  try {
    const user = await getActiveUser();

    if (!user || !user.shopeePartnerId || !user.shopeePartnerKey) {
      return NextResponse.redirect(new URL("/dashboard?error=missing_credentials", request.url));
    }

    // Use the host from the request to construct the callback URL dynamically
    const host = request.headers.get("host") || "";
    // Se o host contém porta ou é IP, tratamos como http (comum em VPS sem SSL configurado ainda)
    const isIpOrDev = /^[0-9.]+(:[0-9]+)?$/.test(host) || host.includes("localhost");
    const protocol = isIpOrDev ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/api/shopee/callback`;

    const partnerId = parseInt(user.shopeePartnerId, 10);
    const authUrl = generateAuthUrl(callbackUrl, partnerId, user.shopeePartnerKey);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Error generating auth URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}
