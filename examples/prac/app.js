import { DOM } from '../../src/index.js';

// Simple component with custom events
const EventDemo = () => {
  let count = 0;
  
  const updateCounter = (element) => {
    element.textContent = `Clicked: ${count}`;
  };
  
  return DOM.createElement('div', {}, [
    DOM.createElement('h1', {}, ['Custom Events Demo']),
    
    // Counter display
    DOM.createElement('h1', { id: 'counter' }, ['Clicked: 0']),
    
    // Button with click event
    DOM.createElement('button', {
      onclick: () => {
        count++;
        updateCounter(document.getElementById('counter'));
      }
    }, ['Click Me!']),
    
    // Hover effects
    DOM.createElement('div', {
      style: 'padding: 10px; margin: 10px; background: lightblue;',
      onmouseover: (e) => e.target.style.background = 'lightgreen',
      onmouseout: (e) => e.target.style.background = 'lightblue'
    }, ['Hover over me!']),
    
    // Input with keyup event
    DOM.createElement('input', {
      placeholder: 'Type something...',
      onkeyup: (e) => {
        console.log('You typed:', e.target.value);
      }
    }, [])
  ]);
};

// Render
DOM.render(EventDemo(), document.getElementById('app'));

// Bonus: Add delegated event using MiniEvents directly
MiniEvents.addEvent(document.body, 'click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    console.log('Button clicked via delegation!');
  }
});

// const store = MiniState.createStateStore({ count: 0 });

// store.listenToStateChanges(newState => {
//   console.log('State changed:', newState);
// });

// store.sendAction({ type: 'SET', payload: { count: 1 } }); // This will log: State changed: { count: 1 }