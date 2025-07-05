# 💡 Mini Framework Examples

Comprehensive examples showing how to use every feature of the Mini Framework.

## 📋 Table of Contents

- [Basic Examples](#basic-examples)
- [Advanced Examples](#advanced-examples)
- [Real-World Applications](#real-world-applications)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)

## 🎯 Basic Examples

### **1. Creating Elements**

**Simple Element:**

```javascript
// Create a simple heading
const heading = DOM.createElement("h1", {}, ["Hello World"]);

// Render to DOM
DOM.render(heading, document.getElementById("app"));
```

**Element with Attributes:**

```javascript
// Create element with multiple attributes
const input = DOM.createElement("input", {
  type: "text",
  placeholder: "Enter your name...",
  class: "form-input",
  id: "username",
  required: true,
});
```

**Why it works this way:**

- The framework uses a virtual DOM representation
- Elements are JavaScript objects, not real DOM nodes
- This allows efficient batching and diffing

### **2. Adding Events**

**Simple Event Handler:**

```javascript
const button = DOM.createElement(
  "button",
  {
    onclick: () => {
      alert("Button clicked!");
    },
  },
  ["Click Me"]
);
```

**Event with Access to Event Object:**

```javascript
const input = DOM.createElement("input", {
  onkeydown: (event) => {
    console.log("Key pressed:", event.key);
    if (event.key === "Enter") {
      console.log("Enter key pressed!");
    }
  },
  onchange: (event) => {
    console.log("Input value:", event.target.value);
  },
});
```

**Why it works this way:**

- Framework uses custom event system (not addEventListener)
- Better performance and consistent behavior
- Events are automatically bound to the element

### **3. Nesting Elements**

**Simple Nesting:**

```javascript
const card = DOM.createElement("div", { class: "card" }, [
  DOM.createElement("h2", {}, ["Card Title"]),
  DOM.createElement("p", {}, ["Card description text."]),
  DOM.createElement(
    "button",
    {
      onclick: () => console.log("Action clicked"),
    },
    ["Action"]
  ),
]);
```

**Deep Nesting:**

```javascript
const navigation = DOM.createElement("nav", { class: "navbar" }, [
  DOM.createElement("div", { class: "nav-brand" }, [
    DOM.createElement("img", { src: "logo.png", alt: "Logo" }),
    DOM.createElement("span", {}, ["My App"]),
  ]),
  DOM.createElement("ul", { class: "nav-links" }, [
    DOM.createElement("li", {}, [
      DOM.createElement("a", { href: "#home" }, ["Home"]),
    ]),
    DOM.createElement("li", {}, [
      DOM.createElement("a", { href: "#about" }, ["About"]),
    ]),
    DOM.createElement("li", {}, [
      DOM.createElement("a", { href: "#contact" }, ["Contact"]),
    ]),
  ]),
]);
```

**Why it works this way:**

- Children are passed as an array
- Each child can be a string (text) or another element
- Creates a tree structure that mirrors HTML

### **4. Adding Attributes**

**HTML Attributes:**

```javascript
const image = DOM.createElement("img", {
  src: "photo.jpg",
  alt: "A beautiful photo",
  width: "300",
  height: "200",
  class: "responsive-image",
  id: "main-photo",
});
```

**Form Attributes:**

```javascript
const form = DOM.createElement(
  "form",
  {
    method: "POST",
    action: "/submit",
    class: "user-form",
  },
  [
    DOM.createElement("input", {
      type: "email",
      name: "email",
      placeholder: "your@email.com",
      required: true,
      autocomplete: "email",
    }),
    DOM.createElement("input", {
      type: "password",
      name: "password",
      placeholder: "Password",
      required: true,
      minlength: "8",
    }),
  ]
);
```

**Data Attributes:**

```javascript
const element = DOM.createElement(
  "div",
  {
    "data-user-id": "123",
    "data-role": "admin",
    "data-theme": "dark",
  },
  ["User Profile"]
);
```

**Why it works this way:**

- Attributes are passed as an object
- Framework automatically sets HTML attributes
- Special handling for event attributes (onclick, etc.)

## 🚀 Advanced Examples

### **5. State Management**

**Basic State:**

```javascript
// Create store
const store = new Store({
  count: 0,
  message: "Hello World",
});

// Update state
function increment() {
  const current = store.getState();
  store.setState({ count: current.count + 1 });
}

// Subscribe to changes
store.subscribe((state) => {
  console.log("Count is now:", state.count);
});
```

**Complex State with Persistence:**

```javascript
// Store with localStorage persistence
const userStore = new Store(
  {
    user: {
      name: "",
      email: "",
      preferences: {
        theme: "light",
        notifications: true,
      },
    },
    session: {
      isLoggedIn: false,
      token: null,
    },
  },
  "user-app-data"
);

// Update nested state
function updateUserPreferences(newPrefs) {
  const current = userStore.getState();
  userStore.setState({
    user: {
      ...current.user,
      preferences: {
        ...current.user.preferences,
        ...newPrefs,
      },
    },
  });
}
```

### **6. Routing System**

**Basic Routing:**

```javascript
// Define routes
const router = new Router({
  "/": "home",
  "/about": "about",
  "/contact": "contact",
  "/user/:id": "user-profile",
});

// Handle route changes
router.subscribe((route, params) => {
  switch (route) {
    case "home":
      renderHomePage();
      break;
    case "about":
      renderAboutPage();
      break;
    case "contact":
      renderContactPage();
      break;
    case "user-profile":
      renderUserProfile(params.id);
      break;
  }
});

// Navigate programmatically
function goToAbout() {
  router.navigate("/about");
}
```

**Route-based Navigation:**

```javascript
// Create navigation component
function createNavigation(currentRoute) {
  return DOM.createElement("nav", {}, [
    DOM.createElement(
      "a",
      {
        href: "#/",
        class: currentRoute === "home" ? "active" : "",
        onclick: (e) => {
          e.preventDefault();
          router.navigate("/");
        },
      },
      ["Home"]
    ),
    DOM.createElement(
      "a",
      {
        href: "#/about",
        class: currentRoute === "about" ? "active" : "",
        onclick: (e) => {
          e.preventDefault();
          router.navigate("/about");
        },
      },
      ["About"]
    ),
  ]);
}
```

### **7. Component System**

**Simple Component:**

```javascript
class WelcomeMessage extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = {
      showMessage: true,
    };
  }

  render() {
    return DOM.createElement("div", { class: "welcome-component" }, [
      DOM.createElement("h2", {}, [`Welcome, ${this.props.name}!`]),
      this.state.showMessage
        ? DOM.createElement("p", {}, ["Nice to see you here!"])
        : null,
      DOM.createElement(
        "button",
        {
          onclick: () =>
            this.setState({
              showMessage: !this.state.showMessage,
            }),
        },
        [this.state.showMessage ? "Hide" : "Show"]
      ),
    ]);
  }

  onMount() {
    console.log(`Welcome component mounted for ${this.props.name}`);
  }
}
```

**Interactive Component:**

```javascript
class TodoItem extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = {
      isEditing: false,
      editText: this.props.todo.text
    };
  }

  render() {
    const { todo } = this.props;
    const { isEditing, editText } = this.state;

    return DOM.createElement('li', {
      class: `todo-item ${todo.completed ? 'completed' : ''
    }, [
      !isEditing ?
        // View mode
        DOM.createElement('div', { class: 'todo-view' }, [
          DOM.createElement('input', {
            type: 'checkbox',
            checked: todo.completed,
            onchange: () => this.props.onToggle(todo.id)
          }),
          DOM.createElement('label', {
            ondblclick: () => this.setState({ isEditing: true })
          }, [todo.text]),
          DOM.createElement('button', {
            onclick: () => this.props.onDelete(todo.id)
          }, ['Delete'])
        ]) :
        // Edit mode
        DOM.createElement('div', { class: 'todo-edit' }, [
          DOM.createElement('input', {
            type: 'text',
            value: editText,
            onchange: (e) => this.setState({ editText: e.target.value }),
            onkeydown: (e) => {
              if (e.key === 'Enter') {
                this.props.onUpdate(todo.id, editText);
                this.setState({ isEditing: false });
              }
              if (e.key === 'Escape') {
                this.setState({
                  isEditing: false,
                  editText: todo.text
                });
              }
            }
          })
        ])
    ]);
  }
}
```

## 🌟 Real-World Applications

### **8. Todo Application**

**Complete Todo App:**

```javascript
class TodoApp extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = {
      todos: [],
      newTodoText: "",
      filter: "all",
    };
  }

  addTodo() {
    if (this.state.newTodoText.trim()) {
      const newTodo = {
        id: Date.now(),
        text: this.state.newTodoText.trim(),
        completed: false,
      };

      this.setState({
        todos: [...this.state.todos, newTodo],
        newTodoText: "",
      });
    }
  }

  toggleTodo(id) {
    this.setState({
      todos: this.state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    });
  }

  deleteTodo(id) {
    this.setState({
      todos: this.state.todos.filter((todo) => todo.id !== id),
    });
  }

  getFilteredTodos() {
    switch (this.state.filter) {
      case "active":
        return this.state.todos.filter((todo) => !todo.completed);
      case "completed":
        return this.state.todos.filter((todo) => todo.completed);
      default:
        return this.state.todos;
    }
  }

  render() {
    const filteredTodos = this.getFilteredTodos();

    return DOM.createElement("div", { class: "todo-app" }, [
      // Header
      DOM.createElement("header", {}, [
        DOM.createElement("h1", {}, ["Todo App"]),
        DOM.createElement("input", {
          type: "text",
          placeholder: "Add a new todo...",
          value: this.state.newTodoText,
          onchange: (e) => this.setState({ newTodoText: e.target.value }),
          onkeydown: (e) => {
            if (e.key === "Enter") {
              this.addTodo();
            }
          },
        }),
      ]),

      // Todo List
      DOM.createElement("main", {}, [
        DOM.createElement(
          "ul",
          { class: "todo-list" },
          filteredTodos.map((todo) =>
            DOM.createElement("li", { key: todo.id }, [
              DOM.createElement("input", {
                type: "checkbox",
                checked: todo.completed,
                onchange: () => this.toggleTodo(todo.id),
              }),
              DOM.createElement(
                "span",
                {
                  class: todo.completed ? "completed" : "",
                },
                [todo.text]
              ),
              DOM.createElement(
                "button",
                {
                  onclick: () => this.deleteTodo(todo.id),
                },
                ["Delete"]
              ),
            ])
          )
        ),
      ]),

      // Footer
      DOM.createElement("footer", {}, [
        DOM.createElement("span", {}, [
          `${this.state.todos.filter((t) => !t.completed).length} items left`,
        ]),
        DOM.createElement("div", { class: "filters" }, [
          DOM.createElement(
            "button",
            {
              class: this.state.filter === "all" ? "active" : "",
              onclick: () => this.setState({ filter: "all" }),
            },
            ["All"]
          ),
          DOM.createElement(
            "button",
            {
              class: this.state.filter === "active" ? "active" : "",
              onclick: () => this.setState({ filter: "active" }),
            },
            ["Active"]
          ),
          DOM.createElement(
            "button",
            {
              class: this.state.filter === "completed" ? "active" : "",
              onclick: () => this.setState({ filter: "completed" }),
            },
            ["Completed"]
          ),
        ]),
      ]),
    ]);
  }
}
```

### **9. Multi-Page Application**

**Complete SPA with Routing:**

```javascript
class App extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = {
      currentRoute: "home",
      user: null,
    };

    // Setup router
    this.router = new Router({
      "/": "home",
      "/about": "about",
      "/contact": "contact",
      "/login": "login",
    });

    // Subscribe to route changes
    this.router.subscribe((route) => {
      this.setState({ currentRoute: route });
    });
  }

  render() {
    return DOM.createElement("div", { class: "app" }, [
      // Navigation
      this.renderNavigation(),

      // Main Content
      DOM.createElement("main", {}, [this.renderCurrentPage()]),

      // Footer
      DOM.createElement("footer", {}, [
        DOM.createElement("p", {}, ["© 2024 My App"]),
      ]),
    ]);
  }

  renderNavigation() {
    return DOM.createElement("nav", {}, [
      DOM.createElement("ul", {}, [
        DOM.createElement("li", {}, [
          DOM.createElement(
            "a",
            {
              href: "#/",
              class: this.state.currentRoute === "home" ? "active" : "",
              onclick: (e) => {
                e.preventDefault();
                this.router.navigate("/");
              },
            },
            ["Home"]
          ),
        ]),
        DOM.createElement("li", {}, [
          DOM.createElement(
            "a",
            {
              href: "#/about",
              class: this.state.currentRoute === "about" ? "active" : "",
              onclick: (e) => {
                e.preventDefault();
                this.router.navigate("/about");
              },
            },
            ["About"]
          ),
        ]),
      ]),
    ]);
  }

  renderCurrentPage() {
    switch (this.state.currentRoute) {
      case "home":
        return this.renderHomePage();
      case "about":
        return this.renderAboutPage();
      case "contact":
        return this.renderContactPage();
      default:
        return this.renderNotFoundPage();
    }
  }

  renderHomePage() {
    return DOM.createElement("div", {}, [
      DOM.createElement("h1", {}, ["Welcome Home"]),
      DOM.createElement("p", {}, ["This is the home page of our application."]),
    ]);
  }

  renderAboutPage() {
    return DOM.createElement("div", {}, [
      DOM.createElement("h1", {}, ["About Us"]),
      DOM.createElement("p", {}, ["Learn more about our company and mission."]),
    ]);
  }
}
```

## 🎯 Common Patterns

### **10. Conditional Rendering**

```javascript
// Simple conditional
function renderUserStatus(user) {
  return DOM.createElement("div", {}, [
    user.isLoggedIn
      ? DOM.createElement("p", {}, [`Welcome, ${user.name}!`])
      : DOM.createElement("p", {}, ["Please log in"]),
  ]);
}

