import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Steps from "./components/Steps";
import LoanCategories from "./components/LoanCategories";
import Features from "./components/Features";
import Testimonial from "./components/Testimonial";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";

export default function Landing({ nav }) {
  const [prefill, setPrefill] = useState(null);

  const toForm = (p) => {
    setPrefill(p);
    requestAnimationFrame(() => document.getElementById("zapitvane")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Header nav={nav} />
      <main className="grow">
        <Hero onRequest={({ type, amount, downPct, years, rate }) => toForm({ type, amount, downPct, years, rate })} />
        <Steps />
        <LoanCategories />
        <Features onSend={toForm} />
        <Testimonial />
        <section id="zapitvane" className="scroll-mt-24 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-20">
            <div className="pb-8 text-center">
              <h2 className="font-cr-head text-3xl font-bold text-credit-ink md:text-4xl">Започни запитване</h2>
              <p className="mt-3 text-credit-soft">Консултант ще се свърже с теб до 24 часа. Безплатно и без ангажимент.</p>
            </div>
            <LeadForm prefill={prefill} onOpenCrm={() => { nav("creditCrm"); window.scrollTo?.(0, 0); }} />
          </div>
        </section>
      </main>
      <Footer nav={nav} />
    </div>
  );
}
