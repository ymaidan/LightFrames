// Router with State Synchronization for LightFrame
let routes = {};
let currentRoute = null;
let listeners = [];
let appState = null;
let stateStore = null;

// Basic router class that synchronizes URL with app state
class Router {
  constructor(routeMap = {}, notFoundComponent = null, store = null) {
    routes = routeMap;
    this.notFoundComponent = notFoundComponent;
    stateStore = store;
    
    // Initialize state with routing info
    if (stateStore) {
      stateStore.updateState({
        currentRoute: '/',
        routeParams: {},
        isLoading: false
      });
    }
    
    this.init();
  }
  
  init() {
    // Use custom event system instead of addEventListener
    if (window.MiniEvents) {
      MiniEvents.addEvent(window, 'hashchange', () => this.handleRoute());
      MiniEvents.addEvent(window, 'load', () => this.handleRoute());
    } else {
      // Fallback to direct assignment
      window.onhashchange = () => this.handleRoute();
      window.onload = () => this.handleRoute();
    }
  }
  
  handleRoute() {
    const hash = window.location.hash.slice(1) || '/';
    const { route, params } = this.matchRoute(hash);
    
    // Update state with new route info
    if (stateStore) {
      stateStore.updateState({
        currentRoute: hash,
        routeParams: params,
        isLoading: false,
        route404: !route
      });
    }
    
    if (route && typeof route === 'function') {
      currentRoute = { path: hash, component: route, params, is404: false };
      this.notifyListeners(currentRoute);
      
      // Render the component
      const app = document.getElementById('app') || document.getElementById('route-view');
      if (app && window.MiniFramework) {
        const component = route(params);
        window.MiniFramework.renderToDOM(component, app);
      }
    } else {
      // Handle 404
      currentRoute = { path: hash, component: this.notFoundComponent, params: { requestedPath: hash }, is404: true };
      this.notifyListeners(currentRoute);
      
      if (this.notFoundComponent) {
        const app = document.getElementById('app') || document.getElementById('route-view');
        if (app && window.MiniFramework) {
          const component = this.notFoundComponent({ requestedPath: hash });
          window.MiniFramework.renderToDOM(component, app);
        }
      }
    }
  }
  
  // Match route with dynamic parameters (like /game/:id)
  matchRoute(path) {
    for (const [routePath, component] of Object.entries(routes)) {
      const params = this.extractParams(routePath, path);
      if (params !== null) {
        return { route: component, params };
      }
    }
    return { route: null, params: {} };
  }
  
  // Extract parameters from dynamic routes
  extractParams(routePath, actualPath) {
    const routeParts = routePath.split('/').filter(part => part);
    const pathParts = actualPath.split('/').filter(part => part);
    
    if (routeParts.length !== pathParts.length) {
      return null;
    }
    
    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i];
      const pathPart = pathParts[i];
      
      if (routePart.startsWith(':')) {
        // Dynamic parameter
        params[routePart.slice(1)] = pathPart;
      } else if (routePart !== pathPart) {
        // Static part doesn't match
        return null;
      }
    }
    
    return params;
  }
  
  navigate(path) {
    // Update state before navigation
    if (stateStore) {
      stateStore.updateState({
        isLoading: true
      });
    }
    
    window.location.hash = path;
  }
  
  addRoute(path, component) {
    routes[path] = component;
  }
  
  subscribe(callback) {
    listeners.push(callback);
    return () => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    };
  }
  
  notifyListeners(route) {
    listeners.forEach(fn => fn(route));
  }
  
  // Get current route info
  getCurrentRoute() {
    return currentRoute;
  }
}

// Export
if (typeof window !== 'undefined') {
  window.Router = Router;
  window.MiniRouter = { Router };
}

export { Router };
