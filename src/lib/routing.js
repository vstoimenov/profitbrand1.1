/* Hand-rolled router: the app's top-level pages, including the credit demo. */
const ROUTES = {
  home: "/",
  admin: "/admin",
  chatgpt: "/chatgpt-ads",
  credit: "/credit",
  creditCrm: "/credit/crm",
};

export function pageFromPath(pathname) {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";
  const hit = Object.entries(ROUTES).find(([, path]) => path === clean);
  return hit ? hit[0] : "home";
}

export function pathForPage(page) {
  return ROUTES[page] || "/";
}

/* Credit demo pages render without any PROFITBRAND chrome or tracking. */
export function isCreditPage(page) {
  return page === "credit" || page === "creditCrm";
}
