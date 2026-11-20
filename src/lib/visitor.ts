/**
 * Where the visitor is. First choice is their IP location (so a VPN changes it):
 * one request to a free, key-less geo service, cached for the browser session.
 * If that fails or is slow, the browser's own time zone is used, as before.
 * Drives "your time" on the board, office hours and the price currency.
 */
export const HOME_TZ = "Asia/Dubai";

export interface VisitorGeo {
  tz: string;
  countryCode?: string;
  country?: string;
  city?: string;
  source: "ip" | "browser";
}

const browserTz = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || HOME_TZ;
  } catch {
    return HOME_TZ;
  }
};

const validTz = (tz: unknown): tz is string => {
  if (typeof tz !== "string" || !tz) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

const GEO_KEY = "visitor-geo-v2";
let geo: VisitorGeo | null = null;
try {
  const cached = typeof sessionStorage !== "undefined" ? sessionStorage.getItem(GEO_KEY) : null;
  if (cached) geo = JSON.parse(cached) as VisitorGeo;
} catch {
  /* private mode */
}
const listeners = new Set<() => void>();
export const onGeoChange = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getGeo = (): VisitorGeo => geo ?? { tz: browserTz(), source: "browser" };

let loading: Promise<void> | null = null;
/**
 * Look the visitor up by IP once per page load (so switching a VPN and refreshing
 * takes effect); the session cache only paints the first instant. Quietly keeps
 * the browser time zone if no service answers.
 */
export const loadGeo = () => {
  if (loading || typeof fetch === "undefined") return loading ?? Promise.resolve();
  const sources: [string, (d: any) => Omit<VisitorGeo, "source"> | null][] = [
    ["https://get.geojs.io/v1/ip/geo.json", (d) => (validTz(d?.timezone) ? { tz: d.timezone, countryCode: d.country_code, country: d.country, city: d.city } : null)],
    ["https://ipwho.is/", (d) => (d?.success !== false && validTz(d?.timezone?.id) ? { tz: d.timezone.id, countryCode: d.country_code, country: d.country, city: d.city } : null)],
  ];
  loading = (async () => {
    for (const [url, pick] of sources) {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 4000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) continue;
        const found = pick(await res.json());
        if (!found) continue;
        geo = { ...found, countryCode: found.countryCode?.toUpperCase(), source: "ip" };
        try {
          sessionStorage.setItem(GEO_KEY, JSON.stringify(geo));
        } catch {
          /* private mode */
        }
        listeners.forEach((fn) => fn());
        return;
      } catch {
        /* try the next one */
      } finally {
        clearTimeout(t);
      }
    }
  })();
  return loading;
};

export const visitorTz = (): string => getGeo().tz;

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

/** currency by ISO country code, used when the IP lookup gives us the country */
const BY_COUNTRY: Record<string, string> = {
  AE: "AED", US: "USD", PR: "USD", IN: "INR", PK: "PKR", BD: "BDT", LK: "LKR", NP: "NPR",
  GB: "GBP", JE: "GBP", GG: "GBP", IM: "GBP", GI: "GBP",
  SA: "SAR", QA: "QAR", KW: "KWD", BH: "BHD", OM: "OMR", JO: "JOD", IL: "ILS", GE: "GEL", TR: "TRY",
  CH: "CHF", LI: "CHF", SE: "SEK", NO: "NOK", DK: "DKK", FO: "DKK", IS: "ISK", PL: "PLN", CZ: "CZK",
  HU: "HUF", RO: "RON", RS: "RSD", BA: "BAM", MK: "MKD", AL: "ALL", MD: "MDL", UA: "UAH",
  SG: "SGD", MY: "MYR", PH: "PHP", ID: "IDR", TH: "THB", VN: "VND", JP: "JPY", CN: "CNY", HK: "HKD", TW: "TWD", KR: "KRW",
  EG: "EGP", MA: "MAD", NG: "NGN", GH: "GHS", KE: "KES", ZA: "ZAR",
  CA: "CAD", BR: "BRL", MX: "MXN", CO: "COP", CL: "CLP", PE: "PEN", AU: "AUD", NZ: "NZD",
};
// the euro: all 21 EU members using it (Bulgaria since 2026), plus the countries and territories that use it too
for (const cc of ["AT", "BE", "BG", "HR", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
  "MC", "SM", "VA", "AD", "ME", "XK", "AX", "RE", "YT", "GP", "MQ", "GF", "BL", "MF", "PM"]) BY_COUNTRY[cc] = "EUR";

/**
 * The one currency a visitor sees prices in: AED in the UAE, INR in India, PKR in
 * Pakistan, EUR in every euro country, GBP in the UK, USD in the US, and USD
 * anywhere we do not map. The IP country wins when we have it (so a VPN changes
 * it); otherwise the time zone decides.
 */
export const displayCurrency = (tz = visitorTz(), countryCode: string | undefined = tz === visitorTz() ? getGeo().countryCode : undefined): string => {
  if (countryCode) return BY_COUNTRY[countryCode.toUpperCase()] ?? "USD";
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
