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

// Simple App class for easy routing
export class App {
  constructor() {
    this.routes = {};
    this.state = {};
    this.framework = {
      h: (tag, attrs = {}, children = []) => {
        if (!Array.isArray(children)) children = [children];
        return MiniFramework.createVirtualNode(tag, attrs, children);
      },
      text: (content) => String(content),
      createElement: (tag, attrs = {}, children = []) => {
        if (!Array.isArray(children)) children = [children];
        return MiniFramework.createVirtualNode(tag, attrs, children);
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
        MiniFramework.renderToDOM(component, container);
      }
    } else {
      // Simple 404
      const container = document.getElementById(containerId);
      if (container) {
        const notFound = this.framework.h('div', { style: 'text-align: center; color: white; padding: 40px;' }, [
          this.framework.h('h1', { style: 'color: #ff6b6b; margin-bottom: 20px;' }, [this.framework.text('404')]),
          this.framework.h('p', {}, [this.framework.text(`Route "${path}" not found`)])
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

// State Management
export class Store {
  constructor(initialState = {}, persistenceKey = null) {
    this.persistenceKey = persistenceKey;
    this.subscribers = [];
    
    // Load from localStorage if persistence key is provided
    if (persistenceKey) {
      const savedState = this.loadFromStorage();
      this.state = savedState || initialState;
      if (savedState) {
        console.log(`📦 Loaded state from localStorage: ${JSON.stringify(savedState)}`);
      } else {
        console.log('📦 No saved state found in localStorage');
      }
    } else {
      this.state = initialState;
    }
    
    console.log(`💾 Store initialized with persistence key: ${persistenceKey}`);
  }

  getState() {
    return { ...this.state };
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.saveToStorage();
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
    this.subscribers.forEach(callback => callback(this.getState()));
  }

  // localStorage methods
  saveToStorage() {
    if (!this.persistenceKey) return;
    
    try {
      localStorage.setItem(this.persistenceKey, JSON.stringify(this.state));
      console.log(`💾 Saved to localStorage: ${this.persistenceKey}`, this.state);
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }

  loadFromStorage() {
    if (!this.persistenceKey) return null;
    
    try {
      const data = localStorage.getItem(this.persistenceKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
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

// ✅ Import Router properly
import { Router } from './router.js';

// Event System
export const Events = {
  addEvent: MiniEvents.addEvent,
  removeEvent: MiniEvents.removeEvent,
  triggerEvent: MiniEvents.triggerEvent
};

// 404 Component (use global version)
export const NotFoundComponent = window.NotFoundComponent || (() => {
  console.warn('NotFoundComponent not loaded properly');
  return DOM.createElement('div', {}, ['404 Component not loaded']);
});

// ✅ Export Router properly
export { Router };

// Main Framework Export
export default {
  DOM,
  App,
  Store,
  Router,
  Events,
  NotFoundComponent
};

// Legacy support - make everything available globally
if (typeof window !== 'undefined') {
  window.LightFrame = {
    DOM,
    App,
    Store,
    Router,
    Events,
    NotFoundComponent
  };
}
