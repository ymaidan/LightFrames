// Counter Component
class Counter extends Mini.ComponentBase {
  constructor(props, children) {
    super(props, children);
    this.state = { count: 0, animate: '' };
  }

  onMount() {
    console.log('[Counter] Component mounted, setting up events');
    
    // Use a longer timeout to ensure DOM is fully rendered
    setTimeout(() => {
      const decrementBtn = document.querySelector('.decrement-btn');
      const incrementBtn = document.querySelector('.increment-btn');
      
      if (decrementBtn && incrementBtn) {
        console.log('[Counter] Buttons found, attaching events');
        
        // Store handlers for cleanup (bind to preserve 'this' context)
        this.decrementHandler = this.decrement.bind(this);
        this.incrementHandler = this.increment.bind(this);
        
        // Using MiniEvents for all event handling
        MiniEvents.addEvent(decrementBtn, 'click', this.decrementHandler);
        MiniEvents.addEvent(incrementBtn, 'click', this.incrementHandler);
        
        console.log('[Counter] Events attached successfully');
      } else {
        console.error('[Counter] Buttons not found!');
        // Retry after a bit more time
        setTimeout(() => this.onMount(), 100);
      }
    }, 500); // Increased timeout significantly
  }

  onUnmount() {
    console.log('[Counter] Component unmounting, cleaning up events');
    
    const decrementBtn = document.querySelector('.decrement-btn');
    const incrementBtn = document.querySelector('.increment-btn');
    
    if (decrementBtn && this.decrementHandler) {
      MiniEvents.removeEvent(decrementBtn, 'click', this.decrementHandler);
    }
    if (incrementBtn && this.incrementHandler) {
      MiniEvents.removeEvent(incrementBtn, 'click', this.incrementHandler);
    }
  }

  increment() {
    const newCount = this.state.count + 1;
    console.log('[Counter] Incrementing from', this.state.count, 'to', newCount);
    this.setState({ count: newCount });
    this.animateChange('animate-up');
  }

  decrement() {
    const newCount = this.state.count - 1;
    console.log('[Counter] Decrementing from', this.state.count, 'to', newCount);
    this.setState({ count: newCount });
    this.animateChange('animate-down');
  }

  animateChange(direction) {
    this.setState({ animate: direction });
    setTimeout(() => {
      this.setState({ animate: '' });
    }, 400);
  }

  render() {
    console.log('[Counter] Rendering with count:', this.state.count);
    return Mini.h('div', { class: 'counter-container' }, [
      Mini.h('button', {
        class: 'counter-btn decrement-btn',
        type: 'button'
      }, ['−']),
      Mini.h('span', {
        class: `counter-value ${this.state.animate}`
      }, [String(this.state.count)]),
      Mini.h('button', {
        class: 'counter-btn increment-btn',
        type: 'button'
      }, ['+'])
    ]);
  }
}

// 404 Component
class NotFound extends Mini.ComponentBase {
  onMount() {
    setTimeout(() => {
      const homeBtn = document.querySelector('.home-btn');
      if (homeBtn) {
        this.homeHandler = () => {
          console.log('[Router] Navigating home');
          window.location.hash = '/';
          location.reload();
        };
        
        MiniEvents.addEvent(homeBtn, 'click', this.homeHandler);
      }
    }, 500);
  }

  onUnmount() {
    const homeBtn = document.querySelector('.home-btn');
    if (homeBtn && this.homeHandler) {
      MiniEvents.removeEvent(homeBtn, 'click', this.homeHandler);
    }
  }

  render() {
    return Mini.h('div', { class: 'counter-container' }, [
      Mini.h('div', { style: 'text-align: center;' }, [
        Mini.h('h1', { style: 'color: white; margin: 0;' }, ['404']),
        Mini.h('p', { style: 'color: white;' }, ['Page Not Found']),
        Mini.h('p', { 
          style: 'color: white; font-size: 0.8em;' 
        }, [`Path: ${window.location.hash || '/'}`]),
        Mini.h('button', {
          class: 'counter-btn home-btn',
          type: 'button'
        }, ['Home'])
      ])
    ]);
  }
}

// Initialize app when DOM is ready
MiniEvents.addEvent(window, 'load', () => {
  console.log('[App] Initializing application');
  
  // Create and mount the main app
  const app = Mini.createApp({
    rootComponent: Counter
  });
  
  const appContainer = document.getElementById('app');
  if (appContainer) {
    Mini.mount(app, appContainer);
    console.log('[App] Counter component mounted');
  }
  
  // Simple hash change handling
  MiniEvents.addEvent(window, 'hashchange', () => {
    const path = window.location.hash.replace(/^#/, '') || '/';
    console.log('[Router] Hash changed to:', path);
    
    if (path !== '/' && path !== '') {
      // Show 404 for any non-home route
      const notFoundApp = Mini.createApp({ rootComponent: NotFound });
      const container = document.getElementById('app');
      if (container) {
        Mini.mount(notFoundApp, container);
      }
    } else {
      // Reload to go back to counter
      location.reload();
    }
  });
});