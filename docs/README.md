# 💡 LightFrame Documentation

A lightweight, custom JavaScript framework with DOM abstraction, state management, routing, and event handling.

## 📋 Table of Contents

- [Framework Overview](#framework-overview)
- [Core Philosophy](#core-philosophy)
- [Getting Started](#getting-started)
- [Key Features](#key-features)
- [Quick Tutorial](#quick-tutorial)
- [Architecture](#architecture)
- [Why LightFrame](#why-lightframe)

## 🎯 Framework Overview

LightFrame is a custom JavaScript framework built from scratch without any external dependencies. It provides four core features that modern web applications need:

1. **DOM Abstraction** - Virtual DOM for efficient rendering
2. **State Management** - Reactive state with localStorage persistence
3. **Routing System** - Hash-based client-side routing
4. **Event Handling** - Custom event system (no addEventListener)

## 🧠 Core Philosophy

### **Simplicity First**

- Clean, intuitive API that's easy to learn
- No complex build processes or tooling required
- Pure JavaScript - works in any browser

### **Performance by Design**

- Virtual DOM minimizes expensive DOM operations
- Efficient diffing algorithm for optimal updates
- Custom event system with better performance

### **Developer Experience**

- Familiar patterns inspired by modern frameworks
- Comprehensive examples and documentation
- Built-in debugging and development tools

## 🚀 Getting Started

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd lightframe
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Open your browser**
   ```
   http://localhost:3000
   ```

### **First Application**

Create a simple counter application:

```javascript
// 1. Import the framework
import { DOM, Store } from "./src/index.js";

// 2. Create a store for state management
const store = new Store({ count: 0 });

// 3. Create a render function
function render() {
  const state = store.getState();

  const app = DOM.createElement("div", { class: "app" }, [
    DOM.createElement("h1", {}, ["Counter App"]),
    DOM.createElement("p", {}, [`Count: ${state.count}`]),
    DOM.createElement(
      "button",
      {
        onclick: () => store.setState({ count: state.count + 1 }),
      },
      ["Increment"]
    ),
  ]);

  DOM.render(app, document.getElementById("root"));
}

// 4. Subscribe to state changes
store.subscribe(render);

// 5. Initial render
render();
```

### **HTML Setup**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My LightFrame App</title>
  </head>
  <body>
    <div id="root"></div>

    <!-- Load framework files -->
    <script src="./src/core.js"></script>
    <script src="./src/events.js"></script>
    <script src="./src/state.js"></script>
    <script src="./src/router.js"></script>
    <script src="./src/framework.js"></script>

    <!-- Your app -->
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

## ✨ Key Features

### **🎯 DOM Abstraction**

**What it does**: Creates a virtual representation of the DOM that's faster to manipulate than the real DOM.

**Why it matters**: Direct DOM manipulation is slow. Our Virtual DOM batches changes and only updates what's necessary.

**How it works**:

```javascript
// Instead of: document.createElement('div')
const element = DOM.createElement("div", { class: "container" }, [
  DOM.createElement("h1", {}, ["Hello World"]),
]);

// Efficiently renders to real DOM
DOM.render(element, container);
```

### **📊 State Management**

**What it does**: Manages application state with automatic persistence and change notifications.

**Why it matters**: Keeps your app's data consistent across components and browser sessions.

**How it works**:

```javascript
// Create store with persistence
const store = new Store({ todos: [] }, "my-app-data");

// Update state
store.setState({ todos: [...todos, newTodo] });

// Subscribe to changes
store.subscribe((state) => {
  console.log("State updated:", state);
});
```

### **🧭 Routing System**

**What it does**: Synchronizes URL with application state using hash-based routing.

**Why it matters**: Enables single-page applications with bookmarkable URLs and browser history.

**How it works**:

```javascript
// Setup routes
const router = new Router({
  "/": "home",
  "/about": "about",
  "/contact": "contact",
});

// Listen to changes
router.subscribe((route) => {
  renderPage(route);
});
```

### **⚡ Event Handling**

**What it does**: Custom event system that doesn't use native addEventListener.

**Why it matters**: Better performance, easier debugging, and consistent behavior across browsers.

**How it works**:

```javascript
// Framework automatically handles events
DOM.createElement(
  "button",
  {
    onclick: (e) => console.log("Clicked!"),
    onkeydown: (e) => console.log("Key:", e.key),
  },
  ["Interactive Button"]
);
```

## 📚 Quick Tutorial

### **Step 1: Creating Elements**

```javascript
// Simple element
const heading = DOM.createElement("h1", {}, ["My App"]);

// Element with attributes
const input = DOM.createElement("input", {
  type: "text",
  placeholder: "Enter text...",
  class: "form-input",
});

// Element with events
const button = DOM.createElement(
  "button",
  {
    onclick: () => alert("Hello!"),
    class: "btn primary",
  },
  ["Click Me"]
);
```

### **Step 2: Nesting Elements**

```javascript
// Nested structure
const form = DOM.createElement("form", { class: "user-form" }, [
  DOM.createElement("div", { class: "form-group" }, [
    DOM.createElement("label", {}, ["Name:"]),
    DOM.createElement("input", { type: "text", name: "name" }),
  ]),
  DOM.createElement("div", { class: "form-group" }, [
    DOM.createElement("label", {}, ["Email:"]),
    DOM.createElement("input", { type: "email", name: "email" }),
  ]),
  DOM.createElement("button", { type: "submit" }, ["Submit"]),
]);
```

### **Step 3: Managing State**

```javascript
// Create store
const store = new Store({
  user: { name: "", email: "" },
  loading: false,
});

// Update state
function updateUser(userData) {
  store.setState({
    user: { ...store.getState().user, ...userData },
  });
}

// React to state changes
store.subscribe((state) => {
  renderUserProfile(state.user);
});
```

### **Step 4: Adding Routes**

```javascript
// Setup routing
const router = new Router({
  "/": "home",
  "/profile": "profile",
  "/settings": "settings",
});

// Handle route changes
router.subscribe((currentRoute) => {
  switch (currentRoute) {
    case "home":
      renderHomePage();
      break;
    case "profile":
      renderProfilePage();
      break;
    case "settings":
      renderSettingsPage();
      break;
  }
});

// Navigate programmatically
router.navigate("/profile");
```

## 🏗️ Architecture

### **Virtual DOM Layer**

- `core.js` - Virtual DOM creation and diffing
- `framework.js` - Main framework API

### **State Management Layer**

- `state.js` - Store implementation with persistence
- `index.js` - State management exports

### **Event System Layer**

- `events.js` - Custom event handling system

### **Routing Layer**

- `router.js` - Hash-based routing implementation

### **Component System Layer**

- `component.js` - Reusable component architecture

## 🤔 Why LightFrame?

### **Performance Benefits**

- **Virtual DOM**: Only updates changed elements
- **Efficient Diffing**: Minimal DOM operations
- **Custom Events**: Better performance than native events

### **Developer Experience**

- **Simple API**: Easy to learn and use
- **No Build Process**: Works directly in browser
- **Familiar Patterns**: Inspired by React and Vue

### **Educational Value**

- **Transparent**: You can see exactly how it works
- **Customizable**: Easy to extend and modify
- **Learning Tool**: Understand framework internals

## 🎯 Next Steps

1. **Read the API Reference** - `docs/API.md`
2. **Check Examples** - `docs/EXAMPLES.md`
3. **Run the Examples** - `npm start`
4. **Build Something** - Create your own application

## 📞 Support

- **Examples**: Run `npm start` to see interactive examples
- **Source Code**: Well-commented source files in `src/`
- **Documentation**: Complete API reference in `docs/API.md`

---

Ready to build something amazing? Let's go! 💡
