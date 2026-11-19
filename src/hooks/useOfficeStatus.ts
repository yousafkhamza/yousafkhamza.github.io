import { useEffect, useState } from "react";
import { HOME_TZ, offsetMinutes, sameClockAsHome, visitorTz } from "@/lib/visitor";

/**
 * Online during Dubai office hours (Mon–Fri, 9:00–18:00 Dubai time), otherwise
 * when I'm back. Times are worked out as real moments, so a visitor in India
 * sees "back 10:30 AM your time" next to "9 AM Dubai".
 */
const START = 9;
const END = 18;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const isWorkday = (d: number) => d >= 1 && d <= 5;

export interface OfficeStatus {
  online: boolean;
  /** Dubai label: "9 AM", "Mon 9 AM", or when online the closing time "6 PM" */
  back?: string;
  until?: string;
  /** the same moment on the visitor's clock, only when it differs from Dubai */
  backLocal?: string;
  untilLocal?: string;
}

/** a Date for HH:00 Dubai time, `addDays` after the Dubai date of `now` */
const dubaiMoment = (now: Date, addDays: number, hour: number, homeTz: string) => {
  const off = offsetMinutes(homeTz, now);
  const local = new Date(now.getTime() + off * 60_000); // Dubai wall clock read through UTC getters
  return new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() + addDays, hour, 0) - off * 60_000);
};

const labelIn = (at: Date, tz: string, now: Date) => {
  const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...o }).format(at);
  const day = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(d);
  const time = fmt({ hour: "numeric", minute: "2-digit" }).replace(":00", "");
  const tomorrow = new Date(now.getTime() + 86_400_000);
  if (day(at) === day(now) || day(at) === day(tomorrow)) return time;
  return `${fmt({ weekday: "short" })} ${time}`;
};

export function officeStatus(homeTz = HOME_TZ, now = new Date(), tz = visitorTz()): OfficeStatus {
  const off = offsetMinutes(homeTz, now);
  const local = new Date(now.getTime() + off * 60_000);
  const day = local.getUTCDay();
  const hour = local.getUTCHours();
  const differs = !sameClockAsHome(tz);

  if (isWorkday(day) && hour >= START && hour < END) {
    const close = dubaiMoment(now, 0, END, homeTz);
    return { online: true, until: labelIn(close, homeTz, now), untilLocal: differs ? labelIn(close, tz, now) : undefined };
  }
  // same morning before 9, otherwise the next workday
  let add = 0;
  if (!(isWorkday(day) && hour < START)) {
    add = 1;
    while (!isWorkday((day + add) % 7)) add++;
  }
  const open = dubaiMoment(now, add, START, homeTz);
  const back = add <= 1 ? labelIn(open, homeTz, now) : `${DAYS[(day + add) % 7]} ${labelIn(open, homeTz, now).replace(/^\w{3} /, "")}`;
  return { online: false, back, backLocal: differs ? labelIn(open, tz, now) : undefined };
}

export function useOfficeStatus(timeZone: string = HOME_TZ) {
  const [status, setStatus] = useState(() => officeStatus(timeZone));
  useEffect(() => {
    const id = setInterval(() => setStatus(officeStatus(timeZone)), 60_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return status;
}
