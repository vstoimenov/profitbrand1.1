import { daysSince, bgMonthName, daysWord } from "./dates";

test("daysSince counts calendar days from the launch date", () => {
  expect(daysSince("2026-08-24", new Date("2026-09-02T10:00:00"))).toBe(9);
});

test("daysSince never drops below 1", () => {
  expect(daysSince("2026-08-24", new Date("2026-08-24T08:00:00"))).toBe(1);
  expect(daysSince("2026-08-24", new Date("2026-08-01T08:00:00"))).toBe(1);
});

test("bgMonthName returns the Bulgarian month name", () => {
  expect(bgMonthName(new Date("2026-09-02"))).toBe("септември");
  expect(bgMonthName(new Date("2026-01-15"))).toBe("януари");
});

test("daysWord picks singular/plural", () => {
  expect(daysWord(1)).toBe("ден");
  expect(daysWord(9)).toBe("дни");
});
