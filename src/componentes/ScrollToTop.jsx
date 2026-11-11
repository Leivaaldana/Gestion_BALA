import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.querySelector(".dashboard-content")?.scrollTo(0, 0);
  }, [location.key]);

  return null;
}
