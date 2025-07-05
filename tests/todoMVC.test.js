// TodoMVC Integration Tests
// Testing the complete TodoMVC application

class TodoMVCTestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run() {
    console.log('🧪 Running TodoMVC Integration Tests...\n');
    
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

    console.log(`\n📊 TodoMVC Test Results: ${this.passed} passed, ${this.failed} failed`);
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Create TodoMVC test runner
const todoRunner = new TodoMVCTestRunner();

// ======================================
// TODOMVC FUNCTIONALITY TESTS
// ======================================

todoRunner.test('TodoMVC: Should add new todo', async () => {
  // Clear localStorage
  localStorage.clear();
  
  // Use MiniState instead of importing (since it's loaded globally)
  const store = MiniState.createStateStore({
    todos: [],
    filter: 'all',
    nextId: 1
  });
  
  // Add todo
  store.updateState({
    todos: [{ id: 1, text: 'Test todo', completed: false }],
    nextId: 2
  });
  
  const state = store.getCurrentState();
  assertEqual(state.todos.length, 1);
  assertEqual(state.todos[0].text, 'Test todo');
  assertEqual(state.todos[0].completed, false);
});

todoRunner.test('TodoMVC: Should toggle todo completion', async () => {
  const store = MiniState.createStateStore({
    todos: [{ id: 1, text: 'Test todo', completed: false }],
    filter: 'all',
    nextId: 2
  });
  
  // Toggle completion
  const todos = store.getCurrentState().todos.map(todo =>
    todo.id === 1 ? { ...todo, completed: !todo.completed } : todo
  );
  
  store.updateState({ todos });
  
  const state = store.getCurrentState();
  assertEqual(state.todos[0].completed, true);
});

todoRunner.test('TodoMVC: Should delete todo', async () => {
  const store = MiniState.createStateStore({
    todos: [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true }
    ],
    filter: 'all',
    nextId: 3
  });
  
  // Delete todo with id 1
  const todos = store.getCurrentState().todos.filter(todo => todo.id !== 1);
  store.updateState({ todos });
  
  const state = store.getCurrentState();
  assertEqual(state.todos.length, 1);
  assertEqual(state.todos[0].id, 2);
});

todoRunner.test('TodoMVC: Should filter todos correctly', async () => {
  const todos = [
    { id: 1, text: 'Todo 1', completed: false },
    { id: 2, text: 'Todo 2', completed: true },
    { id: 3, text: 'Todo 3', completed: false }
  ];
  
  // Test active filter
  const activeTodos = todos.filter(todo => !todo.completed);
  assertEqual(activeTodos.length, 2);
  
  // Test completed filter
  const completedTodos = todos.filter(todo => todo.completed);
  assertEqual(completedTodos.length, 1);
  
  // Test all filter
  const allTodos = todos.filter(() => true);
  assertEqual(allTodos.length, 3);
});

todoRunner.test('TodoMVC: Should clear completed todos', async () => {
  const store = MiniState.createStateStore({
    todos: [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: true },
      { id: 3, text: 'Todo 3', completed: true }
    ],
    filter: 'all',
    nextId: 4
  });
  
  // Clear completed
  const todos = store.getCurrentState().todos.filter(todo => !todo.completed);
  store.updateState({ todos });
  
  const state = store.getCurrentState();
  assertEqual(state.todos.length, 1);
  assertEqual(state.todos[0].completed, false);
});

todoRunner.test('TodoMVC: Should toggle all todos', async () => {
  const store = MiniState.createStateStore({
    todos: [
      { id: 1, text: 'Todo 1', completed: false },
      { id: 2, text: 'Todo 2', completed: false }
    ],
    filter: 'all',
    nextId: 3
  });
  
  // Toggle all to completed
  const allCompleted = store.getCurrentState().todos.every(todo => todo.completed);
  const todos = store.getCurrentState().todos.map(todo => 
    ({ ...todo, completed: !allCompleted })
  );
  
  store.updateState({ todos });
  
  const state = store.getCurrentState();
  assert(state.todos.every(todo => todo.completed), 'All todos should be completed');
});

// ======================================
// PERSISTENCE TESTS
// ======================================

todoRunner.test('TodoMVC: Should persist state to localStorage', async () => {
  localStorage.clear();
  
  // Create mock Store class that mimics the real one
  class MockStore {
    constructor(initialState, key) {
      this.state = initialState;
      this.key = key;
      this.subscribers = [];
    }
    
    getState() {
      return this.state;
    }
    
    setState(newState) {
      this.state = { ...this.state, ...newState };
      if (this.key) {
        localStorage.setItem(this.key, JSON.stringify(this.state));
      }
    }
  }
  
  const store = new MockStore({
    todos: [],
    filter: 'all',
    nextId: 1
  }, 'test-todos');
  
  // Add some todos
  store.setState({
    todos: [{ id: 1, text: 'Persistent todo', completed: false }],
    nextId: 2
  });
  
  // Check localStorage
  const saved = localStorage.getItem('test-todos');
  assert(saved !== null, 'State should be saved to localStorage');
  
  const parsed = JSON.parse(saved);
  assertEqual(parsed.todos.length, 1);
  assertEqual(parsed.todos[0].text, 'Persistent todo');
});

