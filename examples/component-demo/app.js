// Define a simple counter component using your framework
class Counter extends MiniComponent.ComponentBase {
    constructor(props, children) {
      super(props, children);
      this.state = { count: 0 };
    }
  
    render() {
      return MiniFramework.createVirtualNode('div', { style: "text-align:center;" }, [
        MiniFramework.createVirtualNode('h2', {}, ['Counter Component']),
        MiniFramework.createVirtualNode('p', {}, [`Count: ${this.state.count}`]),
        MiniFramework.createVirtualNode('button', {
          onClick: () => this.setState({ count: this.state.count + 1 })
        }, ['Increment']),
        MiniFramework.createVirtualNode('button', {
          onClick: () => this.setState({ count: this.state.count - 1 })
        }, ['Decrement'])
      ]);
    }
  
    onMount() {
      console.log('Counter mounted!');
    }
  
    onUnmount() {
      console.log('Counter will be removed!');
    }
  }
  
  // Create and mount the component
  const counter = MiniComponent.createComponent(Counter);
  MiniComponent.renderComponentToDOM(counter, document.getElementById('app'));
  
  // Optionally, after 10 seconds, unmount the component to test lifecycle
  setTimeout(() => {
    MiniComponent.removeComponentFromDOM(counter, document.getElementById('app'));
  }, 10000);