import { useEffect, useState } from "react";
import { displayCurrency, getGeo, loadGeo, onGeoChange, type VisitorGeo } from "@/lib/visitor";

/**
 * The visitor's location for the UI: starts from the browser's time zone (or the
 * session's cached IP lookup), then updates once the IP lookup answers.
 */
export function useVisitor(): VisitorGeo & { currency: string } {
  const [g, setG] = useState(getGeo);
  useEffect(() => {
    const off = onGeoChange(() => setG(getGeo()));
    void loadGeo();
    return () => {
      off();
    };
  }, []);
  return { ...g, currency: displayCurrency(g.tz, g.countryCode) };
}
