// Enhanced Framework API - Better DOM abstraction
// This builds on top of your existing framework

// Enhanced DOM API
const EnhancedDOM = {
  // Core framework methods
  createElement: MiniFramework.createVirtualNode,
  render: MiniFramework.renderToDOM,
  
  // Enhanced mounting with selector support
  mount: (component, selector, store = null) => {
    const container = typeof selector === 'string' ? 
      document.querySelector(selector) : selector;
    
    if (!container) {
      throw new Error(`Mount target not found: ${selector}`);
    }
    
    // If component is a function, execute it
    const vNode = typeof component === 'function' ? component() : component;
    
    // Store reference for reactive updates
    if (store) {
      container._frameworkStore = store;
      container._frameworkComponent = component;
      
      // Auto re-render on state changes
      store.subscribe(() => {
        const newVNode = typeof component === 'function' ? component() : component;
        EnhancedDOM.render(newVNode, container);
      });
    }
    
    EnhancedDOM.render(vNode, container);
    return container;
  },

  // Enhanced app creation
  createApp: (config) => {
    const { component, store, container } = config;
    
    return {
      component,
      store,
      container,
      mount: () => EnhancedDOM.mount(component, container, store)
    };
  },

  // Helper for common elements
  div: (attrs = {}, children = []) => 
    EnhancedDOM.createElement('div', attrs, children),
  
  button: (attrs = {}, children = []) => 
    EnhancedDOM.createElement('button', attrs, children),
  
  span: (attrs = {}, children = []) => 
    EnhancedDOM.createElement('span', attrs, children),
  
  input: (attrs = {}) => 
    EnhancedDOM.createElement('input', attrs, [])
};

// Export for global use
if (typeof window !== 'undefined') {
  window.EnhancedDOM = EnhancedDOM;
}
