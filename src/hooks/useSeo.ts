import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaFor } from "@/data/seo";
import { profile } from "@/data/profile";

const setMeta = (selector: string, attr: string, value: string) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** keeps title, description and canonical in step with the route */
export function useSeo() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = metaFor(pathname.replace(/\/+$/, "") || "/");
    const url = `${profile.site}${m.path === "/" ? "/" : m.path + "/"}`;
    document.title = m.title;
    setMeta('meta[name="description"]', "content", m.description);
    setMeta('link[rel="canonical"]', "href", url);
    setMeta('meta[property="og:title"]', "content", m.title);
    setMeta('meta[property="og:description"]', "content", m.description);
    setMeta('meta[property="og:url"]', "content", url);
    setMeta('meta[name="twitter:title"]', "content", m.title);
    setMeta('meta[name="twitter:description"]', "content", m.description);
  }, [pathname]);
}
