const baseURL = "arfath.me";

const routes = {
  "/": true,
  "/about": true,
  "/work": true,
  "/blog": true,
  "/gallery": false,
};

// Enable password protection on selected routes
// Set password in pages/api/authenticate.ts
const protectedRoutes = {
  "/work/automate-design-handovers-with-a-figma-to-code-pipeline": true,
};

export { routes, protectedRoutes, baseURL };
