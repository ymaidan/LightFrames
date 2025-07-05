// Test Utilities and Helpers
// Common testing functions for LightFrame

class TestUtils {
  // DOM Testing Utilities
  static createMockElement(tag = 'div', attrs = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
    
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
    
    return element;
  }

  static simulateEvent(element, eventType, eventData = {}) {
    const event = new Event(eventType, { bubbles: true });
    Object.assign(event, eventData);
    element.dispatchEvent(event);
    return event;
  }

  static waitForElement(selector, timeout = 1000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations) => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  // State Testing Utilities
  static createMockStore(initialState = {}) {
    return MiniState.createStateStore(initialState);
  }

  static createMockComponent(name, props = {}) {
    class MockComponent extends MiniComponent.ComponentBase {
      constructor(componentProps) {
        super(componentProps);
        this.state = { ...props };
        this.name = name;
      }

      render() {
        return MiniFramework.createVirtualNode('div', {
          class: `mock-${name.toLowerCase()}`
        }, [name]);
      }
    }

    return MiniComponent.createComponent(MockComponent, props);
  }

  // Router Testing Utilities
  static createMockRouter(routes = {}) {
    return new (class MockRouter {
      constructor() {
        this.routes = routes;
        this.currentRoute = '/';
        this.subscribers = [];
      }

      navigate(route) {
        this.currentRoute = route;
        this.subscribers.forEach(sub => sub(route));
      }

      subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
          const index = this.subscribers.indexOf(callback);
          if (index > -1) this.subscribers.splice(index, 1);
        };
      }

      getCurrentRoute() {
        return this.currentRoute;
      }
    })();
  }

  // Performance Testing Utilities
  static measurePerformance(testFn, iterations = 1000) {
    const start = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      testFn();
    }
    
    const end = performance.now();
    return {
      totalTime: end - start,
      averageTime: (end - start) / iterations,
      iterations
    };
  }

  // Async Testing Utilities
  static async timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async waitFor(condition, timeout = 5000, interval = 100) {
    const start = Date.now();
    
    while (Date.now() - start < timeout) {
      if (condition()) {
        return true;
      }
      await this.timeout(interval);
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  // LocalStorage Testing Utilities
  static mockLocalStorage() {
    const storage = {};
    
    return {
      getItem: (key) => storage[key] || null,
      setItem: (key, value) => storage[key] = value,
      removeItem: (key) => delete storage[key],
      clear: () => {
        for (const key in storage) {
          delete storage[key];
        }
      },
      get data() {
        return { ...storage };
      }
    };
  }

  // Assertion Utilities
  static assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  static assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  static assertDeepEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  static assertThrows(fn, message) {
    try {
      fn();
      throw new Error(message || 'Expected function to throw');
    } catch (error) {
      if (error.message === message) {
        throw error;
      }
      // Expected error thrown
    }
  }
}

// Export for use in tests
window.TestUtils = TestUtils; 