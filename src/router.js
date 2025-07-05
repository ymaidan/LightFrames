// src/router.js

// Store all routes and the current route
let routesList = [];//(URL, component, options).
let currentRoute = null;
let routeChangeListeners = [];
let notFoundComponent = null;

// Helper: Match path with dynamic params (e.g. /game/:id)
function matchRoute(path, routePath) {
  const paramNames = [];
  // Convert /game/:id to regex: ^/game/([^/]+)$
  const regexPath = routePath.replace(/:([^/]+)/g, (_, key) => {
    paramNames.push(key);
    return '([^/]+)';
  });
  const regex = new RegExp('^' + regexPath + '$');
  const match = path.match(regex);
  if (!match) return null;
  const params = {};
  paramNames.forEach((name, i) => {
    params[name] = match[i + 1];
  });
  return params;
}

// 1. Create a new router with your routes
function makeRouter(initialRoutes = [], notFound = null) {
  routesList = [];
  notFoundComponent = notFound;
  initialRoutes.forEach(route => addRouteToRouter(route.path, route.component, route.options));
  // Listen to browser navigation (back/forward)
  MiniEvents.addEvent(window, 'popstate', handlePopState);
  // Go to the current URL on load
  goToRoute(window.location.hash.replace(/^#/, '') || '/', { replace: true });
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

// 3. Navigate to a different route (supports dynamic and 404)
function goToRoute(path, options = {}) {
  let foundRoute = null;
  let params = {};

  // Log navigation attempt
  console.log(`[Router] Navigating to: ${path}`);

  for (const route of routesList) {
    const match = matchRoute(path, route.path);
    if (match) {
      foundRoute = route;
      params = match;
      break;
    }
  }

  if (!foundRoute) {
    // Log 404 error
    console.warn(`[Router] 404 - Route not found: ${path}`);
    
    // Set current route to 404
    currentRoute = { 
      path, 
      component: notFoundComponent, 
      params: { 
        requestedPath: path 
      }, 
      options: {} 
    };

    // Update URL
    if (window.location.hash.replace(/^#/, '') !== path) {
      if (!options.replace) {
        window.location.hash = path;
      } else {
        window.location.replace('#' + path);
      }
    }

    // Notify listeners with 404 info
    routeChangeListeners.forEach(fn => fn({
      type: '404',
      path: path,
      currentRoute: currentRoute
    }));

    if (notFoundComponent && typeof notFoundComponent === 'function') {
      notFoundComponent({ requestedPath: path });
    }
    return;
  }

  // Route guard: if defined, check if navigation is allowed
  if (foundRoute.options.guard && !foundRoute.options.guard(params)) {
    return; // Block navigation
  }

  currentRoute = { ...foundRoute, params };
  // Only update the hash if it's different
  if (window.location.hash.replace(/^#/, '') !== path) {
    if (!options.replace) {
      window.location.hash = path;
    } else {
      window.location.replace('#' + path);
    }
  }
  // Notify listeners
  routeChangeListeners.forEach(fn => fn(currentRoute));
  // Render the component (if you want to auto-render)
  if (foundRoute.component && typeof foundRoute.component === 'function') {
    foundRoute.component(params);
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
  goToRoute(window.location.hash.replace(/^#/, '') || '/', { replace: true });
}

// On load and popstate, use hash:
MiniEvents.addEvent(window, 'popstate', handlePopState);
MiniEvents.addEvent(window, 'hashchange', handlePopState);

// On initial load:
goToRoute(window.location.hash.replace(/^#/, '') || '/', { replace: true });

// Add a route change listener for logging
onRouteChange((routeInfo) => {
  if (routeInfo.type === '404') {
    console.group('[Router] 404 Error');
    console.log('Requested Path:', routeInfo.path);
    console.log('Current Route:', routeInfo.currentRoute);
    console.groupEnd();
  }
});

// Export for global use
window.MiniRouter = {
  makeRouter,
  addRouteToRouter,
  goToRoute,
  getCurrentRouteInfo,
  onRouteChange
};