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

/* ---- currency by time zone: the common ones; anywhere else just sees USD and AED ---- */
const EUR_ZONES = [
  "Amsterdam", "Athens", "Berlin", "Bratislava", "Brussels", "Dublin", "Helsinki", "Lisbon", "Ljubljana", "Luxembourg",
  "Madrid", "Malta", "Monaco", "Paris", "Riga", "Rome", "Tallinn", "Vienna", "Vilnius", "Zagreb",
];
const BY_ZONE: Record<string, string> = {
  "Asia/Kolkata": "INR", "Asia/Calcutta": "INR",
  "Asia/Riyadh": "SAR", "Asia/Qatar": "QAR", "Asia/Kuwait": "KWD", "Asia/Bahrain": "BHD", "Asia/Muscat": "OMR",
  "Asia/Karachi": "PKR", "Asia/Dhaka": "BDT", "Asia/Colombo": "LKR", "Asia/Kathmandu": "NPR",
  "Asia/Singapore": "SGD", "Asia/Kuala_Lumpur": "MYR", "Asia/Manila": "PHP", "Asia/Jakarta": "IDR", "Asia/Bangkok": "THB",
  "Asia/Tokyo": "JPY", "Asia/Shanghai": "CNY", "Asia/Hong_Kong": "HKD", "Asia/Seoul": "KRW",
  "Europe/London": "GBP", "Europe/Zurich": "CHF", "Europe/Stockholm": "SEK", "Europe/Oslo": "NOK",
  "Europe/Copenhagen": "DKK", "Europe/Warsaw": "PLN", "Europe/Istanbul": "TRY", "Europe/Prague": "CZK",
  "Asia/Dubai": "AED",
  "Africa/Cairo": "EGP", "Africa/Lagos": "NGN", "Africa/Nairobi": "KES", "Africa/Johannesburg": "ZAR",
  "America/Toronto": "CAD", "America/Vancouver": "CAD", "America/Sao_Paulo": "BRL", "America/Mexico_City": "MXN",
  "Pacific/Auckland": "NZD",
};
/** US time zones: prices stay in plain dollars there */
const isUsZone = (tz: string) =>
  /^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Detroit|Boise|Indiana|Kentucky|North_Dakota|Juneau|Sitka|Nome|Adak|Menominee)/.test(tz) ||
  tz === "Pacific/Honolulu";

/**
 * The one currency a visitor sees prices in: AED in the UAE, INR in India, PKR in
 * Pakistan, EUR in the euro area, GBP in the UK, USD in the US, and USD anywhere
 * we do not map.
 */
export const displayCurrency = (tz = visitorTz()): string => {
  if (tz === HOME_TZ) return "AED";
  if (isUsZone(tz)) return "USD";
  if (BY_ZONE[tz]) return BY_ZONE[tz];
  if (tz.startsWith("Europe/") && EUR_ZONES.includes(tz.split("/")[1])) return "EUR";
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
