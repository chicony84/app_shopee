import crypto from "crypto";

const PARTNER_ID = process.env.SHOPEE_PARTNER_ID!;
const PARTNER_KEY = process.env.SHOPEE_PARTNER_KEY!;
const APP_ENV = process.env.SHOPEE_ENV || "test"; // 'test' or 'live'

const getBaseUrl = () => {
  return APP_ENV === "live"
    ? "https://partner.shopeemobile.com"
    : "https://partner.test-stable.shopeemobile.com";
};

export const generateAuthUrl = (redirectUrl: string) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const path = "/api/v2/shop/auth_partner";
  
  // Base string: partner_id + api path + timestamp
  const baseString = `${PARTNER_ID}${path}${timestamp}`;
  
  // Sign using HMAC-SHA256
  const sign = crypto
    .createHmac("sha256", PARTNER_KEY)
    .update(baseString)
    .digest("hex");

  const baseUrl = getBaseUrl();
  const authUrl = `${baseUrl}${path}?partner_id=${PARTNER_ID}&timestamp=${timestamp}&sign=${sign}&redirect=${encodeURIComponent(redirectUrl)}`;
  
  return authUrl;
};

// Function used to generate signature for subsequent API calls
export const generateApiSignature = (path: string, accessToken: string, shopId: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    // Base string pattern for Shop API: partner_id + api path + timestamp + access_token + shop_id
    const baseString = `${PARTNER_ID}${path}${timestamp}${accessToken}${shopId}`;
    
    const sign = crypto
      .createHmac("sha256", PARTNER_KEY)
      .update(baseString)
      .digest("hex");
      
    return { timestamp, sign };
}
