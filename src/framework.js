// 1. Create virtual DOM element (hyperscript function)
function h(tag, attrs = {}, children = []) {
  // Allow children to be a single item or array
  if (!Array.isArray(children)) children = [children];
  return MiniFramework.createVirtualNode(tag, attrs, children);
}

// 2. Create text helper function
function text(content) {
  return String(content);
}

// 3. Create a functional component
function createComponent(renderFunction) {
  // Returns an object with a render method
  return {
    render: renderFunction
  };
}

// 4. Simple App class with routing
class App {
  constructor() {
    this.routes = {};
    this.state = {};
    this.framework = {
      h: h,
      text: text,
      createElement: h
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
        MiniFramework.renderToDOM(component, container);
      }
    } else {
      // Simple 404
      const container = document.getElementById(containerId);
      if (container) {
        const notFound = h('div', { style: 'text-align: center; color: white; padding: 40px;' }, [
          h('h1', { style: 'color: #ff6b6b; margin-bottom: 20px;' }, [text('404')]),
          h('p', {}, [text(`Route "${path}" not found`)])
        ]);
        MiniFramework.renderToDOM(notFound, container);
      }
    }
  }

  // Navigate to a route
  navigate(path) {
    window.location.hash = path;
  }
}

// 5. Create an application instance (legacy)
function createApp({ rootComponent, router, state }) {
  return {
    rootComponent,
    router,
    state,
    _instance: null // Will hold the mounted component instance
  };
}

// 6. Mount the app to a DOM container (legacy)
function mount(app, container) {
  // If rootComponent is a class, instantiate it
  if (typeof app.rootComponent === 'function' && app.rootComponent.prototype && app.rootComponent.prototype.render) {
    app._instance = MiniComponent.createComponent(app.rootComponent);
    MiniComponent.renderComponentToDOM(app._instance, container);
  } else if (typeof app.rootComponent.render === 'function') {
    // If it's a functional component object
    const vNode = app.rootComponent.render();
    MiniFramework.renderToDOM(vNode, container);
  } else {
    throw new Error('Invalid rootComponent');
  }
}

// 7. Export the public API - with safe checks
window.Mini = {
  h,
  text,
  App,
  createComponent,
  createApp,
  mount,
  // Safely expose other APIs:
  ...(window.MiniFramework || {}),
  ...(window.MiniComponent || {}),
  ...(window.MiniState || {}),
  ...(window.MiniEvents || {}),
  ...(window.MiniRouter || {})
};
