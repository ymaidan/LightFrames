import { DOM, Store, Router, Events, NotFoundComponent } from '../../src/index.js';

console.log('🚀 TodoMVC Starting with LightFrame...');

// Clear any old localStorage data with different keys
['todoMVC-glassmorphism', 'todoMVC-data'].forEach(key => {
  if (localStorage.getItem(key)) {
    console.log('🧹 Clearing old localStorage key:', key);
    localStorage.removeItem(key);
  }
});

// TodoMVC State Store with localStorage persistence
const store = new Store({
  todos: [],
  filter: 'all',
  nextId: 1,
  routing: { path: '/', params: {} }
}, 'todoMVC-mini-framework');

// Log what was loaded
console.log('📦 Initial state:', store.getState());
console.log('📊 Loaded todos count:', store.getState().todos.length);

// Create 404 component for TodoMVC
const TodoMVC404 = ({ requestedPath }) => {
  console.log(`🔍 TodoMVC 404 for: ${requestedPath}`);
  
  return DOM.createElement('div', { class: 'todoapp' }, [
    DOM.createElement('header', { class: 'header' }, [
      DOM.createElement('h1', {}, ['todos'])
    ]),
    DOM.createElement('div', { class: 'not-found-container' }, [
      DOM.createElement('div', { class: 'not-found-content' }, [
        DOM.createElement('h2', { class: 'error-code' }, ['404']),
        DOM.createElement('h3', { class: 'error-title' }, ['Filter Not Found']),
        DOM.createElement('p', { class: 'error-message' }, [
          `The filter "${requestedPath}" doesn't exist.`
        ]),
        DOM.createElement('div', { class: 'error-actions' }, [
          DOM.createElement('button', {
            class: 'filter-button',
            onclick: () => actions.setFilter('all')
          }, ['← Back to All']),
          DOM.createElement('button', {
            class: 'filter-button', 
            onclick: () => window.location.href = '/'
          }, ['🏠 Home'])
        ])
      ])
    ])
  ]);
};

// TodoMVC Router with 404 handling
const router = new Router({
  '/': 'all',
  '/active': 'active',
  '/completed': 'completed'
}, TodoMVC404); // ✅ Add 404 component

// Sync router with store (only update if different)
router.subscribe((routeInfo) => {
  const currentState = store.getState();
  
  // Handle 404 case
  if (routeInfo && routeInfo.is404) {
    console.log('🔍 404 route detected, rendering 404 component');
    const app = document.getElementById('app');
    if (app) {
      DOM.render(TodoMVC404({ requestedPath: routeInfo.path }), app);
    }
    return;
  }
  
  // Handle normal routes
  const filter = typeof routeInfo === 'string' ? routeInfo : 
                 (routeInfo && routeInfo.component) || 'all';
                 
  if (currentState.filter !== filter) {
    console.log('🔄 Router changed to:', filter);
    store.setState({ filter });
  }
});

// Initialize filter from URL (only if different)
const initialRoute = router.getCurrentRoute();
const initialFilter = typeof initialRoute === 'string' ? initialRoute : 
                     (initialRoute && initialRoute.component) || 'all';
                     
if (store.getState().filter !== initialFilter) {
  console.log('🔄 Setting initial filter to:', initialFilter);
  store.setState({ filter: initialFilter });
}

// TodoMVC Actions
const actions = {
  addTodo(text) {
    if (!text.trim()) return;
    
    const state = store.getState();
    const newTodo = {
      id: state.nextId,
      text: text.trim(),
      completed: false
    };
    
    store.setState({
      todos: [...state.todos, newTodo],
      nextId: state.nextId + 1
    });
    
    console.log('✅ Added todo:', newTodo);
  },

  toggleTodo(id) {
    const state = store.getState();
    const todos = state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    
    store.setState({ todos });
    console.log('🔄 Toggled todo:', id, 'New state:', todos.find(t => t.id === id));
  },

  deleteTodo(id) {
    const state = store.getState();
    const todos = state.todos.filter(todo => todo.id !== id);
    
    store.setState({ todos });
    console.log('🗑️ Deleted todo:', id);
  },

  toggleAll() {
    const state = store.getState();
    const allCompleted = state.todos.length > 0 && state.todos.every(todo => todo.completed);
    const todos = state.todos.map(todo => ({ ...todo, completed: !allCompleted }));
    
    store.setState({ todos });
    console.log('🔄 Toggled all todos, all completed was:', allCompleted);
  },

  clearCompleted() {
    const state = store.getState();
    const todos = state.todos.filter(todo => !todo.completed);
    
    store.setState({ todos });
    console.log('🧹 Cleared completed todos');
    
    // If we're on completed view and cleared everything, go to 'all' view
    if (state.filter === 'completed') {
      console.log('🔄 Switching to "all" view after clearing completed');
      actions.setFilter('all');
    }
  },

  // Clear all data (including localStorage)
  clearAllData() {
    store.setState({
      todos: [],
      filter: 'all',
      nextId: 1
    });
    console.log('🧹 Cleared all data');
  },

  setFilter(filter) {
    const path = filter === 'all' ? '/' : `/${filter}`;
    console.log('🔍 Setting filter to:', filter, 'path:', path);
    router.navigate(path);
  }
};

