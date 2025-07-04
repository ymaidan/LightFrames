(() => {
    // --- EVENTS DEMO ---
    const {
      addEvent,
      removeEvent,
      addDelegatedEvent,
      addMultipleEvents
    } = window.MiniEvents;
  
    const eventDemo = document.getElementById('event-demo');
    eventDemo.innerHTML = `
      <h2>Event System Demo</h2>
      <button id="ev-btn1">Click Me</button>
      <button id="ev-btn2">Hover or Click Me</button>
      <ul id="ev-list">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
      <div id="log"></div>
    `;
  
    const log = (msg) => {
      document.getElementById('log').innerHTML += `<div>${msg}</div>`;
    };
  
    const btn1 = document.getElementById('ev-btn1');
    addEvent(btn1, 'click', () => log('Button 1 clicked!'));
  
    const btn2 = document.getElementById('ev-btn2');
    addMultipleEvents(btn2, {
      click: () => log('Button 2 clicked!'),
      mouseover: () => log('Button 2 hovered!')
    });
  
    const list = document.getElementById('ev-list');
    addDelegatedEvent(list, 'li', 'click', function() {
      log('List item clicked: ' + this.textContent);
    });
  
    // --- STATE DEMO ---
    const {
      createStateStore,
      createAutoRenderingComponent
    } = window.MiniState;
  
    const stateDemo = document.getElementById('state-demo');
    stateDemo.innerHTML = `<h2>State Management Demo</h2><div id="state-app"></div>`;
  
    const store = createStateStore({
      counter: 0,
      message: "Hello, MiniState!"
    });
  
    function renderStateApp(state) {
      return MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('p', {}, [`Counter: ${state.counter}`]),
        MiniFramework.createVirtualNode('button', {
          onClick: () => store.updateState(s => ({ ...s, counter: s.counter + 1 }))
        }, ['+']),
        MiniFramework.createVirtualNode('button', {
          onClick: () => store.updateState(s => ({ ...s, counter: s.counter - 1 }))
        }, ['-']),
        MiniFramework.createVirtualNode('p', {}, [state.message]),
        MiniFramework.createVirtualNode('button', {
          onClick: () => store.updateState(s => ({ ...s, message: prompt('New message:', s.message) || s.message }))
        }, ['Change Message']),
        MiniFramework.createVirtualNode('pre', {}, [JSON.stringify(state, null, 2)])
      ]);
    }
  
    createAutoRenderingComponent(renderStateApp, document.getElementById('state-app'));
  
    // --- VIRTUAL DOM DEMO ---
    const vdomDemo = document.getElementById('vdom-demo');
    const vNode = MiniFramework.createVirtualNode('div', { class: 'container' }, [
      MiniFramework.createVirtualNode('h2', {}, ['Virtual DOM Demo']),
      MiniFramework.createVirtualNode('p', {}, ['This is rendered using your mini-framework\'s virtual DOM!']),
      MiniFramework.createVirtualNode('button', {
        onClick: () => alert('Virtual DOM Button Clicked!')
      }, ['Try Me!'])
    ]);
    MiniFramework.renderToDOM(vNode, vdomDemo);
  })();