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

app.route('/about' , (state ,framework) => {
  return framework.h('h1' ,{ }, [framework.text('just abt me')]);
});


app.route('/gg/:id' , (state ,framework) => {
  return framework.h('h1' ,{ }, [framework.text(`Game ${state.params.id}`)])
});


// Home route
app.route('/', (state, framework) => {
  return framework.h('div', {}, [
    framework.h('h1', {}, [framework.text('Home Page')]),
    framework.h('a', { href: '#/ali' }, [framework.text('Go to Ali')]),
    framework.h('br', {}, []),
    framework.h('a', { href: '#/yousif' }, [framework.text('Go to Yousif')]),
    framework.h('br', {},[]),
    framework.h('a', {href: '#/about'}, [framework.text('Go to about')]),
    framework.h('br' , {} , []),
    framework.h('a' , {href: '#gg/123'}, [framework.text('go to game 123')])
  ]);
});

// Start the app
app.start('app');