import { render, cleanup } from "@testing-library/react";
import App from "../../App";

beforeAll(() => {
  // jsdom lacks these browser APIs used by App and framer-motion.
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } };
  window.scrollTo = () => {};
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
  global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

afterEach(() => {
  cleanup();
  document.getElementById("pb-app-styles")?.remove();
});

test("PROFITBRAND global styles are not injected on /credit", () => {
  window.history.pushState({}, "", "/credit");
  render(<App />);
  expect(document.getElementById("pb-app-styles")).toBeNull();
});
