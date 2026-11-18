import { useEffect } from "react";
import { BRAND } from "../../lib/credit";
import Landing from "./Landing";
import Crm from "./Crm";

const FONTS_ID = "finora-fonts";
const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;700&family=Golos+Text:wght@400;500;600&display=swap";

/* Root of the credit demo: own title, fonts and background; no PROFITBRAND chrome. */
export default function CreditApp({ page, nav }) {
  useEffect(() => {
    if (!document.getElementById(FONTS_ID)) {
      const link = document.createElement("link");
      link.id = FONTS_ID;
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      document.head.appendChild(link);
    }
    const prevTitle = document.title;
    const prevBg = document.body.style.background;
    document.title = `${BRAND} · Ипотечни и бизнес кредити`;
    document.body.style.background = "#eef4f1";
    return () => {
      document.title = prevTitle;
      document.body.style.background = prevBg;
    };
  }, []);

  return (
    <div className="min-h-screen bg-credit-mist font-cr-body text-credit-ink antialiased">
      {page === "creditCrm" ? <Crm nav={nav} /> : <Landing nav={nav} />}
    </div>
  );
}
