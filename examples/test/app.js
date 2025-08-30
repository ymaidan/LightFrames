// 🧪 Mini Framework - Individual Feature Examples
console.log('🧪 Mini Framework Feature Examples Starting...');

// Check if framework is loaded
function initializeApp() {
  if (typeof MiniFramework === 'undefined') {
    console.error('❌ MiniFramework not loaded!');
    return;
  }

  console.log('✅ Framework loaded, initializing examples...');

  // =============================================================================
  // 📝 EXAMPLE 1: DOM ABSTRACTION - Virtual DOM
  // =============================================================================
  
  function createDOMExample() {
    console.log('🎯 Example 1: DOM Abstraction');
    
    // Create virtual DOM elements using your framework
    const virtualButton = MiniFramework.createVirtualNode('button', {
      class: 'example-btn',
      onclick: () => alert('Virtual DOM button clicked!')
    }, ['Click me! (Virtual DOM)']);

    const virtualDiv = MiniFramework.createVirtualNode('div', {
      class: 'dom-example'
    }, [
      MiniFramework.createVirtualNode('h3', {}, ['🎯 DOM Abstraction Example']),
      MiniFramework.createVirtualNode('p', {}, [
        'This demonstrates Virtual DOM. The button below is created using createVirtualNode():'
      ]),
      virtualButton,
      MiniFramework.createVirtualNode('pre', { class: 'code-block' }, [
        `MiniFramework.createVirtualNode('button', {
  class: 'example-btn',
  onclick: () => alert('Clicked!')
}, ['Click me!'])`
      ])
    ]);

    return virtualDiv;
  }

  // =============================================================================
  // 🗃️ EXAMPLE 2: STATE MANAGEMENT - FIXED VERSION
  // =============================================================================
  
  function createStateExample() {
    console.log('🎯 Example 2: State Management');
    
    // Create isolated state for this example only
    let localState = {
      counter: 0,
      message: 'Hello Framework!'
    };

    let stateListeners = [];

    // Simple state management functions
    const stateStore = {
      getCurrentState: () => ({ ...localState }),
      updateState: (newState) => {
        console.log('Updating state from:', localState, 'to:', newState);
        localState = { ...localState, ...newState };
        console.log('New state:', localState);
        
        // Notify listeners
        stateListeners.forEach(callback => {
          try {
            callback(localState);
          } catch (error) {
            console.error('Error in state listener:', error);
          }
        });
      },
      listenToStateChanges: (callback) => {
        stateListeners.push(callback);
        return () => {
          const index = stateListeners.indexOf(callback);
          if (index > -1) stateListeners.splice(index, 1);
        };
      }
    };

    // Actions to modify state
    const stateActions = {
      increment: () => {
        const current = stateStore.getCurrentState();
        console.log('Incrementing from:', current.counter);
        stateStore.updateState({ counter: current.counter + 1 });
      },
      decrement: () => {
        const current = stateStore.getCurrentState();
        console.log('Decrementing from:', current.counter);
        stateStore.updateState({ counter: current.counter - 1 });
      },
      changeMessage: () => {
        const messages = [
          'Hello Framework!',
          'State Updated!',
          'Reactive UI!',
          'Amazing!'
        ];
        const current = stateStore.getCurrentState();
        const nextIndex = (messages.indexOf(current.message) + 1) % messages.length;
        stateStore.updateState({ message: messages[nextIndex] });
      }
    };

    // Component that uses state
    const StateComponent = () => {
      const state = stateStore.getCurrentState();
      
      return MiniFramework.createVirtualNode('div', {
        class: 'state-example'
      }, [
        MiniFramework.createVirtualNode('h3', {}, ['🗃️ State Management Example']),
        MiniFramework.createVirtualNode('p', {}, [
          'This demonstrates reactive state management:'
        ]),
        
        // Counter section
        MiniFramework.createVirtualNode('div', { class: 'counter-section' }, [
          MiniFramework.createVirtualNode('h4', {}, ['Counter: ' + state.counter]),
          MiniFramework.createVirtualNode('button', {
            onclick: stateActions.increment,
            class: 'state-btn'
          }, ['+ Increment']),
          MiniFramework.createVirtualNode('button', {
            onclick: stateActions.decrement,
            class: 'state-btn'
          }, ['- Decrement'])
        ]),
        
        // Message section
        MiniFramework.createVirtualNode('div', { class: 'message-section' }, [
          MiniFramework.createVirtualNode('h4', {}, ['Message: ' + state.message]),
          MiniFramework.createVirtualNode('button', {
            onclick: stateActions.changeMessage,
            class: 'state-btn'
          }, ['Change Message'])
        ]),
        
        MiniFramework.createVirtualNode('pre', { class: 'code-block' }, [
          `const store = { counter: 0, message: 'Hello!' };
store.updateState({ counter: store.counter + 1 });
// UI automatically updates!`
        ])
      ]);
    };

    // Subscribe to state changes for reactive updates
    stateStore.listenToStateChanges(() => {
      console.log('State changed, re-rendering...');
      renderAll();
    });

    return { component: StateComponent, store: stateStore };
  }

  // =============================================================================
  // 🔗 EXAMPLE 3: ROUTING SYSTEM
  // =============================================================================
  
  function createRoutingExample() {
    console.log('🎯 Example 3: Routing System');
    
    // Simple isolated state for routing demo
    let routingState = {
      currentPage: 'home',
      userId: null,
      currentPath: window.location.hash || '#routing-home'
    };

    let routingListeners = [];

    const routingStore = {
      getCurrentState: () => ({ ...routingState }),
      updateState: (newState) => {
        routingState = { ...routingState, ...newState };
        routingListeners.forEach(callback => callback(routingState));
      },
      listenToStateChanges: (callback) => {
        routingListeners.push(callback);
        return () => {
          const index = routingListeners.indexOf(callback);
          if (index > -1) routingListeners.splice(index, 1);
        };
      }
    };

    // Routing actions
    const routingActions = {
      goHome: () => {
        window.location.hash = '#routing-home';
        routingStore.updateState({ 
          currentPage: 'home', 
          userId: null,
          currentPath: '#routing-home'
        });
      },
      goAbout: () => {
        window.location.hash = '#routing-about';
        routingStore.updateState({ 
          currentPage: 'about', 
          userId: null,
          currentPath: '#routing-about'
        });
      },
      goUser: (id) => {
        window.location.hash = `#routing-user/${id}`;
        routingStore.updateState({ 
          currentPage: 'user', 
          userId: id,
          currentPath: `#routing-user/${id}`
        });
      },
      go404: () => {
        window.location.hash = '#nonexistent-route';
        routingStore.updateState({ 
          currentPage: '404', 
          userId: null,
          currentPath: '#nonexistent-route'
        });
      }
    };

    // Listen to hash changes
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash || '#routing-home';
      console.log('📍 Hash changed to:', hash);
      
      if (hash === '#routing-home') {
        routingStore.updateState({ currentPage: 'home', userId: null, currentPath: hash });
      } else if (hash === '#routing-about') {
        routingStore.updateState({ currentPage: 'about', userId: null, currentPath: hash });
      } else if (hash.startsWith('#routing-user/')) {
        const userId = hash.split('/')[1];
        routingStore.updateState({ currentPage: 'user', userId, currentPath: hash });
      } else {
        routingStore.updateState({ currentPage: '404', userId: null, currentPath: hash });
      }
    });

    // Page components
    const HomePage = () => MiniFramework.createVirtualNode('div', {}, [
      MiniFramework.createVirtualNode('h4', {}, ['🏠 Home Page']),
      MiniFramework.createVirtualNode('p', {}, ['Welcome to the routing demo!'])
    ]);

    const AboutPage = () => MiniFramework.createVirtualNode('div', {}, [
      MiniFramework.createVirtualNode('h4', {}, ['ℹ️ About Page']),
      MiniFramework.createVirtualNode('p', {}, ['This page demonstrates routing!'])
    ]);

    const UserPage = () => {
      const state = routingStore.getCurrentState();
      return MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h4', {}, ['👤 User Page']),
        MiniFramework.createVirtualNode('p', {}, [`User ID: ${state.userId}`])
      ]);
    };

    const NotFoundPage = () => MiniFramework.createVirtualNode('div', {}, [
      MiniFramework.createVirtualNode('h4', {}, ['❌ 404 - Not Found']),
      MiniFramework.createVirtualNode('p', {}, ['Page does not exist!'])
    ]);

    // Main routing component
    const RoutingComponent = () => {
      const state = routingStore.getCurrentState();
      
      // Select page component based on current route
      let currentPageComponent;
      switch (state.currentPage) {
        case 'home': currentPageComponent = HomePage(); break;
        case 'about': currentPageComponent = AboutPage(); break;
        case 'user': currentPageComponent = UserPage(); break;
        case '404': currentPageComponent = NotFoundPage(); break;
        default: currentPageComponent = HomePage();
      }

      return MiniFramework.createVirtualNode('div', {
        class: 'routing-example'
      }, [
        MiniFramework.createVirtualNode('h3', {}, ['🔗 Routing System Example']),
        MiniFramework.createVirtualNode('p', {}, [
          'This demonstrates URL-based routing with parameters:'
        ]),
        
        // Navigation buttons
        MiniFramework.createVirtualNode('div', { class: 'routing-nav' }, [
          MiniFramework.createVirtualNode('button', {
            onclick: routingActions.goHome,
            class: 'routing-btn'
          }, ['🏠 Home']),
          MiniFramework.createVirtualNode('button', {
            onclick: routingActions.goAbout,
            class: 'routing-btn'
          }, ['ℹ️ About']),
          MiniFramework.createVirtualNode('button', {
            onclick: () => routingActions.goUser('123'),
            class: 'routing-btn'
          }, ['👤 User 123']),
          MiniFramework.createVirtualNode('button', {
            onclick: () => routingActions.goUser('456'),
            class: 'routing-btn'
          }, ['👤 User 456']),
          MiniFramework.createVirtualNode('button', {
            onclick: routingActions.go404,
            class: 'routing-btn'
          }, ['❌ Test 404'])
        ]),
        
        // Current URL display
        MiniFramework.createVirtualNode('div', { class: 'current-url' }, [
          MiniFramework.createVirtualNode('small', {}, [
            `Current URL: ${state.currentPath}`
          ])
        ]),
        
        // Page content area
        MiniFramework.createVirtualNode('div', { class: 'page-content' }, [
          currentPageComponent
        ]),
        
        MiniFramework.createVirtualNode('pre', { class: 'code-block' }, [
          `// Hash-based routing
window.location.hash = '#user/123';
// Listen for hashchange events`
        ])
      ]);
    };

    // Subscribe to state changes
    routingStore.listenToStateChanges(() => {
      renderAll();
    });

    return { component: RoutingComponent, store: routingStore };
  }

  // =============================================================================
  // ⚡ EXAMPLE 4: EVENT HANDLING
  // =============================================================================
  
  function createEventExample() {
    console.log('🎯 Example 4: Event Handling');
    
    // Isolated state for event demo
    let eventState = {
      clickCount: 0,
      lastEvent: 'None',
      inputValue: '',
      hovering: false
    };

    let eventListeners = [];

    const eventStore = {
      getCurrentState: () => ({ ...eventState }),
      updateState: (newState) => {
        eventState = { ...eventState, ...newState };
        eventListeners.forEach(callback => callback(eventState));
      },
      listenToStateChanges: (callback) => {
        eventListeners.push(callback);
        return () => {
          const index = eventListeners.indexOf(callback);
          if (index > -1) eventListeners.splice(index, 1);
        };
      }
    };

    // Event handlers
    const eventHandlers = {
      handleClick: () => {
        const current = eventStore.getCurrentState();
        eventStore.updateState({
          clickCount: current.clickCount + 1,
          lastEvent: 'Button Clicked'
        });
      },
      
      handleMouseOver: () => {
        eventStore.updateState({
          lastEvent: 'Mouse Over',
          hovering: true
        });
      },
      
      handleMouseOut: () => {
        eventStore.updateState({
          lastEvent: 'Mouse Out',
          hovering: false
        });
      },
      
      handleKeyDown: (e) => {
        eventStore.updateState({
          lastEvent: `Key Pressed: ${e.key}`
        });
      },
      
      handleChange: (e) => {
        eventStore.updateState({
          inputValue: e.target.value,
          lastEvent: 'Input Changed'
        });
      },
      
      handleDoubleClick: () => {
        eventStore.updateState({
          lastEvent: 'Double Clicked!'
        });
      }
    };

    // Event handling component
    const EventComponent = () => {
      const state = eventStore.getCurrentState();
      
      return MiniFramework.createVirtualNode('div', {
        class: 'event-example'
      }, [
        MiniFramework.createVirtualNode('h3', {}, ['⚡ Event Handling Example']),
        MiniFramework.createVirtualNode('p', {}, [
          'This demonstrates custom event handling (not using addEventListener):'
        ]),
        
        // Event status
        MiniFramework.createVirtualNode('div', { class: 'event-status' }, [
          MiniFramework.createVirtualNode('h4', {}, [
            `Last Event: ${state.lastEvent}`
          ]),
          MiniFramework.createVirtualNode('h4', {}, [
            `Click Count: ${state.clickCount}`
          ])
        ]),
        
        // Interactive elements
        MiniFramework.createVirtualNode('div', { class: 'event-controls' }, [
          // Click button
          MiniFramework.createVirtualNode('button', {
            onclick: eventHandlers.handleClick,
            class: 'event-btn'
          }, ['Click Me!']),
          
          // Hover button
          MiniFramework.createVirtualNode('button', {
            onmouseover: eventHandlers.handleMouseOver,
            onmouseout: eventHandlers.handleMouseOut,
            class: `event-btn ${state.hovering ? 'hovering' : ''}`
          }, ['Hover Me!']),
          
          // Double click button
          MiniFramework.createVirtualNode('button', {
            ondblclick: eventHandlers.handleDoubleClick,
            class: 'event-btn'
          }, ['Double Click Me!']),
          
          // Input field
          MiniFramework.createVirtualNode('input', {
            type: 'text',
            placeholder: 'Type something...',
            onkeydown: eventHandlers.handleKeyDown,
            onchange: eventHandlers.handleChange,
            class: 'event-input'
          }),
          
          // Display input value
          MiniFramework.createVirtualNode('div', {}, [
            `Input Value: "${state.inputValue}"`
          ])
        ]),
        
        MiniFramework.createVirtualNode('pre', { class: 'code-block' }, [
          `// Custom event handling (no addEventListener)
MiniFramework.createVirtualNode('button', {
  onclick: () => console.log('Clicked!'),
  onmouseover: () => console.log('Hover!')
}, ['Interactive Button'])`
        ])
      ]);
    };

    // Subscribe to state changes
    eventStore.listenToStateChanges(() => {
      renderAll();
    });

    return { component: EventComponent, store: eventStore };
  }

  // =============================================================================
  // 🎨 MAIN APP - Combines All Examples
  // =============================================================================
  
  // Global state for example selection (using isolated state)
  let appState = {
    activeExample: 'all'
  };

  let appListeners = [];

  const appStore = {
    getCurrentState: () => ({ ...appState }),
    updateState: (newState) => {
      appState = { ...appState, ...newState };
      appListeners.forEach(callback => callback(appState));
    },
    listenToStateChanges: (callback) => {
      appListeners.push(callback);
      return () => {
        const index = appListeners.indexOf(callback);
        if (index > -1) appListeners.splice(index, 1);
      };
    }
  };

  // Create all examples
  const domExample = createDOMExample();
  const stateExample = createStateExample();
  const routingExample = createRoutingExample();
  const eventExample = createEventExample();

  // Example selection actions
  const appActions = {
    showExample: (exampleName) => {
      appStore.updateState({ activeExample: exampleName });
    }
  };

  // Main navigation
  const Navigation = () => {
    const state = appStore.getCurrentState();
    
    return MiniFramework.createVirtualNode('nav', { class: 'main-nav' }, [
      MiniFramework.createVirtualNode('h1', {}, ['🧪 Mini Framework Examples']),
      MiniFramework.createVirtualNode('div', { class: 'nav-buttons' }, [
        MiniFramework.createVirtualNode('button', {
          class: `nav-btn ${state.activeExample === 'all' ? 'active' : ''}`,
          onclick: () => appActions.showExample('all')
        }, ['📋 All Examples']),
        MiniFramework.createVirtualNode('button', {
          class: `nav-btn ${state.activeExample === 'dom' ? 'active' : ''}`,
          onclick: () => appActions.showExample('dom')
        }, ['🎯 DOM Abstraction']),
        MiniFramework.createVirtualNode('button', {
          class: `nav-btn ${state.activeExample === 'state' ? 'active' : ''}`,
          onclick: () => appActions.showExample('state')
        }, ['🗃️ State Management']),
        MiniFramework.createVirtualNode('button', {
          class: `nav-btn ${state.activeExample === 'routing' ? 'active' : ''}`,
          onclick: () => appActions.showExample('routing')
        }, ['🔗 Routing System']),
        MiniFramework.createVirtualNode('button', {
          class: `nav-btn ${state.activeExample === 'events' ? 'active' : ''}`,
          onclick: () => appActions.showExample('events')
        }, ['⚡ Event Handling'])
      ])
    ]);
  };

  // Content area
  const Content = () => {
    const state = appStore.getCurrentState();
    const examples = [];

    if (state.activeExample === 'all' || state.activeExample === 'dom') {
      examples.push(domExample);
    }
    if (state.activeExample === 'all' || state.activeExample === 'state') {
      examples.push(stateExample.component());
    }
    if (state.activeExample === 'all' || state.activeExample === 'routing') {
      examples.push(routingExample.component());
    }
    if (state.activeExample === 'all' || state.activeExample === 'events') {
      examples.push(eventExample.component());
    }

    return MiniFramework.createVirtualNode('main', { class: 'content' }, examples);
  };

  // Main App
  const App = () => {
    return MiniFramework.createVirtualNode('div', { class: 'examples-app' }, [
      Navigation(),
      Content()
    ]);
  };

  // Main render function
  const renderAll = () => {
    const app = document.getElementById('app');
    MiniFramework.renderToDOM(App(), app);
  };

  // Subscribe to app state changes
  appStore.listenToStateChanges(() => {
    renderAll();
  });

  // Initial render
  renderAll();

  // Expose for debugging
  window.ExamplesFramework = {
    appStore,
    appActions,
    examples: {
      dom: domExample,
      state: stateExample,
      routing: routingExample,
      events: eventExample
    }
  };

  console.log('✅ All examples loaded successfully!');
  console.log('🔧 Try: ExamplesFramework.appActions.showExample("state")');
  console.log('🔧 Try: ExamplesFramework.examples.state.store.updateState({counter: 100})');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}