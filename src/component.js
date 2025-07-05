// 1. Base class for all components
class ComponentBase {
  /**
   * Creates a new component instance.
   * @param {object} props - Properties passed to the component
   * @param {array} children - Child elements/components
   */
  constructor(props = {}, children = []) {
    this.props = props;         // Store props for use in render
    this.children = children;   // Store children for use in render
    this.state = {};            // Internal state object
    this._mounted = false;      // Track if component is mounted
    this._container = null;     // Track container element
  }

  /**
   * Method to render the component.
   * Should be overridden by subclasses.
   * @returns {object} Virtual DOM node
   */
  render() {
    // User must override this in their component
    throw new Error('render() must be implemented by the component');
  }

  /**
   * Update the component's state and re-render.
   * @param {object} newState - Partial state to merge
   */
  setState(newState) {
    // Merge new state with current state
    this.state = { ...this.state, ...newState };
    // If mounted, re-render the component
    if (this._mounted && this._container) {
      this._forceUpdate();
    }
  }

  /**
   * Force a re-render of the component
   */
  _forceUpdate() {
    if (this._container) {
      // Store current event handlers before re-render
      const eventHandlers = this._preserveEventHandlers();
      
      // Re-render the component
      const vNode = this.render();
      MiniFramework.renderToDOM(vNode, this._container);
      
      // Restore event handlers after re-render
      this._restoreEventHandlers(eventHandlers);
    }
  }

  /**
   * Preserve event handlers before re-render
   */
  _preserveEventHandlers() {
    const handlers = {};
    
    // Store decrement handler
    const decrementBtn = this._container.querySelector('.decrement-btn');
    if (decrementBtn && this.decrementHandler) {
      handlers.decrement = this.decrementHandler;
    }
    
    // Store increment handler
    const incrementBtn = this._container.querySelector('.increment-btn');
    if (incrementBtn && this.incrementHandler) {
      handlers.increment = this.incrementHandler;
    }
    
    // Store home handler
    const homeBtn = this._container.querySelector('.home-btn');
    if (homeBtn && this.homeHandler) {
      handlers.home = this.homeHandler;
    }
    
    return handlers;
  }

  /**
   * Restore event handlers after re-render
   */
  _restoreEventHandlers(handlers) {
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      // Restore decrement handler
      if (handlers.decrement) {
        const decrementBtn = this._container.querySelector('.decrement-btn');
        if (decrementBtn) {
          MiniEvents.addEvent(decrementBtn, 'click', handlers.decrement);
        }
      }
      
      // Restore increment handler
      if (handlers.increment) {
        const incrementBtn = this._container.querySelector('.increment-btn');
        if (incrementBtn) {
          MiniEvents.addEvent(incrementBtn, 'click', handlers.increment);
        }
      }
      
      // Restore home handler
      if (handlers.home) {
        const homeBtn = this._container.querySelector('.home-btn');
        if (homeBtn) {
          MiniEvents.addEvent(homeBtn, 'click', handlers.home);
        }
      }
    }, 10);
  }

  /**
   * Lifecycle method: called after component is added to the DOM.
   * Can be overridden by user.
   */
  onMount() {
    // User can override for setup logic
  }

  /**
   * Lifecycle method: called before component is removed from the DOM.
   * Can be overridden by user.
   */
  onUnmount() {
    // User can override for cleanup logic
  }
}

// 2. Helper to create a component instance
function createComponent(ComponentClass, props = {}, children = []) {
  // Create a new instance of the component
  return new ComponentClass(props, children);
}

// 3. Helper to render a component to a DOM container
function renderComponentToDOM(component, container) {
  // Store container reference
  component._container = container;
  
  // Mark as mounted
  component._mounted = true;
  
  // Initial render
  const vNode = component.render();
  MiniFramework.renderToDOM(vNode, container);
  
  // Call lifecycle hook
  if (typeof component.onMount === 'function') {
    component.onMount();
  }
}

// 4. Helper to remove a component from the DOM
function removeComponentFromDOM(component, container) {
  // Call lifecycle hook
  if (typeof component.onUnmount === 'function') {
    component.onUnmount();
  }
  // Clear the DOM
  container.innerHTML = '';
  // Mark as unmounted
  component._mounted = false;
  component._container = null;
}

// 5. Export everything for use in your app
window.MiniComponent = {
  ComponentBase,
  createComponent,
  renderComponentToDOM,
  removeComponentFromDOM
};
