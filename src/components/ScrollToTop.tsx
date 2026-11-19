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
    // the target renders with the page, so give it a moment
    const t = setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