// Multiple conditions
function renderContent(state) {
  const { loading, error, data } = state;

  if (loading) {
    return DOM.createElement("div", {}, ["Loading..."]);
  }

  if (error) {
    return DOM.createElement("div", { class: "error" }, [
      `Error: ${error.message}`,
    ]);
  }

  return DOM.createElement("div", {}, [
    DOM.createElement("h2", {}, ["Data Loaded"]),
    DOM.createElement("pre", {}, [JSON.stringify(data, null, 2)]),
  ]);
}
```

### **11. List Rendering**

```javascript
// Simple list
function renderUserList(users) {
  return DOM.createElement(
    "ul",
    {},
    users.map((user) =>
      DOM.createElement("li", { key: user.id }, [
        `${user.name} (${user.email})`,
      ])
    )
  );
}

// Complex list with interactions
function renderTodoList(todos, onToggle, onDelete) {
  return DOM.createElement(
    "ul",
    { class: "todo-list" },
    todos.map((todo) =>
      DOM.createElement(
        "li",
        {
          key: todo.id,
          class: todo.completed ? "completed" : "",
        },
        [
          DOM.createElement("input", {
            type: "checkbox",
            checked: todo.completed,
            onchange: () => onToggle(todo.id),
          }),
          DOM.createElement("span", {}, [todo.text]),
          DOM.createElement(
            "button",
            {
              onclick: () => onDelete(todo.id),
            },
            ["Delete"]
          ),
        ]
      )
    )
  );
}
```

### **12. Form Handling**

```javascript
// Controlled form
class ContactForm extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = {
      formData: {
        name: "",
        email: "",
        message: "",
      },
      errors: {},
    };
  }

  updateField(field, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value,
      },
    });
  }

  validateForm() {
    const errors = {};
    const { name, email, message } = this.state.formData;

    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!message.trim()) errors.message = "Message is required";

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  submitForm() {
    if (this.validateForm()) {
      console.log("Form submitted:", this.state.formData);
      // Handle form submission
    }
  }

  render() {
    const { formData, errors } = this.state;

    return DOM.createElement(
      "form",
      {
        onsubmit: (e) => {
          e.preventDefault();
          this.submitForm();
        },
      },
      [
        DOM.createElement("div", {}, [
          DOM.createElement("label", {}, ["Name:"]),
          DOM.createElement("input", {
            type: "text",
            value: formData.name,
            onchange: (e) => this.updateField("name", e.target.value),
          }),
          errors.name
            ? DOM.createElement("span", { class: "error" }, [errors.name])
            : null,
        ]),

        DOM.createElement("div", {}, [
          DOM.createElement("label", {}, ["Email:"]),
          DOM.createElement("input", {
            type: "email",
            value: formData.email,
            onchange: (e) => this.updateField("email", e.target.value),
          }),
          errors.email
            ? DOM.createElement("span", { class: "error" }, [errors.email])
            : null,
        ]),

        DOM.createElement("button", { type: "submit" }, ["Submit"]),
      ]
    );
  }
}
```

## 💡 Best Practices

### **13. Performance Optimization**

```javascript
// Use keys for efficient list updates
function renderOptimizedList(items) {
  return DOM.createElement(
    "ul",
    {},
    items.map((item) => DOM.createElement("li", { key: item.id }, [item.name]))
  );
}

