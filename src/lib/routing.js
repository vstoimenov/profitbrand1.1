/* Hand-rolled router: the app has three top-level pages. */
const ROUTES = {
  home: "/",
  admin: "/admin",
  chatgpt: "/chatgpt-ads",
};

export function pageFromPath(pathname) {
  const clean = (pathname || "/").replace(/\/+$/, "") || "/";
  const hit = Object.entries(ROUTES).find(([, path]) => path === clean);
  return hit ? hit[0] : "home";
}

export function pathForPage(page) {
  return ROUTES[page] || "/";
}
