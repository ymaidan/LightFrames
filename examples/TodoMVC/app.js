import { DOM, Store, Router } from '../../src/index.js';

console.log('🚀 TodoMVC Starting with Glassmorphism Design...');

// TodoMVC State Store
const store = new Store({
    todos: [],
  filter: 'all',
  nextId: 1
});

// TodoMVC Router
const router = new Router({
  '/': 'all',
  '/active': 'active',
  '/completed': 'completed'
});

// Sync router with store
router.subscribe((filter) => {
  console.log('🔄 Router changed to:', filter);
  store.setState({ filter });
});

// Initialize filter from URL
store.setState({ filter: router.getCurrentRoute() });

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
  // (not just the filtered view)
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
    
    completedCount > 0 ? DOM.createElement('button', {
      class: 'clear-completed',
      onclick: () => {
        console.log('🧹 Clear completed clicked');
        actions.clearCompleted();
      }
    }, ['Clear completed']) : null
  ].filter(Boolean));
};

const TodoMain = () => {
  const state = store.getState();
  const allCompleted = state.todos.length > 0 && state.todos.every(todo => todo.completed);

  // Show the main section even when filtering shows no results
  return DOM.createElement('section', { class: 'main' }, [
    state.todos.length > 0 ? DOM.createElement('input', {
      id: 'toggle-all',
      class: 'toggle-all',
      type: 'checkbox',
      checked: allCompleted,
      onclick: () => {
        console.log('🔄 Toggle all clicked, current all completed:', allCompleted);
        actions.toggleAll();
      }
    }) : null,
    state.todos.length > 0 ? DOM.createElement('label', { for: 'toggle-all' }, ['Mark all as complete']) : null,
    TodoList()
  ].filter(Boolean));
};

const TodoApp = () => {
  const state = store.getState();
  console.log('🎨 Rendering TodoApp with state:', state);
  
  return DOM.createElement('div', { 
    class: 'todoapp',
    'data-empty': state.todos.length === 0 ? 'true' : 'false'
  }, [
    TodoHeader(),
    TodoMain(),
    TodoFooter()
  ].filter(Boolean));
};

// Initialize App
const render = () => {
  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ App container not found!');
    return;
  }
  
  console.log('🎯 Rendering app...');
  DOM.render(TodoApp(), app);
};

// Subscribe to state changes
store.subscribe(() => {
  console.log('🔄 State changed:', store.getState());
  render();
});

// Initial render
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 DOM loaded, rendering Glassmorphism TodoMVC...');
  render();
});

console.log('✅ Glassmorphism TodoMVC loaded successfully!');