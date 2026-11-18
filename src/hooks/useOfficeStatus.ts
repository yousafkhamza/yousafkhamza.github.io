import { useEffect, useState } from "react";

/** Online during Dubai office hours (Mon–Fri, 9:00–18:00), otherwise when I'm back. */
const START = 9;
const END = 18;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const parts = (timeZone: string) => {
  const p = new Intl.DateTimeFormat("en-US", { weekday: "short", hour: "numeric", hourCycle: "h23", timeZone })
    .formatToParts(new Date());
  const day = DAYS.indexOf(p.find((x) => x.type === "weekday")?.value ?? "Mon");
  const hour = Number(p.find((x) => x.type === "hour")?.value ?? 12);
  return { day, hour };
};

const isWorkday = (d: number) => d >= 1 && d <= 5;

export function officeStatus(timeZone: string): { online: boolean; back?: string } {
  const { day, hour } = parts(timeZone);
  if (isWorkday(day) && hour >= START && hour < END) return { online: true };
  // same morning before 9, otherwise the next workday
  if (isWorkday(day) && hour < START) return { online: false, back: "9 AM" };
  let next = (day + 1) % 7;
  while (!isWorkday(next)) next = (next + 1) % 7;
  const tomorrow = next === (day + 1) % 7;
  return { online: false, back: tomorrow ? "9 AM" : `${DAYS[next]} 9 AM` };
}

export function useOfficeStatus(timeZone: string) {
  const [status, setStatus] = useState(() => officeStatus(timeZone));
  useEffect(() => {
    const id = setInterval(() => setStatus(officeStatus(timeZone)), 60_000);
    return () => clearInterval(id);
  }, [timeZone]);
  return status;
}
