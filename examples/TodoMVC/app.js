import { DOM, Store } from '../../src/index.js';

console.log('🚀 TodoMVC Starting with Simple Routing...');

// TodoMVC State Store
const store = new Store({
  todos: [],
  filter: 'all',
  nextId: 1
}, 'todoMVC-mini-framework');

console.log('📦 Initial state:', store.getState());

// Simple hash-based routing for TodoMVC (no Router class needed)
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  let filter;
  
  if (hash === '/') {
    filter = 'all';
  } else if (hash === '/active') {
    filter = 'active';
  } else if (hash === '/completed') {
    filter = 'completed';
  } else {
    // Invalid filter - redirect to all
    window.location.hash = '/';
    return;
  }
  
  // Update filter if different
  const currentState = store.getState();
  if (currentState.filter !== filter) {
    console.log('🔄 Route changed to filter:', filter);
    store.setState({ filter });
  }
}

// Setup simple routing
if (window.MiniEvents) {
  MiniEvents.addEvent(window, 'hashchange', handleRoute);
  MiniEvents.addEvent(window, 'load', handleRoute);
} else {
  window.onhashchange = handleRoute;
  window.onload = handleRoute;
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
    console.log('🔄 Toggled todo:', id);
  },

  deleteTodo(id) {
    const state = store.getState();
    const todos = state.todos.filter(todo => todo.id !== id);
    
    store.setState({ todos });
    console.log('🗑️ Deleted todo:', id);
  },

  clearCompleted() {
    const state = store.getState();
    const todos = state.todos.filter(todo => !todo.completed);
    
    store.setState({ todos });
    console.log('🧹 Cleared completed todos');
  },

  setFilter(filter) {
    const path = filter === 'all' ? '/' : `/${filter}`;
    console.log('🔍 Setting filter to:', filter);
    window.location.hash = path;
  }
};

// TodoMVC Components
const TodoItem = (todo) => {
  return DOM.createElement('li', {
    class: todo.completed ? 'completed' : ''
  }, [
    DOM.createElement('div', { class: 'view' }, [
      DOM.createElement('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onclick: () => actions.toggleTodo(todo.id)
      }),
      DOM.createElement('label', {}, [todo.text]),
      DOM.createElement('button', {
        class: 'destroy',
        onclick: () => actions.deleteTodo(todo.id)
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

  console.log('📋 Rendering todo list, filter:', state.filter, 'count:', filteredTodos.length);

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
            actions.setFilter('completed');
          }
        }, ['Completed'])
      ])
    ]),
    
    ...(completedCount > 0 ? [
      DOM.createElement('button', {
        class: 'clear-completed',
        onclick: () => actions.clearCompleted()
      }, ['Clear completed'])
    ] : [])
  ]);
};

const TodoMain = () => {
  return DOM.createElement('section', { class: 'main' }, [
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

// Subscribe to state changes
store.subscribe((state) => {
  console.log('🔄 State changed:', state);
  render();
});

// Initial render
render();

console.log('✅ TodoMVC initialized successfully!');