import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** new page: start at the top, unless the link points at a section (#id), then go there */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      return;
    }
    // pages load on demand, so wait (up to ~3 s) for the target to appear
    let tries = 0;
    const id = decodeURIComponent(hash.slice(1));
    const t = setInterval(() => {
      const el = document.getElementById(id);
      if (el || ++tries > 30) {
        clearInterval(t);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
    return () => clearInterval(t);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
