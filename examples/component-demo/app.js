// Define a simple counter component using your framework
class Counter extends MiniComponent.ComponentBase {
    constructor(props, children) {
      super(props, children);
      this.state = { count: props.initialCount || 0 };
    }
  
    render() {
      return MiniFramework.createVirtualNode('div', { 
        class: 'component-container',
        style: "text-align:center;" 
      }, [
        MiniFramework.createVirtualNode('h2', {}, ['Counter Component']),
        MiniFramework.createVirtualNode('p', {}, [`Count: ${this.state.count}`]),
        MiniFramework.createVirtualNode('div', { style: 'margin: 20px 0;' }, [
          MiniFramework.createVirtualNode('button', {
            onClick: () => this.setState({ count: this.state.count - 1 })
          }, ['Decrement']),
          MiniFramework.createVirtualNode('button', {
            onClick: () => this.setState({ count: this.state.count + 1 }),
            style: 'margin-left: 10px;'
          }, ['Increment'])
        ]),
        MiniFramework.createVirtualNode('button', {
          onClick: () => this.setState({ count: 0 }),
          style: 'margin-top: 10px;'
        }, ['Reset'])
      ]);
    }
  
    onMount() {
      console.log('Counter mounted with initial count:', this.state.count);
    }
  
    onUnmount() {
      console.log('Counter will be removed!');
    }
  }
  
  // Define a simple text component
  class TextDisplay extends MiniComponent.ComponentBase {
    constructor(props, children) {
      super(props, children);
      this.state = { text: props.initialText || 'Hello World!' };
    }
  
    render() {
      return MiniFramework.createVirtualNode('div', { 
        class: 'component-container',
        style: "text-align:center; margin-top: 20px;" 
      }, [
        MiniFramework.createVirtualNode('h2', {}, ['Text Component']),
        MiniFramework.createVirtualNode('p', {}, [this.state.text]),
        MiniFramework.createVirtualNode('input', {
          type: 'text',
          value: this.state.text,
          onchange: (e) => this.setState({ text: e.target.value }),
          style: 'padding: 10px; margin: 10px; border-radius: 8px; border: 1px solid #ccc;'
        }),
        MiniFramework.createVirtualNode('button', {
          onClick: () => this.setState({ text: 'Component Updated!' })
        }, ['Update Text'])
      ]);
    }
  
    onMount() {
      console.log('TextDisplay mounted');
    }
  }
  
  // Create and mount the components
  const counter = MiniComponent.createComponent(Counter, { initialCount: 5 });
  const textDisplay = MiniComponent.createComponent(TextDisplay, { initialText: 'Mini Framework Components!' });
  
  // Create a container for both components
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = `
    <div class="component-container">
      <h1>🚀 Component Demo</h1>
      <p>This demo shows how to create and use components with your Mini Framework.</p>
    </div>
    <div id="counter-container"></div>
    <div id="text-container"></div>
  `;
  
  // Render components to their containers
  MiniComponent.renderComponentToDOM(counter, document.getElementById('counter-container'));
  MiniComponent.renderComponentToDOM(textDisplay, document.getElementById('text-container'));
  
  // Demo lifecycle: Remove and re-add components after 15 seconds
  setTimeout(() => {
    console.log('🔄 Testing component lifecycle...');
    
    // Remove components
    MiniComponent.removeComponentFromDOM(counter, document.getElementById('counter-container'));
    MiniComponent.removeComponentFromDOM(textDisplay, document.getElementById('text-container'));
    
    // Add them back after 2 seconds
    setTimeout(() => {
      console.log('🔄 Re-mounting components...');
      MiniComponent.renderComponentToDOM(counter, document.getElementById('counter-container'));
      MiniComponent.renderComponentToDOM(textDisplay, document.getElementById('text-container'));
    }, 2000);
  }, 15000);