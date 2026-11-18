import Logo from "./Logo";

const LINKS = [
  ["Кредити", "krediti"],
  ["Как работи", "kak"],
  ["Асистент", "asistent"],
  ["Банки", "banki"],
];

export const scrollToId = (id) => (e) => {
  e?.preventDefault?.();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* Port of the template's floating header. */
export default function Header({ nav }) {
  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl border border-credit-line/80 bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-sm">
          <div className="flex flex-1 items-center">
            <Logo onClick={(e) => { e.preventDefault(); nav("credit"); window.scrollTo?.(0, 0); }} />
          </div>
          <nav className="hidden md:block" aria-label="Основна навигация">
            <ul className="flex items-center gap-6 text-sm font-medium text-credit-soft">
              {LINKS.map(([label, id]) => (
                <li key={id}>
                  <a href={`#${id}`} onClick={scrollToId(id)} className="transition hover:text-credit-pine">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-1 justify-end">
            <a
              href="#zapitvane"
              onClick={scrollToId("zapitvane")}
              className="inline-flex items-center rounded-xl bg-credit-pine px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-credit-pine2 sm:px-4"
            >
              <span className="sm:hidden">Консултация</span>
              <span className="hidden sm:inline">Безплатна консултация</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
