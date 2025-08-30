// Simple Hi Demo
import { DOM } from '../../src/index.js';

const SimpleApp = () => {
  return DOM.createElement('div', {
    style: 'text-align: center; color: white; padding: 40px;'
  }, [
    DOM.createElement('h1', { 
      style: 'font-size: 3rem; margin-bottom: 20px;' 
    }, ['Hi! 👋']),
    
    DOM.createElement('p', {
      style: 'font-size: 1.2rem; opacity: 0.8;'
    }, ['Welcome to Mini Framework'])
  ]);
};

const render = () => {
  DOM.render(SimpleApp(), document.getElementById('app'));
};

render();