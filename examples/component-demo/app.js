// Component Demo using modern LightFrame API
import { DOM, Store } from '../../src/index.js';

console.log('🚀 Component Demo Starting with LightFrame...');

// Create stores for components
const counterStore = new Store({
  count: 5
}, 'component-counter');

const textStore = new Store({
  text: 'Mini Framework Components!'
}, 'component-text');

// Counter Component
const Counter = () => {
  const state = counterStore.getState();
  
  return DOM.createElement('div', { 
    class: 'component-container',
    style: "text-align:center;" 
  }, [
    DOM.createElement('h2', {}, ['Counter Component']),
    DOM.createElement('p', {}, [`Count: ${state.count}`]),
    DOM.createElement('div', { style: 'margin: 20px 0;' }, [
      DOM.createElement('button', {
        onclick: () => counterStore.setState({ count: state.count - 1 })
      }, ['Decrement']),
      DOM.createElement('button', {
        onclick: () => counterStore.setState({ count: state.count + 1 }),
        style: 'margin-left: 10px;'
      }, ['Increment'])
    ]),
    DOM.createElement('button', {
      onclick: () => counterStore.setState({ count: 0 }),
      style: 'margin-top: 10px;'
    }, ['Reset'])
  ]);
};

// Text Component
const TextDisplay = () => {
  const state = textStore.getState();
  
  return DOM.createElement('div', { 
    class: 'component-container',
    style: "text-align:center; margin-top: 20px;" 
  }, [
    DOM.createElement('h2', {}, ['Text Component']),
    DOM.createElement('p', {}, [state.text]),
    DOM.createElement('input', {
      type: 'text',
      value: state.text,
      onchange: (e) => textStore.setState({ text: e.target.value }),
      style: 'padding: 10px; margin: 10px; border-radius: 8px; border: 1px solid #ccc;'
    }),
    DOM.createElement('button', {
      onclick: () => textStore.setState({ text: 'Component Updated!' })
    }, ['Update Text'])
  ]);
};

// App Component
const App = () => {
  return DOM.createElement('div', {}, [
    DOM.createElement('div', { class: 'component-container' }, [
      DOM.createElement('h1', {}, ['🚀 Component Demo']),
      DOM.createElement('p', {}, ['This demo shows how to create and use components with your Mini Framework.'])
    ]),
    Counter(),
    TextDisplay()
  ]);
};

// Render function
const render = () => {
  const app = document.getElementById('app');
  DOM.render(App(), app);
};

// Subscribe to state changes
counterStore.subscribe(render);
textStore.subscribe(render);

// Initial render
render();

console.log('✅ Component Demo loaded successfully!');