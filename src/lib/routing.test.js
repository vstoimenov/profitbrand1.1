import { pageFromPath, pathForPage, isCreditPage } from "./routing";

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

test("resolves credit demo pages with or without trailing slash", () => {
  expect(pageFromPath("/credit")).toBe("credit");
  expect(pageFromPath("/credit/")).toBe("credit");
  expect(pageFromPath("/credit/crm")).toBe("creditCrm");
  expect(pageFromPath("/credit/crm/")).toBe("creditCrm");
  expect(pageFromPath("/credit/other")).toBe("home");
});

test("pathForPage covers credit demo pages", () => {
  expect(pathForPage("credit")).toBe("/credit");
  expect(pathForPage("creditCrm")).toBe("/credit/crm");
});

test("isCreditPage", () => {
  expect(isCreditPage("credit")).toBe(true);
  expect(isCreditPage("creditCrm")).toBe(true);
  expect(isCreditPage("home")).toBe(false);
  expect(isCreditPage("chatgpt")).toBe(false);
});
