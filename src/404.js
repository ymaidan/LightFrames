// src/404.js - Reusable 404 Component for LightFrame

const NotFoundComponent = ({ requestedPath }) => {
  console.log(`🔍 404 Component rendered for: ${requestedPath}`);
  
  // Use global MiniFramework instead of imported DOM
  const DOM = window.LightFrame?.DOM || {
    createElement: MiniFramework.createVirtualNode
  };
  
  return DOM.createElement('div', { class: 'not-found-container' }, [
    DOM.createElement('div', { class: 'not-found-content' }, [
      DOM.createElement('h1', { class: 'error-code' }, ['404']),
      DOM.createElement('h2', { class: 'error-title' }, ['Route Not Found']),
      DOM.createElement('p', { class: 'error-message' }, [
        `The route "${requestedPath}" doesn't exist.`
      ]),
      DOM.createElement('div', { class: 'error-actions' }, [
        DOM.createElement('button', {
          class: 'back-button',
          onclick: () => window.history.back()
        }, ['← Go Back']),
        DOM.createElement('button', {
          class: 'home-button',
          onclick: () => window.location.href = '/'
        }, ['🏠 Home'])
      ])
    ])
  ]);
};

// CSS for 404 component
const notFoundStyles = `
  .not-found-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 40px;
  }
  
  .not-found-content {
    text-align: center;
    background: rgba(255,255,255,0.1);
    border-radius: 16px;
    padding: 40px;
    border: 1px solid rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
  }
  
  .error-code {
    font-size: 4rem;
    color: #ff6b6b;
    margin-bottom: 20px;
    text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  }
  
  .error-title {
    font-size: 1.8rem;
    color: #fff;
    margin-bottom: 15px;
    font-weight: 300;
  }
  
  .error-message {
    color: rgba(255,255,255,0.8);
    margin-bottom: 30px;
    font-size: 1.1rem;
  }
  
  .error-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
  }
  
  .back-button, .home-button {
    background: rgba(255,224,102,0.3);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 12px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .back-button:hover, .home-button:hover {
    background: rgba(255,224,102,0.4);
    transform: translateY(-2px);
  }
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = notFoundStyles;
  document.head.appendChild(style);
}

// Export for use in examples
if (typeof window !== 'undefined') {
  window.NotFoundComponent = NotFoundComponent;
} 