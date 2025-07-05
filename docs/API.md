# 📖 Mini Framework API Reference

Complete reference for all Mini Framework APIs with examples and explanations.

## 📋 Table of Contents

- [DOM API](#dom-api)
- [State Management API](#state-management-api)
- [Router API](#router-api)
- [Event Handling API](#event-handling-api)
- [Component API](#component-api)
- [Utility Functions](#utility-functions)

## 🎯 DOM API

### **DOM.createElement(tag, attributes, children)**

Creates a virtual DOM element.

**Parameters:**

- `tag` (string) - HTML tag name
- `attributes` (object) - HTML attributes and event handlers
- `children` (array) - Child elements or text

**Returns:** Virtual DOM node object

**Example:**

```javascript
const element = DOM.createElement(
  "div",
  {
    class: "container",
    id: "main",
    onclick: () => console.log("clicked"),
  },
  ["Hello World", DOM.createElement("p", {}, ["Paragraph text"])]
);
```

### **DOM.render(vNode, container)**

Renders a virtual DOM node to a real DOM container.

**Parameters:**

- `vNode` (object) - Virtual DOM node
- `container` (HTMLElement) - DOM container element

**Returns:** void

**Example:**

```javascript
const app = DOM.createElement("div", {}, ["My App"]);
DOM.render(app, document.getElementById("root"));
```

## 📊 State Management API

### **new Store(initialState, persistenceKey)**

Creates a new state store with optional localStorage persistence.

**Parameters:**

- `initialState` (object) - Initial state object
- `persistenceKey` (string, optional) - localStorage key for persistence

**Returns:** Store instance

**Example:**

```javascript
const store = new Store(
  {
    count: 0,
    user: { name: "John" },
  },
  "my-app-state"
);
```

### **store.getState()**

Gets the current state.

**Returns:** Current state object

**Example:**

```javascript
const currentState = store.getState();
console.log(currentState.count); // 0
```

### **store.setState(newState)**

Updates the state and triggers subscribers.

**Parameters:**

- `newState` (object) - Partial state to merge

**Returns:** void

**Example:**

```javascript
store.setState({ count: 1 });
store.setState({
  user: { ...store.getState().user, age: 25 },
});
```

### **store.subscribe(callback)**

Subscribes to state changes.

**Parameters:**

- `callback` (function) - Function called when state changes

**Returns:** Unsubscribe function

**Example:**

```javascript
const unsubscribe = store.subscribe((state) => {
  console.log("State changed:", state);
});

// Later...
unsubscribe();
```

## 🧭 Router API

### **new Router(routes)**

Creates a new router instance.

**Parameters:**

- `routes` (object) - Route mapping object

**Returns:** Router instance

**Example:**

```javascript
const router = new Router({
  "/": "home",
  "/about": "about",
  "/contact": "contact",
});
```

### **router.navigate(path)**

Navigates to a specific route.

**Parameters:**

- `path` (string) - Route path

**Returns:** void

**Example:**

```javascript
router.navigate("/about");
```

### **router.getCurrentRoute()**

Gets the current route.

**Returns:** Current route string

**Example:**

```javascript
const currentRoute = router.getCurrentRoute();
console.log(currentRoute); // 'home'
```

### **router.subscribe(callback)**

Subscribes to route changes.

**Parameters:**

- `callback` (function) - Function called when route changes

**Returns:** Unsubscribe function

**Example:**

```javascript
const unsubscribe = router.subscribe((route) => {
  console.log("Route changed to:", route);
});
```

## ⚡ Event Handling API

### **Supported Events**

The framework supports all standard DOM events:

- **Mouse Events**: `onclick`, `onmouseover`, `onmouseout`, `ondblclick`
- **Keyboard Events**: `onkeydown`, `onkeyup`, `onkeypress`
- **Form Events**: `onchange`, `onblur`, `onfocus`
- **Window Events**: `onload`, `onhashchange`, `onpopstate`

### **Event Handler Syntax**

```javascript
DOM.createElement(
  "button",
  {
    onclick: (event) => {
      console.log("Button clicked!");
      console.log("Event target:", event.target);
    },
  },
  ["Click Me"]
);
```

### **Event Object Properties**

```javascript
DOM.createElement("input", {
  onkeydown: (event) => {
    console.log("Key:", event.key);
    console.log("Code:", event.code);
    console.log("Target:", event.target);
    console.log("Value:", event.target.value);
  },
});
```

## 🧩 Component API

### **class ComponentBase**

Base class for creating reusable components.

**Constructor:**

```javascript
constructor((props = {}), (children = []));
```

**Methods:**

- `render()` - Must be implemented by subclasses
- `setState(newState)` - Updates component state
- `onMount()` - Lifecycle method called after mounting
- `onUnmount()` - Lifecycle method called before unmounting

**Example:**

```javascript
class Counter extends ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = { count: 0 };
  }

  render() {
    return DOM.createElement("div", {}, [
      DOM.createElement("p", {}, [`Count: ${this.state.count}`]),
      DOM.createElement(
        "button",
        {
          onclick: () => this.setState({ count: this.state.count + 1 }),
        },
        ["Increment"]
      ),
    ]);
  }

  onMount() {
    console.log("Counter mounted!");
  }
}
```

### **MiniComponent.createComponent(ComponentClass, props, children)**

Creates a component instance.

**Parameters:**

- `ComponentClass` (class) - Component class
- `props` (object) - Component properties
- `children` (array) - Child elements

**Returns:** Component instance

### **MiniComponent.renderComponentToDOM(component, container)**

Renders a component to the DOM.

**Parameters:**

- `component` (object) - Component instance
- `container` (HTMLElement) - DOM container

## 🔧 Utility Functions

### **MiniFramework.createVirtualNode(tag, attrs, children)**

Low-level function to create virtual DOM nodes.

### **MiniFramework.createVirtualText(text)**

Creates virtual text nodes.

### **MiniFramework.diffVirtualNodes(oldVNode, newVNode)**

Compares two virtual DOM trees and returns patches.

### **MiniFramework.applyPatchesToDOM(element, patches)**

Applies patches to update the real DOM.

## 📝 Common Patterns

### **Conditional Rendering**

```javascript
function renderUserProfile(user) {
  return DOM.createElement("div", {}, [
    user.isLoggedIn
      ? DOM.createElement("p", {}, [`Welcome, ${user.name}!`])
      : DOM.createElement("p", {}, ["Please log in"]),
  ]);
}
```

### **List Rendering**

```javascript
function renderTodoList(todos) {
  return DOM.createElement(
    "ul",
    {},
    todos.map((todo) =>
      DOM.createElement("li", { key: todo.id }, [
        DOM.createElement("input", {
          type: "checkbox",
          checked: todo.completed,
          onchange: (e) => toggleTodo(todo.id),
        }),
        DOM.createElement("span", {}, [todo.text]),
      ])
    )
  );
}
```

### **Form Handling**

```javascript
function renderForm(formData) {
  return DOM.createElement(
    "form",
    {
      onsubmit: (e) => {
        e.preventDefault();
        handleSubmit(formData);
      },
    },
    [
      DOM.createElement("input", {
        type: "text",
        value: formData.name,
        onchange: (e) => updateForm({ name: e.target.value }),
      }),
      DOM.createElement("button", { type: "submit" }, ["Submit"]),
    ]
  );
}
```

## 🐛 Error Handling

### **Common Errors**

1. **"MiniFramework is not defined"**

   - Solution: Ensure `core.js` is loaded before your app

2. **"MiniEvents is not defined"**

   - Solution: Load `events.js` before using event handlers

3. **"render() must be implemented"**
   - Solution: Implement the `render()` method in your component

### **Debugging Tips**

1. **Check the console** - Framework logs helpful information
2. **Use browser dev tools** - Inspect the virtual DOM structure
3. **Enable verbose logging** - Set `window.DEBUG = true`

## 🚀 Performance Tips

1. **Use keys for lists** - Helps with efficient diffing
2. **Batch state updates** - Multiple setState calls are batched
3. **Avoid inline functions** - Define event handlers outside render
4. **Use components** - Reusable components are more efficient

---

**Need more help?** Check out the examples in `docs/EXAMPLES.md` or run `npm start` to see interactive demos!
