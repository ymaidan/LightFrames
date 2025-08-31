import { DOM } from '../../src/index.js';

// Simple manual route handling
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const container = document.getElementById('app');
  
  let component;
  
  if (hash === '/') {
    component = DOM.createElement('div', {}, [
      DOM.createElement('h1', {}, ['Home']),
      DOM.createElement('a', { href: '#/about' }, ['Go to About']),
      DOM.createElement('br', {}, []),
      DOM.createElement('a', { href: '#/user/123' }, ['Go to User 123'])
    ]);
    
  } else if (hash === '/about') {
    component = DOM.createElement('div', {}, [
      DOM.createElement('h1', {}, ['About']),
      DOM.createElement('a', { href: '#/' }, ['Back Home'])
    ]);
    
  } else if (hash.startsWith('/user/')) {
    const userId = hash.split('/')[2];
    component = DOM.createElement('div', {}, [
      DOM.createElement('h1', {}, [`User: ${userId}`]),
      DOM.createElement('a', { href: '#/' }, ['Back Home'])
    ]);
    
  } else {
    component = DOM.createElement('div', {}, [
      DOM.createElement('h1', {}, ['404 - Not Found']),
      DOM.createElement('a', { href: '#/' }, ['Go Home'])
    ]);
  }
  
  DOM.render(component, container);
}

// Setup manual routing
if (window.MiniEvents) {
  MiniEvents.addEvent(window, 'hashchange', handleRoute);
  MiniEvents.addEvent(window, 'load', handleRoute);
} else {
  window.onhashchange = handleRoute;
  window.onload = handleRoute;
}