// Common countries for survey dropdown
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "Australia",
  "Netherlands",
  "Sweden",
  "India",
  "Brazil",
  "Japan",
  "South Korea",
  "Singapore",
  "Israel",
  "Ireland",
  "Switzerland",
  "Spain",
  "Italy",
  "Poland",
  "Portugal",
  "Austria",
  "Belgium",
  "Denmark",
  "Finland",
  "Norway",
  "New Zealand",
  "Mexico",
  "Argentina",
  "Chile",
  "Colombia",
  "South Africa",
  "United Arab Emirates",
  "China",
  "Taiwan",
  "Hong Kong",
  "Indonesia",
  "Malaysia",
  "Philippines",
  "Thailand",
  "Vietnam",
  "Czech Republic",
  "Romania",
  "Ukraine",
  "Russia",
  "Turkey",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Pakistan",
  "Bangladesh",
  "Other",
] as const;

// Get all IANA timezones from browser
export function getTimezones(): string[] {
  try {
    // Modern browsers support this
    return Intl.supportedValuesOf("timeZone");
  } catch {
    // Fallback for older browsers
    return [
      "America/New_York",
      "America/Chicago",
      "America/Denver",
      "America/Los_Angeles",
      "America/Anchorage",
      "America/Phoenix",
      "America/Toronto",
      "America/Vancouver",
      "America/Mexico_City",
      "America/Sao_Paulo",
      "America/Buenos_Aires",
      "Europe/London",
      "Europe/Paris",
      "Europe/Berlin",
      "Europe/Amsterdam",
      "Europe/Stockholm",
      "Europe/Madrid",
      "Europe/Rome",
      "Europe/Warsaw",
      "Europe/Moscow",
      "Asia/Tokyo",
      "Asia/Seoul",
      "Asia/Shanghai",
      "Asia/Hong_Kong",
      "Asia/Singapore",
      "Asia/Mumbai",
      "Asia/Dubai",
      "Asia/Jerusalem",
      "Australia/Sydney",
      "Australia/Melbourne",
      "Pacific/Auckland",
      "UTC",
    ];
  }
}

// Group timezones by region for better UX
export function getGroupedTimezones(): Record<string, string[]> {
  const timezones = getTimezones();
  const grouped: Record<string, string[]> = {};
  
  for (const tz of timezones) {
    const [region] = tz.split("/");
    if (!grouped[region]) {
      grouped[region] = [];
    }
    grouped[region].push(tz);
  }
  
  return grouped;
}

export type Country = (typeof COUNTRIES)[number];
