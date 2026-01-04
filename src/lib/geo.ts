export interface GeoData {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  timezone: string;
}

/**
 * Get geo data from request headers (Vercel provides these automatically)
 */
export function getGeoFromHeaders(headers: Headers): GeoData {
  return {
    country: headers.get("x-vercel-ip-country") || "Unknown",
    countryCode: headers.get("x-vercel-ip-country") || "XX",
    region: headers.get("x-vercel-ip-country-region") || "Unknown",
    city: headers.get("x-vercel-ip-city") || "Unknown",
    timezone: headers.get("x-vercel-ip-timezone") || "UTC",
  };
}

/**
 * Detect location from IP using ip-api.com (fallback for non-Vercel environments)
 * Free tier: 45 req/min
 */
export async function detectLocationFromIP(ip: string): Promise<GeoData | null> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();

    if (data.status === "success") {
      return {
        country: data.country,
        countryCode: data.countryCode,
        region: data.regionName,
        city: data.city,
        timezone: data.timezone,
      };
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
