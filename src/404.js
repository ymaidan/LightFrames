// Simple 404 Component for LightFrame
const NotFoundComponent = ({ requestedPath = '/' }) => {
  const createElement = window.MiniFramework?.createVirtualNode || (() => null);
  
  return createElement('div', { 
    style: 'text-align: center; color: white; padding: 40px;' 
  }, [
    createElement('h1', { 
      style: 'font-size: 3rem; color: #ff6b6b; margin-bottom: 20px;' 
    }, ['404']),
    createElement('p', { 
      style: 'margin-bottom: 20px; opacity: 0.8;' 
    }, [`Route "${requestedPath}" not found`]),
    createElement('button', {
      style: 'background: rgba(255,224,102,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 12px 24px; cursor: pointer;',
      onclick: () => window.location.hash = '/'
    }, ['← Back to Home'])
  ]);
};

// Export globally
if (typeof window !== 'undefined') {
  window.NotFoundComponent = NotFoundComponent;
} 