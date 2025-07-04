// src/router.js

// Store all routes and the current route
let routesList = [];//(URL, component, options).
let currentRoute = null;
let routeChangeListeners = [];

// 1. Create a new router with your routes
function makeRouter(initialRoutes = []) {
  routesList = [];
  initialRoutes.forEach(route => addRouteToRouter(route.path, route.component, route.options));
  // Listen to browser navigation (back/forward)
  window.addEventListener('popstate', handlePopState);
  // Go to the current URL on load
  goToRoute(window.location.pathname, { replace: true });
  return {
    addRouteToRouter,
    goToRoute,
    getCurrentRouteInfo,
    onRouteChange
  };
}

// 2. Add a new route (URL and component)
function addRouteToRouter(path, component, options = {}) {
  routesList.push({ path, component, options });
}

// 3. Navigate to a different route
function goToRoute(path, options = {}) {
  const route = routesList.find(r => r.path === path);
  if (!route) {
    // Not found, you can show a 404 component or do nothing
    return;
  }
  // Route guard: if defined, check if navigation is allowed
  if (route.options.guard && !route.options.guard()) {
    return; // Block navigation
  }
  currentRoute = route;
  // Update browser URL
  if (!options.replace) {
    window.history.pushState({}, '', path);
  } else {
    window.history.replaceState({}, '', path);
  }
  // Notify listeners
  routeChangeListeners.forEach(fn => fn(currentRoute));
  // Render the component (if you want to auto-render)
  if (route.component && typeof route.component === 'function') {
    route.component();
  }
}

// 4. Get info about the current route
function getCurrentRouteInfo() {
  return currentRoute;
}

// 5. Listen for route changes
function onRouteChange(callback) {
  routeChangeListeners.push(callback);
  // Return a function to remove the listener
  return () => {
    const idx = routeChangeListeners.indexOf(callback);
    if (idx > -1) routeChangeListeners.splice(idx, 1);
  };
}

// Handle browser back/forward
function handlePopState() {
  goToRoute(window.location.pathname, { replace: true });
}

// Export for global use
window.MiniRouter = {
  makeRouter,
  addRouteToRouter,
  goToRoute,
  getCurrentRouteInfo,
  onRouteChange
};