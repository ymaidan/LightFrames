import { DOM, Store } from '../../src/index.js';

// TodoMVC State Store
const store = new Store({
  todos: [],
  filter: 'all',
  nextId: 1,
  editingId: null
}, 'todoMVC-mini-framework');

// Simple routing
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const filter = hash === '/' ? 'all' : hash.slice(1);
  
  if (['all', 'active', 'completed'].includes(filter)) {
    store.setState({ filter });
  } else {
    window.location.hash = '/';
  }
}

// Setup routing
if (window.MiniEvents) {
  MiniEvents.addEvent(window, 'hashchange', handleRoute);
  MiniEvents.addEvent(window, 'load', handleRoute);
} else {
  window.onhashchange = handleRoute;
  window.onload = handleRoute;
}

// Actions
const actions = {
  addTodo(text) {
    if (!text.trim()) return;
    const state = store.getState();
    store.setState({
      todos: [...state.todos, {
        id: state.nextId,
        text: text.trim(),
        completed: false
      }],
      nextId: state.nextId + 1
    });
  },

  toggleTodo(id) {
    const state = store.getState();
    store.setState({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    });
  },

  deleteTodo(id) {
    const state = store.getState();
    store.setState({
      todos: state.todos.filter(todo => todo.id !== id)
    });
  },

  editTodo(id) {
    store.setState({ editingId: id });
  },

  saveEdit(id, newText) {
    const trimmed = newText.trim();
    if (!trimmed) {
      this.deleteTodo(id);
      return;
    }
    
    const state = store.getState();
    store.setState({
      todos: state.todos.map(todo =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      ),
      editingId: null
    });
  },

  cancelEdit() {
    store.setState({ editingId: null });
  },

  clearCompleted() {
    const state = store.getState();
    store.setState({
      todos: state.todos.filter(todo => !todo.completed)
    });
  },

  setFilter(filter) {
    window.location.hash = filter === 'all' ? '/' : `/${filter}`;
  }
};

// Components
const TodoItem = (todo) => {
  const state = store.getState();
  const isEditing = state.editingId === todo.id;

  return DOM.createElement('li', {
    class: `${todo.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`
  }, [
    DOM.createElement('div', { class: 'view' }, [
      DOM.createElement('input', {
        class: 'toggle',
        type: 'checkbox',
        checked: todo.completed,
        onclick: () => actions.toggleTodo(todo.id)
      }),
      DOM.createElement('label', {
        ondblclick: () => actions.editTodo(todo.id)
      }, [todo.text]),
      DOM.createElement('button', {
        class: 'destroy',
        onclick: () => actions.deleteTodo(todo.id)
      })
    ]),
    ...(isEditing ? [
      DOM.createElement('input', {
        class: 'edit',
        type: 'text',
        value: todo.text,
        onkeydown: (e) => {
          if (e.key === 'Enter') {
            actions.saveEdit(todo.id, e.target.value);
          } else if (e.key === 'Escape') {
            actions.cancelEdit();
          }
        },
        onblur: (e) => actions.saveEdit(todo.id, e.target.value)
      })
    ] : [])
  ]);
};

const FilterLink = (name, label) => {
  const state = store.getState();
  return DOM.createElement('li', {}, [
    DOM.createElement('a', {
      href: `#${name === 'all' ? '/' : '/' + name}`,
      class: state.filter === name ? 'selected' : '',
      onclick: (e) => {
        e.preventDefault();
        actions.setFilter(name);
      }
    }, [label])
  ]);
};

const TodoApp = () => {
  const state = store.getState();
  const filteredTodos = state.todos.filter(todo => {
    switch (state.filter) {
      case 'active': return !todo.completed;
      case 'completed': return todo.completed;
      default: return true;
    }
  });

  const activeCount = state.todos.filter(todo => !todo.completed).length;
  const completedCount = state.todos.length - activeCount;

  return DOM.createElement('div', { class: 'todoapp' }, [
    // Header
    DOM.createElement('header', { class: 'header' }, [
      DOM.createElement('h1', {}, ['todos']),
      DOM.createElement('input', {
        class: 'new-todo',
        placeholder: 'What needs to be done?',
        onkeydown: (e) => {
          if (e.key === 'Enter') {
            actions.addTodo(e.target.value);
            e.target.value = '';
          }
        }
      })
    ]),

    // Main
    ...(state.todos.length > 0 ? [
      DOM.createElement('section', { class: 'main' }, [
        DOM.createElement('ul', { class: 'todo-list' },
          filteredTodos.map(todo => TodoItem(todo))
        )
      ])
    ] : []),

    // Footer
    ...(state.todos.length > 0 ? [
      DOM.createElement('footer', { class: 'footer' }, [
        DOM.createElement('span', { class: 'todo-count' }, [
          DOM.createElement('strong', {}, [activeCount.toString()]),
          ` item${activeCount !== 1 ? 's' : ''} left`
        ]),
        
        DOM.createElement('ul', { class: 'filters' }, [
          FilterLink('all', 'All'),
          FilterLink('active', 'Active'),
          FilterLink('completed', 'Completed')
        ]),
        
        ...(completedCount > 0 ? [
          DOM.createElement('button', {
            class: 'clear-completed',
            onclick: () => actions.clearCompleted()
          }, ['Clear completed'])
        ] : [])
      ])
    ] : [])
  ]);
};

// Render
const render = () => {
  DOM.render(TodoApp(), document.getElementById('app'));
};

// Subscribe and auto-focus edit input
store.subscribe((state) => {
  render();
  if (state.editingId) {
    setTimeout(() => {
      const editInput = document.querySelector('.edit');
      if (editInput) {
        editInput.focus();
        editInput.select();
      }
    }, 0);
  }
});

render();