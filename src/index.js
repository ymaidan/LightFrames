// Export clean API for TodoMVC
export const DOM = {
  createElement: MiniFramework.createVirtualNode,
  render: MiniFramework.renderToDOM
};

export class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.subscribers = [];
    MiniState.updateState(initialState);
  }

  getState() {
    return MiniState.getCurrentState();
  }

  setState(newState) {
    MiniState.updateState(newState);
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
}

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.subscribers = [];
    this.currentRoute = this.getCurrentRoute();
    
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
