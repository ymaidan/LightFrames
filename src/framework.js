// 1. Create virtual DOM element (hyperscript function)
function h(tag, attrs = {}, children = []) {
  // Allow children to be a single item or array
  if (!Array.isArray(children)) children = [children];
  return MiniFramework.createVirtualNode(tag, attrs, children);
}

// 2. Create a functional component
function createComponent(renderFunction) {
  // Returns an object with a render method
  return {
    render: renderFunction
  };
}

// 3. Create an application instance
function createApp({ rootComponent, router, state }) {
  return {
    rootComponent,
    router,
    state,
    _instance: null // Will hold the mounted component instance
  };
}

// 4. Mount the app to a DOM container
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

// 5. Export the public API
window.Mini = {
  h,
  createComponent,
  createApp,
  mount,
  // Optionally expose other APIs for advanced users:
  ...MiniFramework,
  ...MiniComponent,
  ...MiniState,
  ...MiniEvents,
  ...MiniRouter
};
