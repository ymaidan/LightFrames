// Enhanced Counter Example - No index.js, No getElementById
// Uses direct framework APIs and enhanced mounting

console.log('🚀 Enhanced Counter Starting...');

// Create state store using MiniState directly (no imports)
const store = {
  state: { count: 0, theme: 'light' },
  subscribers: [],
  
  getState() {
    return { ...this.state };
  },
  
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
    this.saveToStorage();
  },
  
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) this.subscribers.splice(index, 1);
    };
  },
  
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.getState());
      } catch (error) {
        console.error('Error in subscriber:', error);
      }
    });
  },
  
  saveToStorage() {
    try {
      localStorage.setItem('enhanced-counter', JSON.stringify(this.state));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  },
  
  loadFromStorage() {
    try {
      const data = localStorage.getItem('enhanced-counter');
      if (data) {
        this.state = { ...this.state, ...JSON.parse(data) };
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
  }
};

// Load saved state
store.loadFromStorage();

// Enhanced Counter Component using framework APIs directly
const EnhancedCounter = () => {
  const state = store.getState();
  
  // Use EnhancedDOM helper methods for cleaner code
  return EnhancedDOM.div({ class: 'enhanced-counter-container' }, [
    // Header
    EnhancedDOM.div({ class: 'counter-header' }, [
      EnhancedDOM.createElement('h2', { class: 'counter-title' }, ['Enhanced Counter']),
      EnhancedDOM.span({ class: 'counter-subtitle' }, ['Framework API Demo'])
    ]),
    
    // Controls Row
    EnhancedDOM.div({ class: 'counter-controls' }, [
      // Decrement Button
      EnhancedDOM.button({
        class: 'counter-btn decrement-btn',
        onclick: () => {
          console.log('🔽 Decrement clicked');
          store.setState({ count: state.count - 1 });
        }
      }, ['−']),
      
      // Count Display
      EnhancedDOM.div({ class: 'counter-display' }, [
        EnhancedDOM.span({ class: 'counter-label' }, ['Count:']),
        EnhancedDOM.span({ 
          class: `counter-value ${state.count >= 0 ? 'positive' : 'negative'}` 
        }, [String(state.count)])
      ]),
      
      // Increment Button
      EnhancedDOM.button({
        class: 'counter-btn increment-btn',
        onclick: () => {
          console.log('🔼 Increment clicked');
          store.setState({ count: state.count + 1 });
        }
      }, ['+'])
    ]),
    
    // Action Buttons Row
    EnhancedDOM.div({ class: 'action-buttons' }, [
      EnhancedDOM.button({
        class: 'action-btn reset-btn',
        onclick: () => {
          console.log('🔄 Reset clicked');
          store.setState({ count: 0 });
        }
      }, ['Reset']),
      
      EnhancedDOM.button({
        class: 'action-btn random-btn',
        onclick: () => {
          const randomCount = Math.floor(Math.random() * 100) - 50;
          console.log(`🎲 Random: ${randomCount}`);
          store.setState({ count: randomCount });
        }
      }, ['Random']),
      
      EnhancedDOM.button({
        class: `action-btn theme-btn ${state.theme}`,
        onclick: () => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          console.log(`🎨 Theme: ${newTheme}`);
          store.setState({ theme: newTheme });
          document.body.className = `theme-${newTheme}`;
        }
      }, [state.theme === 'light' ? '🌙 Dark' : '☀️ Light'])
    ]),
    
    // Info Panel
    EnhancedDOM.div({ class: 'info-panel' }, [
      EnhancedDOM.createElement('h4', {}, ['Framework Features Used:']),
      EnhancedDOM.createElement('ul', { class: 'feature-list' }, [
        EnhancedDOM.createElement('li', {}, ['✅ Enhanced DOM API']),
        EnhancedDOM.createElement('li', {}, ['✅ Direct Framework Mounting']),
        EnhancedDOM.createElement('li', {}, ['✅ Custom Event Handling']),
        EnhancedDOM.createElement('li', {}, ['✅ State Management']),
        EnhancedDOM.createElement('li', {}, ['✅ No getElementById Used']),
        EnhancedDOM.createElement('li', {}, ['✅ Auto Re-rendering'])
      ])
    ])
  ]);
};

// Demo: Framework App Creation without index.js
const createFrameworkApp = (config) => {
  const { component, store, container } = config;
  
  return {
    component,
    store,
    container,
    
    mount() {
      console.log('🏗️ Mounting app with enhanced framework...');
      
      // Use EnhancedDOM.mount instead of getElementById
      const mountedContainer = EnhancedDOM.mount(component, container, store);
      
      console.log('✅ App mounted successfully!');
      return mountedContainer;
    },
    
    unmount() {
      const containerElement = typeof container === 'string' ? 
        document.querySelector(container) : container;
      if (containerElement) {
        containerElement.innerHTML = '';
        console.log('🧹 App unmounted');
      }
    }
  };
};

// Create and mount the enhanced app
const app = createFrameworkApp({
  component: EnhancedCounter,
  store: store,
  container: '#app'  // No getElementById - framework handles it
});

// Apply initial theme
document.body.className = `theme-${store.getState().theme}`;

// Mount the application
app.mount();

// Demo: Advanced features
console.group('🔧 Enhanced Framework Features');
console.log('📦 Store:', store);
console.log('🏗️ App:', app);
console.log('🎯 Component:', EnhancedCounter);
console.log('🔗 Mount Container:', app.container);
console.groupEnd();

// Demo: Reactive state logging
store.subscribe((state) => {
  console.log('🔄 State Update:', state);
});

console.log('✅ Enhanced Counter loaded successfully!');

// Export for debugging (optional)
if (typeof window !== 'undefined') {
  window.EnhancedCounterApp = {
    app,
    store,
    component: EnhancedCounter
  };
}