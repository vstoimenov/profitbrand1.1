/* Port of the template's LargeTestimonial; initials instead of a stock photo. */
export default function Testimonial() {
  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="space-y-4 py-12 text-center md:py-20">
          <div className="relative inline-flex">
            <svg className="absolute -left-6 -top-2 -z-10" width={40} height={49} viewBox="0 0 40 49" fill="none" aria-hidden="true">
              <path d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z" fill="#bfeed7" />
            </svg>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-credit-pine font-cr-head font-semibold text-credit-mint">МП</span>
          </div>
          <p className="text-balance font-cr-head text-2xl font-bold text-credit-ink">
            „Получих три оферти за една седмица, <em className="font-semibold not-italic text-credit-pine2">без да стъпя в банка</em>.“
          </p>
          <div className="text-sm font-medium text-credit-soft">
            <span className="text-credit-ink">Мария П.</span> <span className="text-credit-line">/</span> София
          </div>
          <div className="inline-block rounded-full bg-white px-3 py-1 text-xs text-credit-soft ring-1 ring-credit-line">Примерен отзив</div>
        </div>
      </div>
    </section>
  );
}
