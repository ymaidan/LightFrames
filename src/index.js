// Mini Framework - Complete API Export
// This is the main entry point for your framework

// Wait for all framework components to be loaded
if (typeof MiniFramework === 'undefined') {
  throw new Error('MiniFramework core not loaded. Make sure to load core.js first.');
}

// Core Framework API
export const DOM = {
  createElement: MiniFramework.createVirtualNode,
  render: MiniFramework.renderToDOM
};

// State Management
export class Store {
  constructor(initialState = {}, persistenceKey = null) {
    this.persistenceKey = persistenceKey;
    this.subscribers = [];
    
    // Load from localStorage if persistence key is provided
    if (persistenceKey) {
      const savedState = this.loadFromStorage();
      this.state = savedState ? { ...initialState, ...savedState } : initialState;
    } else {
      this.state = initialState;
    }
    
    MiniState.updateState(this.state);
    
    // Log persistence status
    if (persistenceKey) {
      console.log('💾 Store initialized with persistence key:', persistenceKey);
      console.log('📦 Loaded state from localStorage:', this.state);
    }
  }

  getState() {
    return MiniState.getCurrentState();
  }

  setState(newState) {
    MiniState.updateState(newState);
    
    // Save to localStorage if persistence is enabled
    if (this.persistenceKey) {
      this.saveToStorage();
    }
    
    this.notifySubscribers();
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Error in store subscriber:', error);
      }
    });
  }

  // localStorage methods
  saveToStorage() {
    if (!this.persistenceKey) return;
    
    try {
      const state = this.getState();
      const serializedState = JSON.stringify(state);
      localStorage.setItem(this.persistenceKey, serializedState);
      console.log('💾 Saved to localStorage:', this.persistenceKey, state);
    } catch (error) {
      console.error('❌ Failed to save to localStorage:', error);
    }
  }

  loadFromStorage() {
    if (!this.persistenceKey) return null;
    
    try {
      const serializedState = localStorage.getItem(this.persistenceKey);
      if (serializedState === null) {
        console.log('📦 No saved state found in localStorage');
        return null;
      }
      
      const state = JSON.parse(serializedState);
      console.log('📦 Loaded from localStorage:', this.persistenceKey, state);
      return state;
    } catch (error) {
      console.error('❌ Failed to load from localStorage:', error);
      localStorage.removeItem(this.persistenceKey);
      return null;
    }
  }

  clearStorage() {
    if (!this.persistenceKey) return;
    
    try {
      localStorage.removeItem(this.persistenceKey);
      console.log('🧹 Cleared localStorage:', this.persistenceKey);
    } catch (error) {
      console.error('❌ Failed to clear localStorage:', error);
    }
  }
}

// Routing System
export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.subscribers = [];
    this.currentRoute = this.getCurrentRoute();
    
    // Use custom event system
    MiniEvents.addEvent(window, 'hashchange', () => {
      this.handleRouteChange();
    });
    
    setTimeout(() => this.handleRouteChange(), 0);
  }

  getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/';
    return this.routes[hash] || this.routes['/'] || 'all';
  }

  navigate(path) {
    window.location.hash = path;
  }

  handleRouteChange() {
    const newRoute = this.getCurrentRoute();
    if (newRoute !== this.currentRoute) {
      this.currentRoute = newRoute;
      this.notifySubscribers();
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentRoute);
      } catch (error) {
        console.error('Error in router subscriber:', error);
      }
    });
  }
}

// Event System
export const Events = MiniEvents;

// Main Framework Export
export default {
  DOM,
  Store,
  Router,
  Events
};
