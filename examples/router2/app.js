import { App } from '../../src/index.js';

// Create a new app instance
const app = new App();

// Basic route: /ali
app.route('/ali', (state, framework) => {
  return framework.h('h1', {}, [framework.text('Hi Ali')]);
});

app.route('/yousif', (state, framework) => {
  return framework.h('h1', {}, [framework.text('Hi Yousif')]);
});

// Home route
app.route('/', (state, framework) => {
  return framework.h('div', {}, [
    framework.h('h1', {}, [framework.text('Home Page')]),
    framework.h('a', { href: '#/ali' }, [framework.text('Go to Ali')]),
    framework.h('br', {}, []),
    framework.h('a', { href: '#/yousif' }, [framework.text('Go to Yousif')])
  ]);
});

// Start the app
app.start('app');