// LightFrame Framework Unit Tests
// Testing all core framework functionality

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running LightFrame Framework Tests...\n');
    
    for (const { name, fn } of this.tests) {
      try {
        await fn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.error(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
    return this.failed === 0;
  }
}

// Test utilities
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertNotEqual(actual, expected, message) {
  if (actual === expected) {
    throw new Error(message || `Expected not ${expected}, got ${actual}`);
  }
}

// Create test runner
const runner = new TestRunner();

// ======================================
// CORE FRAMEWORK TESTS
// ======================================

runner.test('Core: MiniFramework should be defined', () => {
  assert(typeof MiniFramework !== 'undefined', 'MiniFramework not loaded');
  assert(typeof MiniFramework.createVirtualNode === 'function', 'createVirtualNode missing');
  assert(typeof MiniFramework.renderToDOM === 'function', 'renderToDOM missing');
});

runner.test('Core: Virtual Node Creation', () => {
  const vnode = MiniFramework.createVirtualNode('div', { class: 'test' }, ['Hello']);
  
  assertEqual(vnode.tag, 'div');
  assertEqual(vnode.attrs.class, 'test');
  assertEqual(vnode.children[0].type, 'text');
  assertEqual(vnode.children[0].text, 'Hello');
});

runner.test('Core: Virtual Node with Multiple Children', () => {
  const vnode = MiniFramework.createVirtualNode('div', {}, [
    MiniFramework.createVirtualNode('span', {}, ['Child 1']),
    MiniFramework.createVirtualNode('span', {}, ['Child 2'])
  ]);
  
  assertEqual(vnode.children.length, 2);
  assertEqual(vnode.children[0].tag, 'span');
  assertEqual(vnode.children[1].children[0].type, 'text');
  assertEqual(vnode.children[1].children[0].text, 'Child 2');
});

runner.test('Core: DOM Rendering', () => {
  const container = document.createElement('div');
  const vnode = MiniFramework.createVirtualNode('p', { id: 'test' }, ['Test Content']);
  
  MiniFramework.renderToDOM(vnode, container);
  
  assertEqual(container.children.length, 1);
  assertEqual(container.children[0].tagName, 'P');
  assertEqual(container.children[0].id, 'test');
  assertEqual(container.children[0].textContent, 'Test Content');
});

// ======================================
// STATE MANAGEMENT TESTS
// ======================================

runner.test('State: MiniState should be defined', () => {
  assert(typeof MiniState !== 'undefined', 'MiniState not loaded');
  assert(typeof MiniState.createStateStore === 'function', 'createStateStore missing');
});

runner.test('State: Store Creation and Initial State', () => {
  const store = MiniState.createStateStore({ count: 0, name: 'test' });
  const state = store.getCurrentState();
  
  assertEqual(state.count, 0);
  assertEqual(state.name, 'test');
});

runner.test('State: Store Updates', () => {
  const store = MiniState.createStateStore({ count: 0 });
  
  store.updateState({ count: 5 });
  const state = store.getCurrentState();
  
  assertEqual(state.count, 5);
});

runner.test('State: Store Listeners', () => {
  const store = MiniState.createStateStore({ count: 0 });
  let listenerCalled = false;
  let receivedState = null;
  
  store.listenToStateChanges((state) => {
    listenerCalled = true;
    receivedState = state;
  });
  
  store.updateState({ count: 10 });
  
  assert(listenerCalled, 'State change listener not called');
  assertEqual(receivedState.count, 10);
});

runner.test('State: Store Actions', () => {
  const store = MiniState.createStateStore({ items: [] });
  
  store.sendAction({
    type: 'SET',
    payload: { items: ['item1', 'item2'] }
  });
  
  const state = store.getCurrentState();
  assertEqual(state.items.length, 2);
  assertEqual(state.items[0], 'item1');
});

// ======================================
// EVENT HANDLING TESTS
// ======================================

runner.test('Events: MiniEvents should be defined', () => {
  assert(typeof MiniEvents !== 'undefined', 'MiniEvents not loaded');
  assert(typeof MiniEvents.addEvent === 'function', 'addEvent missing');
  assert(typeof MiniEvents.removeEvent === 'function', 'removeEvent missing');
});

runner.test('Events: Add and Trigger Event', () => {
  const button = document.createElement('button');
  let eventTriggered = false;
  
  MiniEvents.addEvent(button, 'click', () => {
    eventTriggered = true;
  });
  
  // Simulate click
  button.click();
  
  assert(eventTriggered, 'Event handler not triggered');
});

runner.test('Events: Remove Event', () => {
  const button = document.createElement('button');
  let eventTriggered = false;
  
  const handler = () => {
    eventTriggered = true;
  };
  
  MiniEvents.addEvent(button, 'click', handler);
  MiniEvents.removeEvent(button, 'click', handler);
  
  // Simulate click
  button.click();
  
  assert(!eventTriggered, 'Event handler should have been removed');
});

runner.test('Events: Multiple Events', () => {
  const button = document.createElement('button');
  let clickCount = 0;
  let hoverCount = 0;
  
  MiniEvents.addMultipleEvents(button, {
    click: () => clickCount++,
    mouseover: () => hoverCount++
  });
  
  // Simulate events
  button.click();
  button.dispatchEvent(new Event('mouseover'));
  
  assertEqual(clickCount, 1);
  assertEqual(hoverCount, 1);
});

// ======================================
// COMPONENT SYSTEM TESTS
// ======================================

runner.test('Components: MiniComponent should be defined', () => {
  assert(typeof MiniComponent !== 'undefined', 'MiniComponent not loaded');
  assert(typeof MiniComponent.ComponentBase === 'function', 'ComponentBase missing');
});

runner.test('Components: Component Creation', () => {
  class TestComponent extends MiniComponent.ComponentBase {
    constructor(props) {
      super(props);
      this.state = { value: props.initialValue || 0 };
    }
    
    render() {
      return MiniFramework.createVirtualNode('div', {}, [String(this.state.value)]);
    }
  }
  
  const component = MiniComponent.createComponent(TestComponent, { initialValue: 5 });
  assert(component !== null, 'Component creation failed');
});

runner.test('Components: Component State Updates', () => {
  class TestComponent extends MiniComponent.ComponentBase {
    constructor(props) {
      super(props);
      this.state = { count: 0 };
    }
    
    increment() {
      this.setState({ count: this.state.count + 1 });
    }
    
    render() {
      return MiniFramework.createVirtualNode('div', {}, [String(this.state.count)]);
    }
  }
  
  const component = MiniComponent.createComponent(TestComponent);
  
  assertEqual(component.state.count, 0);
  component.increment();
  assertEqual(component.state.count, 1);
});

// ======================================
// ROUTING TESTS
// ======================================

runner.test('Routing: MiniRouter should be defined', () => {
  assert(typeof MiniRouter !== 'undefined', 'MiniRouter not loaded');
  assert(typeof MiniRouter.makeRouter === 'function', 'makeRouter missing');
});

runner.test('Routing: Router Creation', () => {
  const routes = [
    { path: '/', component: () => 'Home' },
    { path: '/about', component: () => 'About' }
  ];
  
  const router = MiniRouter.makeRouter(routes);
  assert(router !== null, 'Router creation failed');
  assert(typeof router.goToRoute === 'function', 'goToRoute missing');
});

runner.test('Routing: Route Navigation', () => {
  const routes = [
    { path: '/', component: () => 'Home' },
    { path: '/test-unique', component: () => 'Test Page' }
  ];
  
  const router = MiniRouter.makeRouter(routes);
  
  // Test navigation (this will change the hash)
  router.goToRoute('/test-unique');
  
  // Check that hash changed
  assert(window.location.hash.includes('test-unique'), 'Route navigation failed');
});

// ======================================
// INTEGRATION TESTS
// ======================================

runner.test('Integration: Framework Components Work Together', () => {
  // Create state store
  const store = MiniState.createStateStore({ message: 'Hello' });
  
  // Create component that uses state
  let renderCount = 0;
  const renderApp = (state) => {
    renderCount++;
    return MiniFramework.createVirtualNode('div', {}, [state.message]);
  };
  
  // Create container
  const container = document.createElement('div');
  
  // Create auto-rendering component
  const app = MiniState.createAutoRenderingComponent(renderApp, container);
  
  // Check initial render
  assertEqual(renderCount, 1);
  assertEqual(container.textContent, 'Hello');
  
  // Update state
  store.updateState({ message: 'Updated' });
  
  // Check re-render
  assertEqual(renderCount, 2);
  assertEqual(container.textContent, 'Updated');
});

runner.test('Integration: Event Handling with State Updates', () => {
  const store = MiniState.createStateStore({ clicked: false });
  let stateUpdated = false;
  
  store.listenToStateChanges((state) => {
    if (state.clicked) {
      stateUpdated = true;
    }
  });
  
  const button = document.createElement('button');
  
  MiniEvents.addEvent(button, 'click', () => {
    store.updateState({ clicked: true });
  });
  
  button.click();
  
  assert(stateUpdated, 'State should update on event');
});

// ======================================
// RUN TESTS
// ======================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => runner.run());
} else {
  runner.run();
}

// Export for external use
window.FrameworkTests = runner; 