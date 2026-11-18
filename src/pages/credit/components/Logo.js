import { BRAND } from "../../../lib/credit";

export function BrandMark({ className = "h-7 w-7", tone = "bg-credit-pine" }) {
  return (
    <span className={`relative inline-block rounded-lg ${tone} ${className}`} aria-hidden="true">
      <span className="absolute right-[22%] top-[22%] h-[32%] w-[32%] rounded-full bg-credit-mint" />
    </span>
  );
}

export default function Logo({ onClick, light = false }) {
  return (
    <a href="/credit" onClick={onClick} className={`inline-flex items-center gap-2 font-cr-head text-xl font-bold ${light ? "text-white" : "text-credit-pine"}`} aria-label={BRAND}>
      <BrandMark tone={light ? "bg-credit-pine2 ring-1 ring-white/20" : "bg-credit-pine"} />
      {BRAND}
    </a>
  );
}
