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

// 4. Create an application instance (legacy)
function createApp({ rootComponent, router, state }) {
  return {
    rootComponent,
    router,
    state,
    _instance: null // Will hold the mounted component instance
  };
}

// 5. Mount the app to a DOM container (legacy)
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

// 6. Export the public API - with safe checks
window.Mini = {
  h,
  text,
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
