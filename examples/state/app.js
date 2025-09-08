

// Create state store using the global MiniState API
const store = window.MiniState.createStateStore({ count: 0 });


console.log('Initial state:', window.MiniState.getCurrentState());

// Create the Counter component
const Counter = () => {
  const state = window.MiniState.getCurrentState();
  
  return window.MiniFramework.createVirtualNode('div', { 
    style: 'text-align: center; padding: 20px; font-family: Arial, sans-serif;' 
  }, [
    window.MiniFramework.createVirtualNode('h2', { 
      style: 'color: #333; margin-bottom: 20px;' 
    }, [`Count: ${state.count}`]),
    
    window.MiniFramework.createVirtualNode('div', { 
      style: 'margin: 10px;' 
    }, [
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => {
          console.log('🔽 Decrement clicked');
          window.MiniState.updateState({ count: state.count - 1 });
        },
        style: 'background: #ff6b6b; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer; font-size: 16px;'
      }, ['−']),
      
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => {
          console.log('🔼 Increment clicked');
          window.MiniState.updateState({ count: state.count + 1 });
        },
        style: 'background: #4ecdc4; color: white; border: none; padding: 10px 20px; margin: 5px; border-radius: 5px; cursor: pointer; font-size: 16px;'
      }, ['+'])
    ]),
    
    window.MiniFramework.createVirtualNode('div', { 
      style: 'margin-top: 20px;' 
    }, [
      window.MiniFramework.createVirtualNode('button', { 
        onclick: () => {
          console.log('🔄 Reset clicked');
          window.MiniState.sendAction({ type: 'RESET', payload: { count: 0 } });
        },
        style: 'background: #95a5a6; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;'
      }, ['Reset'])
    ])
  ]);
};

// Function to render the app
const renderApp = () => {
  console.log('🎯 Rendering app with state:', window.MiniState.getCurrentState());
  
  const app = window.MiniFramework.createVirtualNode('div', {}, [
    window.MiniFramework.createVirtualNode('h1', { 
      style: 'text-align: center; color: #2c3e50; margin-bottom: 30px;' 
    }, ['State Management Demo']),
    Counter()
  ]);

  window.MiniFramework.renderToDOM(app, document.getElementById('app'));
};

// Subscribe to state changes
const unsubscribe = window.MiniState.listenToStateChanges((newState) => {
  console.log('🔄 State changed:', newState);
  renderApp(); // Re-render the app on state change
});

// Initial render
renderApp();

// Demo: Test the action system
setTimeout(() => {
  console.log('🧪 Testing action system...');
  window.MiniState.sendAction({ 
    type: 'SET', 
    payload: { count: 5 } 
  });
}, 2000);

console.log('✅ State Example loaded successfully!');