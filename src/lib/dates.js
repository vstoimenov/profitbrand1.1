const BG_MONTHS = [
  "януари", "февруари", "март", "април", "май", "юни",
  "юли", "август", "септември", "октомври", "ноември", "декември",
];

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/* Calendar days elapsed since an ISO date (local time). Never below 1. */
export function daysSince(isoDate, now = new Date()) {
  const [y, m, d] = isoDate.split("-").map(Number);
  const start = new Date(y, m - 1, d).getTime();
  const diff = Math.round((startOfDay(now) - start) / DAY_MS);
  return Math.max(1, diff);
}

export function bgMonthName(date = new Date()) {
  return BG_MONTHS[date.getMonth()];
}

export function daysWord(n) {
  return n === 1 ? "ден" : "дни";
}
