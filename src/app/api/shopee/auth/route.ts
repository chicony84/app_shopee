export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { generateAuthUrl } from "@/lib/shopee/auth";

export async function GET(request: Request) {
  // Use the host from the request to construct the callback URL dynamically
  const host = request.headers.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const callbackUrl = `${protocol}://${host}/api/shopee/callback`;

  const authUrl = generateAuthUrl(callbackUrl);

  return NextResponse.redirect(authUrl);
}
