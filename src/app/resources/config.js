const baseURL = "blogorithm.vercel.app";

const routes = {
  "/": true,
  "/about": true,
  "/authors": false,
  "/blog": true,
  "/gallery": false,
};

// Enable password protection on selected routes
// Set password in pages/api/authenticate.ts
const protectedRoutes = {};

export { routes, protectedRoutes, baseURL };
