// src/router.js - LightFrame Router with README.md compatible API

// Internal router implementation
let routesList = [];
let currentRoute = null;
let routeChangeListeners = [];
let notFoundComponent = null;

// Helper: Match path with dynamic params
function matchRoute(path, routePath) {
  const paramNames = [];
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

// Navigate to a route
function goToRoute(path, options = {}) {
  let foundRoute = null;
  let params = {};

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
    console.warn(`[Router] 404 - Route not found: ${path}`);
    
    if (notFoundComponent && typeof notFoundComponent === 'function') {
      currentRoute = { 
        path, 
        component: notFoundComponent, 
        params: { requestedPath: path }, 
        options: {},
        is404: true
      };
      
      if (window.location.hash.replace(/^#/, '') !== path) {
        if (!options.replace) {
          window.location.hash = path;
        } else {
          window.location.replace('#' + path);
        }
      }
      
      routeChangeListeners.forEach(fn => fn(currentRoute));
      notFoundComponent({ requestedPath: path });
    }
    return;
  }

  if (foundRoute.options && foundRoute.options.guard && !foundRoute.options.guard(params)) {
    return;
  }

  currentRoute = { ...foundRoute, params, is404: false };
  
  if (window.location.hash.replace(/^#/, '') !== path) {
    if (!options.replace) {
      window.location.hash = path;
    } else {
      window.location.replace('#' + path);
    }
  }
  
  routeChangeListeners.forEach(fn => fn(currentRoute));
  
  if (foundRoute.component && typeof foundRoute.component === 'function') {
    foundRoute.component(params);
  }
}

// Handle browser back/forward
function handlePopState() {
  goToRoute(window.location.hash.replace(/^#/, '') || '/', { replace: true });
}

// README.md Compatible Router Class
class Router {
  constructor(routes, notFound = null) {
    routesList = [];
    notFoundComponent = notFound;
    routeChangeListeners = [];
    
    // Convert routes object to array format
    if (typeof routes === 'object' && !Array.isArray(routes)) {
      Object.entries(routes).forEach(([path, component]) => {
        this.addRoute(path, component);
      });
    } else if (Array.isArray(routes)) {
      routes.forEach(route => {
        this.addRoute(route.path, route.component, route.options);
      });
    }
    
    // Setup browser navigation
    if (typeof window !== 'undefined') {
      // Remove existing listeners to avoid duplicates
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
      
      // Add new listeners
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('hashchange', handlePopState);
      
      // Initialize with current URL
      setTimeout(() => {
        goToRoute(window.location.hash.replace(/^#/, '') || '/', { replace: true });
      }, 0);
    }
  }
  
  // Add a route
  addRoute(path, component, options = {}) {
    routesList.push({ path, component, options });
    return this;
  }
  
  // Navigate to a route (README.md compatible)
  navigate(path, options = {}) {
    goToRoute(path, options);
    return this;
  }
  
  // Subscribe to route changes (README.md compatible)
  subscribe(callback) {
    routeChangeListeners.push(callback);
    // Return unsubscribe function
    return () => {
      const idx = routeChangeListeners.indexOf(callback);
      if (idx > -1) routeChangeListeners.splice(idx, 1);
    };
  }
  
  // Get current route info
  getCurrentRoute() {
    return currentRoute ? (currentRoute.component || currentRoute.path) : null;
  }
  
  // Get current route name/component
  getCurrentRouteInfo() {
    return currentRoute;
  }
}

// Legacy API for backward compatibility
const MiniRouter = {
  makeRouter: (routes, notFound) => new Router(routes, notFound),
  addRouteToRouter: (path, component, options) => {
    routesList.push({ path, component, options });
  },
  goToRoute,
  getCurrentRouteInfo: () => currentRoute,
  onRouteChange: (callback) => {
    routeChangeListeners.push(callback);
    return () => {
      const idx = routeChangeListeners.indexOf(callback);
      if (idx > -1) routeChangeListeners.splice(idx, 1);
    };
  }
};

// Export for global use
if (typeof window !== 'undefined') {
  window.MiniRouter = MiniRouter;
  window.Router = Router;
}

// ✅ Proper ES6 export for modules
export { Router, MiniRouter };
