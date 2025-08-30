import { DOM } from '../../src/index.js';

function App() {
  return DOM.createElement('div', {
  }, [
    DOM.createElement('h1', { 
    }, [' Home Page']),
  ]);
}

const render = () => {
  DOM.render(App(), document.getElementById('app'));
};

render();
