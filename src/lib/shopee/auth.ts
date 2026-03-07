import crypto from "crypto";
import axios from "axios";

export const PARTNER_ID = parseInt(process.env.SHOPEE_PARTNER_ID || "0", 10);
export const PARTNER_KEY = process.env.SHOPEE_PARTNER_KEY || "";
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
export const generateApiSignature = (path: string, accessToken?: string, shopId?: number) => {
    const timestamp = Math.floor(Date.now() / 1000);
    // Base string pattern for Shop API: partner_id + api path + timestamp + access_token + shop_id
    let baseString = `${PARTNER_ID}${path}${timestamp}`;
    if (accessToken && shopId) {
      baseString += `${accessToken}${shopId}`;
    }
    
    const sign = crypto
      .createHmac("sha256", PARTNER_KEY)
      .update(baseString)
      .digest("hex");
      
    return { timestamp, sign, partner_id: PARTNER_ID };
}

export const getAccessToken = async (code: string, shopId: number) => {
  const path = "/api/v2/auth/token/get";
  const { timestamp, sign, partner_id } = generateApiSignature(path);

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;

  const response = await axios.post(url, {
    code,
    shop_id: shopId,
    partner_id,
  }, {
    headers: { "Content-Type": "application/json" }
  });

  return response.data; // { access_token, refresh_token, expire_in, error, message }
};

export const refreshAccessToken = async (refreshToken: string, shopId: number) => {
  const path = "/api/v2/auth/access_token/get";
  const { timestamp, sign, partner_id } = generateApiSignature(path);

  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}?partner_id=${partner_id}&timestamp=${timestamp}&sign=${sign}`;

  const response = await axios.post(url, {
    refresh_token: refreshToken,
    shop_id: shopId,
    partner_id,
  }, {
    headers: { "Content-Type": "application/json" }
  });

  return response.data;
};
