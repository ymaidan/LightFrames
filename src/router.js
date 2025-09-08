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
    if (stateStore && stateStore.setState) {
      stateStore.setState({
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
    
    // Update state with new route info - FIX: use setState instead of updateState
    if (stateStore && stateStore.setState) {
      stateStore.setState({
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
    // Update state before navigation - FIX: use setState instead of updateState
    if (stateStore && stateStore.setState) {
      stateStore.setState({
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

// Simple App class with routing - moved here from framework.js
class App {
  constructor() {
    this.routes = {};
    this.state = {};
    this.framework = {
      h: (tag, attrs = {}, children = []) => {
        if (!Array.isArray(children)) children = [children];
        return window.MiniFramework.createVirtualNode(tag, attrs, children);
      },
      text: (content) => String(content),
      createElement: (tag, attrs = {}, children = []) => {
        if (!Array.isArray(children)) children = [children];
        return window.MiniFramework.createVirtualNode(tag, attrs, children);
      }
    };
  }

  // Simple route method
  route(path, handler) {
    this.routes[path] = handler;
    return this;
  }
  
  // Start the app
  start(containerId = 'app') {
    // Setup routing with custom event system
    if (window.MiniEvents) {
      MiniEvents.addEvent(window, 'hashchange', () => this.handleRoute(containerId));
      MiniEvents.addEvent(window, 'load', () => this.handleRoute(containerId));
    } else {
      window.onhashchange = () => this.handleRoute(containerId);
      window.onload = () => this.handleRoute(containerId);
    }
    
    // Initial route
    this.handleRoute(containerId);
  }

  handleRoute(containerId) {
    const path = window.location.hash.slice(1) || '/';
    const handler = this.routes[path];
    
    if (handler) {
      const component = handler(this.state, this.framework);
      const container = document.getElementById(containerId);
      
      if (container && component) {
        window.MiniFramework.renderToDOM(component, container);
      }
    } else {
      // Simple 404
      const container = document.getElementById(containerId);
      if (container) {
        const notFound = this.framework.h('div', {}, [
          this.framework.h('h1', {}, [this.framework.text('404')]),
          this.framework.h('p', {}, [this.framework.text(`Route "${path}" not found`)])
        ]);
        window.MiniFramework.renderToDOM(notFound, container);
      }
    }
  }

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  }
}

// Export
if (typeof window !== 'undefined') {
  window.Router = Router;
  window.App = App;
  window.MiniRouter = { Router, App };
}

export { Router, App  };