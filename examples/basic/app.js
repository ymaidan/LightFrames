// Basic Counter Example using LightFrame
console.log('🚀 Basic Example Starting with LightFrame...');

// Create state store using the global MiniState object
const store = MiniState.createStateStore({
  count: 0
});

// Counter Component
const Counter = () => {
  const state = store.getCurrentState();
  
  return MiniFramework.createVirtualNode('div', { class: 'counter-container' }, [
    MiniFramework.createVirtualNode('button', {
      class: 'counter-btn decrement-btn',
      onclick: () => {
        console.log('🔽 Decrement clicked');
        store.updateState({ count: state.count - 1 });
      }
    }, ['−']),
    MiniFramework.createVirtualNode('span', {
      class: 'counter-value'
    }, [String(state.count)]),
    MiniFramework.createVirtualNode('button', {
      class: 'counter-btn increment-btn',
      onclick: () => {
        console.log('🔼 Increment clicked');
        store.updateState({ count: state.count + 1 });
      }
    }, ['+'])
  ]);
};

// Render function
const render = () => {
  console.log('🎯 Rendering counter with count:', store.getCurrentState().count);
  const app = document.getElementById('app');
  MiniFramework.renderToDOM(Counter(), app);
};

// Subscribe to state changes using the correct method
store.listenToStateChanges(() => {
  console.log('🔄 State changed:', store.getCurrentState());
  render();
});

// Initial render
render();

console.log('✅ Basic Example loaded successfully!');