// Batch state updates
function batchUpdates(store) {
  // Instead of multiple setState calls
  store.setState({
    loading: false,
    data: newData,
    error: null,
  });
}

// Memoize expensive computations
class OptimizedComponent extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = { items: [] };
    this._memoizedFilteredItems = null;
    this._lastFilter = null;
  }

  getFilteredItems() {
    const { filter } = this.props;
    if (this._lastFilter === filter && this._memoizedFilteredItems) {
      return this._memoizedFilteredItems;
    }

    this._memoizedFilteredItems = this.state.items.filter(
      (item) => item.category === filter
    );
    this._lastFilter = filter;

    return this._memoizedFilteredItems;
  }
}
```

### **14. Error Handling**

```javascript
// Component with error boundaries
class ErrorBoundary extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = { hasError: false, error: null };
  }

  render() {
    if (this.state.hasError) {
      return DOM.createElement("div", { class: "error-boundary" }, [
        DOM.createElement("h2", {}, ["Something went wrong"]),
        DOM.createElement("p", {}, [this.state.error.message]),
        DOM.createElement(
          "button",
          {
            onclick: () => this.setState({ hasError: false, error: null }),
          },
          ["Try Again"]
        ),
      ]);
    }

    try {
      return DOM.createElement("div", {}, this.children);
    } catch (error) {
      this.setState({ hasError: true, error });
      return DOM.createElement("div", {}, ["Loading..."]);
    }
  }
}
```

---

**Ready to build something amazing?**

Run `npm start` to see these examples in action, or check out the complete TodoMVC implementation in `examples/TodoMVC/`!

🚀 **Happy coding with Mini Framework!**
