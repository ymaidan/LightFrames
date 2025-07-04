// Private variables to store our state and subscribers
let currentState = {};
let stateChangeListeners = [];
let isCurrentlyUpdating = false;

/**
 * Creates a new state store with initial data
 * @param {object} initialState - Starting state of your application
 * @returns {object} Store object with methods
 */
function createStateStore(initialState = {}) {
  // Set the initial state
  currentState = { ...initialState };
  
  // Return the store object with all our methods
  return {
    getCurrentState,
    updateState,
    listenToStateChanges,
    sendAction
  };
}

/**
 * Gets the current state
 * @returns {object} Current state (immutable copy)
 */
function getCurrentState() {
  return { ...currentState };
}

/**
 * Updates the state and notifies all listeners
 * @param {object|function} newStateOrUpdater - New state object or function that returns new state
 */
function updateState(newStateOrUpdater) {
  // Prevent updates while already updating (prevents infinite loops)
  if (isCurrentlyUpdating) {
    console.warn('State update already in progress');
    return;
  }
  
  isCurrentlyUpdating = true;
  
  try {
    let newState;
    
    // Check if we received a function or an object
    if (typeof newStateOrUpdater === 'function') {
      // If it's a function, call it with current state and use the result
      newState = newStateOrUpdater(currentState);
    } else {
      // If it's an object, merge it with current state
      newState = { ...currentState, ...newStateOrUpdater };
    }
    
    // Only update if state actually changed
    if (JSON.stringify(currentState) !== JSON.stringify(newState)) {
      // Update the state
      currentState = newState;
      
      // Notify all listeners about the change
      notifyAllStateListeners();
    }
  } finally {
    isCurrentlyUpdating = false;
  }
}

/**
 * Listen to state changes
 * @param {function} callback - Function to call when state changes
 * @returns {function} Stop listening function to remove the listener
 */
function listenToStateChanges(callback) {
  // Add the callback to our listeners list
  stateChangeListeners.push(callback);
  
  // Return a function that removes this listener
  return function stopListening() {
    const index = stateChangeListeners.indexOf(callback);
    if (index > -1) {
      stateChangeListeners.splice(index, 1);
    }
  };
}

/**
 * Sends an action to update state
 * @param {object} action - Action object with type and payload
 */
function sendAction(action) {
  if (!action || typeof action !== 'object') {
    throw new Error('Action must be an object');
  }
  
  if (!action.type) {
    throw new Error('Action must have a type property');
  }
  
  // Create a state transformer function based on action type
  const transformState = (state) => {
    switch (action.type) {
      case 'SET':
        return { ...state, ...action.payload };
      
      case 'UPDATE':
        return { ...state, ...action.payload };
      
      case 'DELETE':
        const newState = { ...state };
        if (Array.isArray(action.payload)) {
          // If payload is array of keys to delete
          action.payload.forEach(key => delete newState[key]);
        } else {
          // If payload is single key to delete
          delete newState[action.payload];
        }
        return newState;
      
      case 'RESET':
        return action.payload || {};
      
      default:
        // For custom actions, allow a custom transformer function
        if (action.transformer && typeof action.transformer === 'function') {
          return action.transformer(state, action);
        }
        return state;
    }
  };
  
  // Update state using the transformer
  updateState(transformState);
}

/**
 * Notifies all listeners about state changes
 */
function notifyAllStateListeners() {
  // Call each listener with the new state
  stateChangeListeners.forEach(callback => {
    try {
      callback(currentState);
    } catch (error) {
      console.error('Error in state listener:', error);
    }
  });
}

/**
 * Creates a reactive component that automatically re-renders when state changes
 * @param {function} renderFunction - Function that returns virtual DOM
 * @param {HTMLElement} container - DOM container to render into
 * @returns {object} Component object with methods
 */
function createAutoRenderingComponent(renderFunction, container) {
  let currentVNode = null;
  let stopListening = null;
  
  // Function to render the component
  function renderComponent() {
    const newVNode = renderFunction(getCurrentState());
    container.innerHTML = '';
    MiniFramework.renderToDOM(newVNode, container);
    currentVNode = newVNode;
  }
  
  // Listen to state changes
  stopListening = listenToStateChanges(() => {
    renderComponent();
  });
  
  // Initial render
  renderComponent();
  
  // Return component object
  return {
    render: renderComponent,
    destroy: () => {
      if (stopListening) {
        stopListening();
      }
      if (container) {
        container.innerHTML = '';
      }
    }
  };
}

// Instead of export { ... }, do this:
window.MiniState = {
  createStateStore,
  getCurrentState,
  updateState,
  listenToStateChanges,
  sendAction,
  createAutoRenderingComponent
}; 