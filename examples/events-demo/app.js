// Events Demo using modern LightFrame API
import { DOM, Store } from '../../src/index.js';

console.log('🚀 Events Demo Starting with LightFrame...');

// Create store for demo state
const store = new Store({
  counter: 0,
  message: "Hello, LightFrame!",
  log: []
}, 'events-demo');

// Log function
const addLog = (msg) => {
  const state = store.getState();
  store.setState({
    log: [...state.log, `${new Date().toLocaleTimeString()}: ${msg}`]
  });
};

// Event Demo Component
const EventDemo = () => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h2', {}, ['Event System Demo']),
    DOM.createElement('button', {
      onclick: () => addLog('Button clicked!')
    }, ['Click Me']),
    DOM.createElement('button', {
      onclick: () => addLog('Button 2 clicked!'),
      onmouseover: () => addLog('Button 2 hovered!'),
      style: 'margin-left: 10px;'
    }, ['Hover or Click Me']),
    DOM.createElement('ul', {}, [
      DOM.createElement('li', {
        onclick: () => addLog('Item 1 clicked')
      }, ['Item 1 (clickable)']),
      DOM.createElement('li', {
        onclick: () => addLog('Item 2 clicked')
      }, ['Item 2 (clickable)']),
      DOM.createElement('li', {
        onclick: () => addLog('Item 3 clicked')
      }, ['Item 3 (clickable)'])
    ])
  ]);
};

// State Demo Component
const StateDemo = () => {
  const state = store.getState();
  
  return DOM.createElement('div', {}, [
    DOM.createElement('h2', {}, ['State Management Demo']),
    DOM.createElement('p', {}, [`Counter: ${state.counter}`]),
    DOM.createElement('button', {
      onclick: () => store.setState({ counter: state.counter + 1 })
    }, ['+']),
    DOM.createElement('button', {
      onclick: () => store.setState({ counter: state.counter - 1 }),
      style: 'margin-left: 10px;'
    }, ['-']),
    DOM.createElement('p', {}, [state.message]),
    DOM.createElement('button', {
      onclick: () => {
        const newMessage = prompt('New message:', state.message);
        if (newMessage) {
          store.setState({ message: newMessage });
        }
      }
    }, ['Change Message']),
    DOM.createElement('pre', {}, [JSON.stringify({ counter: state.counter, message: state.message }, null, 2)])
  ]);
};

// Virtual DOM Demo Component
const VirtualDOMDemo = () => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h2', {}, ['Virtual DOM Demo']),
    DOM.createElement('p', {}, ['This is rendered using your mini-framework\'s virtual DOM!']),
    DOM.createElement('button', {
      onclick: () => {
        alert('Virtual DOM Button Clicked!');
        addLog('Virtual DOM button clicked!');
      }
    }, ['Try Me!'])
  ]);
};

// Log Display Component
const LogDisplay = () => {
  const state = store.getState();
  
  return DOM.createElement('div', {}, [
    DOM.createElement('h2', {}, ['Event Log']),
    DOM.createElement('button', {
      onclick: () => store.setState({ log: [] })
    }, ['Clear Log']),
    DOM.createElement('div', { 
      style: 'max-height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 10px; margin: 10px 0;' 
    }, state.log.map(entry => 
      DOM.createElement('div', {}, [entry])
    ))
  ]);
};

// Main App Component
const App = () => {
  return DOM.createElement('div', {}, [
    DOM.createElement('div', { id: 'event-demo' }, [EventDemo()]),
    DOM.createElement('div', { id: 'state-demo' }, [StateDemo()]),
    DOM.createElement('div', { id: 'vdom-demo' }, [VirtualDOMDemo()]),
    DOM.createElement('div', { id: 'log-display' }, [LogDisplay()])
  ]);
};

// Render function
const render = () => {
  const app = document.getElementById('app');
  DOM.render(App(), app);
};

// Subscribe to state changes
store.subscribe(render);

// Initial render
render();

console.log('✅ Events Demo loaded successfully!');