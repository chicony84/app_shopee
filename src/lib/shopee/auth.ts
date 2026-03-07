import crypto from "crypto";
import axios from "axios";

// Environment variable fallback if not provided per-user
const APP_ENV = process.env.SHOPEE_ENV || "test"; // 'test' or 'live'

const getBaseUrl = () => {
  return APP_ENV === "live"
    ? "https://partner.shopeemobile.com"
    : "https://partner.test-stable.shopeemobile.com";
};

/**
 * Generate Authorization URL for Shop/Seller accounts
 */
export const generateAuthUrl = (redirectUrl: string, partnerId: number, partnerKey: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const path = "/api/v2/shop/auth_partner";
  const baseString = `${partnerId}${path}${timestamp}`;
  const sign = crypto.createHmac("sha256", partnerKey).update(baseString).digest("hex");
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}&redirect=${encodeURIComponent(redirectUrl)}`;
};

/**
 * Generate Signature for Shopee API V2 calls
 */
export const generateApiSignature = (path: string, partnerId: number, partnerKey: string, accessToken?: string, shopId?: number) => {
  const timestamp = Math.floor(Date.now() / 1000);
  let baseString = `${partnerId}${path}${timestamp}`;
  if (accessToken) baseString += accessToken;
  if (shopId) baseString += shopId;

  const sign = crypto.createHmac("sha256", partnerKey).update(baseString).digest("hex");
  return { timestamp, sign, partner_id: partnerId };
};

/**
 * Exchange Authorization Code for Access Token
 */
export const getAccessToken = async (code: string, shopId: number, partnerId: number, partnerKey: string) => {
  const path = "/api/v2/auth/token/get";
  const { timestamp, sign } = generateApiSignature(path, partnerId, partnerKey);
  const baseUrl = getBaseUrl();
  const response = await axios.post(`${baseUrl}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`, {
    code,
    shop_id: shopId,
    partner_id: partnerId,
  });
  return response.data;
};

/**
 * Refresh Access Token
 */
export const refreshAccessToken = async (refreshToken: string, shopId: number, partnerId: number, partnerKey: string) => {
  const path = "/api/v2/auth/access_token/get";
  const { timestamp, sign } = generateApiSignature(path, partnerId, partnerKey);
  const baseUrl = getBaseUrl();
  const response = await axios.post(`${baseUrl}${path}?partner_id=${partnerId}&timestamp=${timestamp}&sign=${sign}`, {
    refresh_token: refreshToken,
    shop_id: shopId,
    partner_id: partnerId,
  });
  return response.data;
};

/**
 * Get Open Campaign Added Products (AMS - Affiliate Marketing Solution)
 * Documentation: https://open.shopee.com/documents/v2/v2.ams.get_open_campaign_added_product
 */
export const getAmsCampaignProducts = async (
  accessToken: string,
  shopId: number,
  partnerId: number,
  partnerKey: string,
  params: {
    page_size: number;
    page_no: number;
    search_keyword?: string;
  }
) => {
  const path = "/api/v2/ams/get_open_campaign_added_product";
  const { timestamp, sign } = generateApiSignature(path, partnerId, partnerKey, accessToken, shopId);
  const baseUrl = getBaseUrl();

  // Create URL with common parameters
  const url = new URL(`${baseUrl}${path}`);
  url.searchParams.append("partner_id", partnerId.toString());
  url.searchParams.append("timestamp", timestamp.toString());
  url.searchParams.append("sign", sign);
  url.searchParams.append("access_token", accessToken);
  url.searchParams.append("shop_id", shopId.toString());

  // Add specific AMS parameters
  url.searchParams.append("page_size", params.page_size.toString());
  url.searchParams.append("page_no", params.page_no.toString());
  if (params.search_keyword) {
    url.searchParams.append("search_keyword", params.search_keyword);
  }

  const response = await axios.get(url.toString());
  return response.data;
};