// TodoMVC Components
const TodoItem = (todo) => {
  return DOM.createElement('li', {
    class: todo.completed ? 'completed' : '',
    key: todo.id,
    'data-todo-id': todo.id
  }, [
    DOM.createElement('div', { class: 'view' }, [
      DOM.createElement('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onclick: (e) => {
          console.log('🔄 Checkbox clicked for todo:', todo.id, 'checked:', e.target.checked);
          actions.toggleTodo(todo.id);
        }
      }),
      DOM.createElement('label', {
        ondblclick: () => {
          console.log('📝 Double-clicked todo:', todo.id);
          // You can add edit functionality here later
        }
      }, [todo.text]),
      DOM.createElement('button', {
        class: 'destroy',
        onclick: (e) => {
          console.log('🗑️ Delete button clicked for todo:', todo.id);
          actions.deleteTodo(todo.id);
        }
      })
    ])
  ]);
};

const TodoList = () => {
  const state = store.getState();
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  console.log('📋 Rendering todo list, filter:', state.filter, 'filtered count:', filteredTodos.length);

  return DOM.createElement('ul', { class: 'todo-list' },
    filteredTodos.map(todo => TodoItem(todo))
  );
};

const TodoHeader = () => {
  return DOM.createElement('header', { class: 'header' }, [
    DOM.createElement('h1', {}, ['todos']),
    DOM.createElement('input', {
      class: 'new-todo',
      placeholder: 'What needs to be done?',
      onkeydown: (e) => {
        if (e.key === 'Enter') {
          const text = e.target.value.trim();
          if (text) {
            console.log('➕ Adding new todo:', text);
            actions.addTodo(text);
            e.target.value = '';
          }
        }
      }
    })
  ]);
};

const TodoFooter = () => {
  const state = store.getState();
  const activeCount = state.todos.filter(todo => !todo.completed).length;
  const completedCount = state.todos.length - activeCount;

  // Always show footer if there are ANY todos in the entire list
  if (state.todos.length === 0) return null;

  return DOM.createElement('footer', { class: 'footer' }, [
    DOM.createElement('span', { class: 'todo-count' }, [
      DOM.createElement('strong', {}, [activeCount.toString()]),
      ` item${activeCount !== 1 ? 's' : ''} left`
    ]),
    
    DOM.createElement('ul', { class: 'filters' }, [
      DOM.createElement('li', {}, [
        DOM.createElement('a', {
          href: '#/',
          class: state.filter === 'all' ? 'selected' : '',
          onclick: (e) => {
            e.preventDefault();
            console.log('🔗 All filter clicked');
            actions.setFilter('all');
          }
        }, ['All'])
      ]),
      DOM.createElement('li', {}, [
        DOM.createElement('a', {
          href: '#/active',
          class: state.filter === 'active' ? 'selected' : '',
          onclick: (e) => {
            e.preventDefault();
            console.log('🔗 Active filter clicked');
            actions.setFilter('active');
          }
        }, ['Active'])
      ]),
      DOM.createElement('li', {}, [
        DOM.createElement('a', {
          href: '#/completed',
          class: state.filter === 'completed' ? 'selected' : '',
          onclick: (e) => {
            e.preventDefault();
            console.log('🔗 Completed filter clicked');
            actions.setFilter('completed');
          }
        }, ['Completed'])
      ])
    ]),
    
    ...(completedCount > 0 ? [
      DOM.createElement('button', {
        class: 'clear-completed',
        onclick: () => {
          console.log('🧹 Clear completed clicked');
          actions.clearCompleted();
        }
      }, ['Clear completed'])
    ] : [])
  ]);
};

const TodoMain = () => {
  const state = store.getState();
  
  return DOM.createElement('section', { class: 'main' }, [
    ...(state.todos.length > 0 ? [
      DOM.createElement('input', {
        id: 'toggle-all',
        class: 'toggle-all',
        type: 'checkbox',
        checked: state.todos.length > 0 && state.todos.every(todo => todo.completed),
        onclick: () => {
          console.log('🔄 Toggle all clicked');
          actions.toggleAll();
        }
      }),
      DOM.createElement('label', { for: 'toggle-all' }, ['Mark all as complete'])
    ] : []),
    TodoList()
  ]);
};

const TodoApp = () => {
  const state = store.getState();
  
  console.log('🎨 Rendering TodoApp with state:', state);
  
  return DOM.createElement('div', { class: 'todoapp' }, [
    TodoHeader(),
    TodoMain(),
    TodoFooter()
  ].filter(Boolean));
};

// Render function
const render = () => {
  console.log('🎯 Rendering app...');
  const app = document.getElementById('app');
  if (app) {
    DOM.render(TodoApp(), app);
  }
};

// Subscribe to state changes for re-rendering
store.subscribe((state) => {
  console.log('🔄 State changed:', state);
  render();
});

// Initial render
render();

console.log('✅ TodoMVC initialized successfully!');