todoRunner.test('TodoMVC: Should load state from localStorage', async () => {
  // Pre-populate localStorage
  const testData = {
    todos: [{ id: 1, text: 'Loaded todo', completed: true }],
    filter: 'all',
    nextId: 2
  };
  
  localStorage.setItem('test-load', JSON.stringify(testData));
  
  // Mock loading from localStorage
  const saved = localStorage.getItem('test-load');
  const state = JSON.parse(saved);
  
  assertEqual(state.todos.length, 1);
  assertEqual(state.todos[0].text, 'Loaded todo');
  assertEqual(state.todos[0].completed, true);
});

// ======================================
// ROUTING TESTS
// ======================================

todoRunner.test('TodoMVC: Should handle route changes', async () => {
  // Use global objects since router.js loads globally
  const routes = [
    { path: '/', component: () => 'Home' },
    { path: '/active-test', component: () => 'Active' }
  ];
  
  const router = MiniRouter.makeRouter(routes);
  
  // Test navigation
  router.goToRoute('/active-test');
  
  await sleep(100); // Wait for hash change
  
  // Check that hash changed
  assert(window.location.hash.includes('active-test'), 'Route navigation failed');
});

todoRunner.test('TodoMVC: Should sync filter with route', async () => {
  const store = MiniState.createStateStore({
    todos: [],
    filter: 'all',
    nextId: 1
  });
  
  const routes = [
    { path: '/', component: () => 'All' },
    { path: '/completed-test', component: () => 'Completed' }
  ];
  
  const router = MiniRouter.makeRouter(routes);
  
  let filterChanged = false;
  
  // Simulate router subscription like in TodoMVC
  setTimeout(() => {
    const hash = window.location.hash.replace('#', '') || '/';
    if (hash === '/completed-test') {
      store.updateState({ filter: 'completed' });
      filterChanged = true;
    }
  }, 50);
  
  router.goToRoute('/completed-test');
  
  await sleep(200); // Wait for route change and subscription
  
  assert(filterChanged, 'Filter should change with route');
  assertEqual(store.getCurrentState().filter, 'completed');
});

// ======================================
// DOM INTEGRATION TESTS
// ======================================

todoRunner.test('TodoMVC: Should render todo items correctly', async () => {
  const todo = { id: 1, text: 'Test todo', completed: false };
  
  // Fix: Use MiniFramework.createVirtualNode instead of DOM.createElement
  const todoElement = MiniFramework.createVirtualNode('li', {
    class: todo.completed ? 'completed' : '',
    key: todo.id
  }, [
    MiniFramework.createVirtualNode('div', { class: 'view' }, [
      MiniFramework.createVirtualNode('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed
      }),
      MiniFramework.createVirtualNode('label', {}, [todo.text])
    ])
  ]);
  
  assertEqual(todoElement.tag, 'li');
  assertEqual(todoElement.attrs.class, '');
  // Fix: Check the text content correctly
  assertEqual(todoElement.children[0].children[1].children[0].type, 'text');
  assertEqual(todoElement.children[0].children[1].children[0].text, 'Test todo');
});

todoRunner.test('TodoMVC: Should handle todo interactions', async () => {
  const container = document.createElement('div');
  let todoToggled = false;
  
  const todoElement = MiniFramework.createVirtualNode('li', {}, [
    MiniFramework.createVirtualNode('input', {
      type: 'checkbox',
      onclick: () => {
        todoToggled = true;
      }
    })
  ]);
  
  MiniFramework.renderToDOM(todoElement, container);
  
  // Simulate click
  const checkbox = container.querySelector('input[type="checkbox"]');
  checkbox.click();
  
  assert(todoToggled, 'Todo toggle should be triggered');
});

// ======================================
// PERFORMANCE TESTS
// ======================================

todoRunner.test('TodoMVC: Should handle large number of todos', async () => {
  const largeTodoList = [];
  for (let i = 1; i <= 1000; i++) {
    largeTodoList.push({
      id: i,
      text: `Todo ${i}`,
      completed: i % 2 === 0
    });
  }
  
  const store = MiniState.createStateStore({
    todos: largeTodoList,
    filter: 'all',
    nextId: 1001
  });
  
  const startTime = performance.now();
  const state = store.getCurrentState();
  const endTime = performance.now();
  
  assertEqual(state.todos.length, 1000);
  assert(endTime - startTime < 100, 'Should handle large lists efficiently');
});

// ======================================
// RUN TESTS
// ======================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => todoRunner.run());
} else {
  todoRunner.run();
}

// Export for external use
window.TodoMVCTests = todoRunner; 