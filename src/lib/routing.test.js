import { pageFromPath, pathForPage } from "./routing";

test("resolves home", () => {
  expect(pageFromPath("/")).toBe("home");
  expect(pageFromPath("")).toBe("home");
  expect(pageFromPath("/something-else")).toBe("home");
});

test("resolves admin with or without trailing slash", () => {
  expect(pageFromPath("/admin")).toBe("admin");
  expect(pageFromPath("/admin/")).toBe("admin");
});

test("resolves chatgpt ads landing", () => {
  expect(pageFromPath("/chatgpt-ads")).toBe("chatgpt");
  expect(pageFromPath("/chatgpt-ads/")).toBe("chatgpt");
});

test("pathForPage is the inverse", () => {
  expect(pathForPage("home")).toBe("/");
  expect(pathForPage("admin")).toBe("/admin");
  expect(pathForPage("chatgpt")).toBe("/chatgpt-ads");
});
