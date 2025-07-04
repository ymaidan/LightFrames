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
    if (this._mounted && typeof this._update === 'function') {
      this._update();
    }
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
  // Save a reference to the update function for setState
  component._update = function() {
    // Render the component and update the DOM
    const vNode = component.render();
    MiniFramework.renderToDOM(vNode, container);
  };
  // Mark as mounted
  component._mounted = true;
  // Initial render
  component._update();
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
}

// 5. Export everything for use in your app
window.MiniComponent = {
  ComponentBase,
  createComponent,
  renderComponentToDOM,
  removeComponentFromDOM
};
