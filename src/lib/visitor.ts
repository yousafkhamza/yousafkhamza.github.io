/**
 * Where the visitor is, from their browser's time zone only (no IP lookup, no
 * permission prompt). Used to show "your time" next to Dubai time and to add
 * the visitor's own currency next to USD and AED.
 */
export const HOME_TZ = "Asia/Dubai";

export const visitorTz = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || HOME_TZ;
  } catch {
    return HOME_TZ;
  }
};

/** minutes east of UTC for a time zone at a given moment, e.g. Asia/Kolkata → 330 */
export const offsetMinutes = (tz: string, at = new Date()): number => {
  try {
    const name =
      new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "longOffset" })
        .formatToParts(at)
        .find((p) => p.type === "timeZoneName")?.value ?? "GMT";
    const m = name.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!m) return 0;
    const mins = Number(m[2]) * 60 + Number(m[3] ?? 0);
    return m[1] === "-" ? -mins : mins;
  } catch {
    return 0;
  }
};

/** true when the visitor's clock reads the same as Dubai's right now */
export const sameClockAsHome = (tz = visitorTz()) => offsetMinutes(tz) === offsetMinutes(HOME_TZ);

const RENAMED: Record<string, string> = { Calcutta: "Kolkata", Saigon: "Ho Chi Minh", Kiev: "Kyiv", Rangoon: "Yangon" };
/** a readable place for a time zone: Asia/Kolkata → Kolkata, America/New_York → New York */
export const placeName = (tz = visitorTz()) => {
  const last = tz.split("/").pop() ?? tz;
  return RENAMED[last] ?? last.replace(/_/g, " ");
};

