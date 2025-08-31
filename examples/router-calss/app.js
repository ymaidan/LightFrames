import { DOM, Router, Store } from '../../src/index.js';

// Create state store (optional)
const store = new Store({
  user: { name: 'Guest' }
});

// Create components for each route
const HomePage = (params) => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h1', {}, ['Home Page']),
    DOM.createElement('a', { href: '#/user/123' }, ['Go to User 123']),
    DOM.createElement('br', {}, []),
    DOM.createElement('a', { href: '#/game/456' }, ['Go to Game 456'])
  ]);
};

const UserPage = (params) => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h1', {}, [`User: ${params.id}`]),
    DOM.createElement('p', {}, [`User ID is: ${params.id}`]),
    DOM.createElement('a', { href: '#/' }, ['Back to Home'])
  ]);
};

const GamePage = (params) => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h1', {}, [`Game #${params.gameId}`]),
    DOM.createElement('p', {}, [`Playing game number: ${params.gameId}`]),
    DOM.createElement('a', { href: '#/' }, ['Back to Home'])
  ]);
};

// Custom 404 component
const NotFound = ({ requestedPath }) => {
  return DOM.createElement('div', {}, [
    DOM.createElement('h1', {}, ['404 - Route Not Found']),
    DOM.createElement('p', {}, [`The route "${requestedPath}" doesn't exist`]),
    DOM.createElement('a', { href: '#/' }, ['Go Home'])
  ]);
};

// Create router with routes object and dynamic parameters
const router = new Router({
  '/': HomePage,
  '/user/:id': UserPage,           // Dynamic parameter :id
  '/game/:gameId': GamePage        // Dynamic parameter :gameId
}, NotFound, store);

// Optional: Subscribe to route changes
router.subscribe((routeInfo) => {
  console.log('Route changed:', routeInfo.path, 'Params:', routeInfo.params);
});

console.log('✅ Advanced Router loaded!');