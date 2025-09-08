// Minimal State Example - No Styling, Pure Functionality

// Create state store
window.MiniState.createStateStore({ count: 0 });

// Create auto-rendering component with zero styling
window.MiniState.createAutoRenderingComponent(
  (state) => {
    return window.MiniFramework.createVirtualNode('div', {}, [
      window.MiniFramework.createVirtualNode('h1', {}, ['State Demo']),
      window.MiniFramework.createVirtualNode('p', {}, [`Count: ${state.count}`]),
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => window.MiniState.updateState({ count: state.count - 1 })
      }, ['-']),
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => window.MiniState.updateState({ count: state.count + 1 })
      }, ['+']),
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => window.MiniState.sendAction({ type: 'RESET', payload: { count: 0 } })
      }, ['Reset'])
    ]);
  },
  document.getElementById('app')
);


// // Helper functions for cleaner code
// const h = window.MiniFramework.createVirtualNode;
// const { updateState, sendAction, createStateStore, createAutoRenderingComponent } = window.MiniState;

// // Super clean setup
// createStateStore({ count: 0 });

// createAutoRenderingComponent(
//   state => h('div', { style: 'text-align: center; padding: 20px;' }, [
//     h('h1', {}, ['Count: ' + state.count]),
//     h('button', { onclick: () => updateState({ count: state.count - 1 }) }, ['-']),
//     h('button', { onclick: () => updateState({ count: state.count + 1 }) }, ['+']),
//     h('button', { onclick: () => sendAction({ type: 'RESET', payload: { count: 0 } }) }, ['Reset'])
//   ]),
//   document.getElementById('app')
// );