/** "+1:30" style difference from Dubai, or "" when the same */
export const diffFromHome = (tz = visitorTz()) => {
  const d = offsetMinutes(tz) - offsetMinutes(HOME_TZ);
  if (!d) return "";
  const sign = d > 0 ? "+" : "−";
  const a = Math.abs(d);
  return `${sign}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, "0")}` : "h"}`;
};

/* ---- currency by time zone. Anywhere not listed sees plain US dollars. ---- */

/** every time zone in a country that uses the euro (EU members incl. Bulgaria from 2026, plus Monaco, San Marino, Vatican, Andorra, Montenegro and the French and Portuguese/Spanish territories) */
const EUR_ZONES = new Set([
  "Europe/Vienna", // Austria
  "Europe/Brussels", // Belgium
  "Europe/Sofia", // Bulgaria (euro since 1 Jan 2026)
  "Europe/Zagreb", // Croatia
  "Asia/Nicosia", "Europe/Nicosia", "Asia/Famagusta", // Cyprus
  "Europe/Tallinn", // Estonia
  "Europe/Helsinki", "Europe/Mariehamn", // Finland, Åland
  "Europe/Paris", // France
  "Europe/Berlin", "Europe/Busingen", // Germany
  "Europe/Athens", // Greece
  "Europe/Dublin", // Ireland
  "Europe/Rome", // Italy
  "Europe/Riga", // Latvia
  "Europe/Vilnius", // Lithuania
  "Europe/Luxembourg", // Luxembourg
  "Europe/Malta", // Malta
  "Europe/Amsterdam", // Netherlands
  "Europe/Lisbon", "Atlantic/Azores", "Atlantic/Madeira", // Portugal
  "Europe/Bratislava", // Slovakia
  "Europe/Ljubljana", // Slovenia
  "Europe/Madrid", "Atlantic/Canary", "Africa/Ceuta", // Spain
  "Europe/Monaco", "Europe/San_Marino", "Europe/Vatican", "Europe/Andorra", "Europe/Podgorica", // euro outside the EU
  "Indian/Reunion", "Indian/Mayotte", "America/Martinique", "America/Guadeloupe", "America/Cayenne",
  "America/St_Barthelemy", "America/Marigot", "America/Miquelon", // French overseas
]);

const BY_ZONE: Record<string, string> = {
  // UAE and the Gulf
  "Asia/Dubai": "AED", "Asia/Riyadh": "SAR", "Asia/Qatar": "QAR", "Asia/Kuwait": "KWD", "Asia/Bahrain": "BHD", "Asia/Muscat": "OMR",
  "Asia/Amman": "JOD", "Asia/Jerusalem": "ILS", "Asia/Tbilisi": "GEL",
  // South Asia
  "Asia/Kolkata": "INR", "Asia/Calcutta": "INR", "Asia/Karachi": "PKR", "Asia/Dhaka": "BDT", "Asia/Colombo": "LKR", "Asia/Kathmandu": "NPR",
  // East and South-East Asia
  "Asia/Singapore": "SGD", "Asia/Kuala_Lumpur": "MYR", "Asia/Manila": "PHP", "Asia/Jakarta": "IDR", "Asia/Bangkok": "THB",
  "Asia/Ho_Chi_Minh": "VND", "Asia/Saigon": "VND", "Asia/Tokyo": "JPY", "Asia/Shanghai": "CNY", "Asia/Hong_Kong": "HKD",
  "Asia/Taipei": "TWD", "Asia/Seoul": "KRW",
  // UK and crown dependencies: pound
  "Europe/London": "GBP", "Europe/Belfast": "GBP", "Europe/Jersey": "GBP", "Europe/Guernsey": "GBP", "Europe/Isle_of_Man": "GBP", "Europe/Gibraltar": "GBP",
  // the rest of Europe outside the euro
  "Europe/Zurich": "CHF", "Europe/Vaduz": "CHF", "Europe/Stockholm": "SEK", "Europe/Oslo": "NOK", "Arctic/Longyearbyen": "NOK",
  "Europe/Copenhagen": "DKK", "Atlantic/Faroe": "DKK", "Atlantic/Reykjavik": "ISK", "Europe/Warsaw": "PLN", "Europe/Prague": "CZK",
  "Europe/Budapest": "HUF", "Europe/Bucharest": "RON", "Europe/Belgrade": "RSD", "Europe/Sarajevo": "BAM", "Europe/Skopje": "MKD",
  "Europe/Tirane": "ALL", "Europe/Chisinau": "MDL", "Europe/Kyiv": "UAH", "Europe/Kiev": "UAH", "Europe/Istanbul": "TRY",
  // Africa
  "Africa/Cairo": "EGP", "Africa/Casablanca": "MAD", "Africa/Lagos": "NGN", "Africa/Accra": "GHS", "Africa/Nairobi": "KES", "Africa/Johannesburg": "ZAR",
  // the Americas outside the US
  "America/Toronto": "CAD", "America/Vancouver": "CAD", "America/Edmonton": "CAD", "America/Winnipeg": "CAD", "America/Halifax": "CAD",
  "America/St_Johns": "CAD", "America/Regina": "CAD", "America/Sao_Paulo": "BRL", "America/Mexico_City": "MXN",
  "America/Bogota": "COP", "America/Santiago": "CLP", "America/Lima": "PEN",
  // Oceania
  "Pacific/Auckland": "NZD",
};

/** US time zones: prices stay in plain dollars there */
const isUsZone = (tz: string) =>
  /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana|Kentucky|North_Dakota|Juneau|Sitka|Nome|Adak|Menominee)/.test(tz) ||
  tz === "Pacific/Honolulu";

/**
 * The one currency a visitor sees prices in: AED in the UAE, INR in India, PKR in
 * Pakistan, EUR in every euro country, GBP in the UK, USD in the US, and USD
 * anywhere we do not map.
 */
export const displayCurrency = (tz = visitorTz()): string => {
  if (tz === HOME_TZ) return "AED";
  if (isUsZone(tz)) return "USD";
  if (BY_ZONE[tz]) return BY_ZONE[tz];
  if (EUR_ZONES.has(tz)) return "EUR";
  if (tz.startsWith("Australia/")) return "AUD";
  return "USD";
};

/** kept for older callers: the visitor's currency when it is not USD */
export const visitorCurrency = (tz = visitorTz()): string | null => {
  const c = displayCurrency(tz);
  return c === "USD" ? null : c;
};

export const formatMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en")}`;
  }
};

/** the browser's region setting (en-IN → "India"), or "" when it has none */
export const browserRegion = (): string => {
  try {
    const lang = navigator.languages?.[0] || navigator.language || "";
    const region = new Intl.Locale(lang).maximize().region;
    if (!region) return "";
    return new Intl.DisplayNames(["en"], { type: "region" }).of(region) ?? region;
  } catch {
    return "";
  }
};

/** the visitor's own clock, e.g. "Fri 20 Nov, 10:30 pm (GMT+5:30)" */
export const visitorLocalTime = (tz = visitorTz(), at = new Date()) => {
  try {
    const when = new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(at);
    const off = offsetMinutes(tz, at);
    const a = Math.abs(off);
    return `${when} (GMT${off >= 0 ? "+" : "-"}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, "0")}` : ""})`;
  } catch {
    return at.toString();
  }
};
