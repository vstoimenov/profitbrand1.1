import Logo from "./Logo";

export default function Footer({ nav }) {
  return (
    <footer className="bg-credit-pine text-[#cfe3da]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-3">
          <div><Logo light onClick={(e) => { e.preventDefault(); nav("credit"); window.scrollTo?.(0, 0); }} /></div>
          <p>© 2026 Финора · Изчисленията са ориентировъчни и не са оферта. Решенията са на банките.</p>
        </div>
        <ul className="space-y-2">
          <li>
            <a className="underline-offset-4 hover:text-white hover:underline" href="https://www.bnb.bg/" target="_blank" rel="noopener noreferrer">
              Регистър на кредитните посредници (БНБ)
            </a>
          </li>
          <li>
            <a className="underline-offset-4 hover:text-white hover:underline" href="/credit/crm" onClick={(e) => { e.preventDefault(); nav("creditCrm"); }}>
              Демо: виж CRM
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
