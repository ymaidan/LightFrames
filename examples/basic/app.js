// examples/basic/app.js

// Test the framework
const app = document.getElementById('app');

// Create a simple virtual DOM
const vNode = MiniFramework.createVNode('div', 
  { class: 'container' }, 
  [
    MiniFramework.createVNode('h1', {}, ['Hello Mini Framework!']),
    MiniFramework.createVNode('p', {}, ['This is a test of the virtual DOM.']),
    MiniFramework.createVNode('button', 
      { 
        onClick: () => alert('Button clicked!') 
      }, 
      ['Click me!']
    )
  ]
);

// Render it
MiniFramework.render(vNode, app);