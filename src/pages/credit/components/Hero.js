import Calculator from "./Calculator";
import Reveal from "./Reveal";
import { scrollToId } from "./Header";

/* Port of the template's HeroHome: stripes + glow illustration, centered copy,
   two CTAs, and the calculator in place of the template's terminal window. */
export default function Hero({ onRequest }) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2" aria-hidden="true">
        <img className="max-w-none" src="/credit/stripes.svg" width={768} alt="" />
      </div>
      <div className="pointer-events-none absolute -top-32 left-1/2 ml-[580px] -translate-x-1/2" aria-hidden="true">
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-credit-mint opacity-40 blur-[160px]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[420px] ml-[380px] -translate-x-1/2" aria-hidden="true">
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-credit-mint to-credit-pine opacity-40 blur-[160px]" />
      </div>
      <div className="pointer-events-none absolute left-1/2 top-[640px] -ml-[300px] -translate-x-1/2" aria-hidden="true">
        <div className="h-80 w-80 rounded-full bg-gradient-to-tr from-credit-mint to-credit-pine opacity-40 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-12 text-center md:pb-14">
            <Reveal>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#dcefe5] px-3 py-1 text-sm font-semibold text-credit-pine2">
                <span className="h-2 w-2 rounded-full bg-credit-mint" /> 14 банки · едно запитване
              </span>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mx-auto mb-6 max-w-4xl text-balance font-cr-head text-4xl font-bold leading-[1.08] tracking-tight text-credit-ink sm:text-5xl md:text-6xl">
                Жилищен кредит, <span className="bg-[linear-gradient(transparent_62%,#bfeed7_62%)] text-credit-pine2">без да обикаляш</span> банките.
              </h1>
            </Reveal>
            <div className="mx-auto max-w-3xl">
              <Reveal delay={0.16}>
                <p className="mb-8 text-lg text-credit-soft">
                  Изчисли вноската, сподели целта си с AI асистента и получи сравнение на реални предложения от банките. Безплатно за теб.
                </p>
              </Reveal>
              <Reveal delay={0.24}>
                <div className="mx-auto flex max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                  <a
                    href="#zapitvane"
                    onClick={scrollToId("zapitvane")}
                    className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-t from-credit-pine to-credit-pine2 px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-110"
                  >
                    Започни запитване
                    <span className="ml-1.5 text-credit-mint transition-transform group-hover:translate-x-0.5">→</span>
                  </a>
                  <a
                    href="#asistent"
                    onClick={scrollToId("asistent")}
                    className="inline-flex items-center justify-center rounded-xl border border-credit-line bg-white px-5 py-3 font-semibold text-credit-pine shadow-sm transition hover:bg-credit-mist"
                  >
                    Говори с асистента
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.3}>
            <div id="kalkulator" className="mx-auto max-w-3xl scroll-mt-28">
              <Calculator onRequest={onRequest} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
