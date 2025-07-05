// Basic Counter Example using LightFrame
import { DOM, Store } from '../../src/index.js';

console.log('🚀 Basic Example Starting with LightFrame...');

// Create state store using modern API
const store = new Store({
  count: 0
}, 'basic-counter');

// Counter Component
const Counter = () => {
  const state = store.getState();
  
  return DOM.createElement('div', { class: 'counter-container' }, [
    DOM.createElement('button', {
      class: 'counter-btn decrement-btn',
      onclick: () => {
        console.log('🔽 Decrement clicked');
        store.setState({ count: state.count - 1 });
      }
    }, ['−']),
    DOM.createElement('span', {
      class: 'counter-value'
    }, [String(state.count)]),
    DOM.createElement('button', {
      class: 'counter-btn increment-btn',
      onclick: () => {
        console.log('🔼 Increment clicked');
        store.setState({ count: state.count + 1 });
      }
    }, ['+'])
  ]);
};

// Render function
const render = () => {
  console.log('🎯 Rendering counter with count:', store.getState().count);
  const app = document.getElementById('app');
  DOM.render(Counter(), app);
};

// Subscribe to state changes
store.subscribe(() => {
  console.log('🔄 State changed:', store.getState());
  render();
});

// Initial render
render();

console.log('✅ Basic Example loaded successfully!');