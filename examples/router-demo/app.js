// Router Demo using modern LightFrame API
import { DOM, Router } from '../../src/index.js';

console.log('🚀 Router Demo Starting...');

// Route Components using modern DOM API
const HomePage = () => {
  return DOM.createElement('div', { class: 'page-content' }, [
    DOM.createElement('div', { class: 'page-header' }, [
      DOM.createElement('h2', {}, ['🏠 Home Page']),
      DOM.createElement('p', {}, ['Welcome to the LightFrame Router Demo!'])
    ]),
    DOM.createElement('div', { class: 'page-body' }, [
      DOM.createElement('p', {}, ['This demonstrates client-side routing with URL synchronization.']),
      DOM.createElement('div', { class: 'demo-actions' }, [
        DOM.createElement('button', {
          class: 'action-btn primary',
          onclick: () => router.navigate('/game/42')
        }, ['🎮 Go to Game 42']),
        DOM.createElement('button', {
          class: 'action-btn secondary',
          onclick: () => router.navigate('/about')
        }, ['ℹ️ Learn More'])
      ])
    ])
  ]);
};

const AboutPage = () => {
  return DOM.createElement('div', { class: 'page-content' }, [
    DOM.createElement('div', { class: 'page-header' }, [
      DOM.createElement('h2', {}, ['ℹ️ About Page']),
      DOM.createElement('p', {}, ['Learn about LightFrame routing'])
    ]),
    DOM.createElement('div', { class: 'page-body' }, [
      DOM.createElement('div', { class: 'feature-list' }, [
        DOM.createElement('h3', {}, ['Router Features:']),
        DOM.createElement('ul', {}, [
          DOM.createElement('li', {}, ['✅ Hash-based routing']),
          DOM.createElement('li', {}, ['✅ Dynamic parameters']),
          DOM.createElement('li', {}, ['✅ 404 handling']),
          DOM.createElement('li', {}, ['✅ Browser back/forward support']),
          DOM.createElement('li', {}, ['✅ URL synchronization'])
        ])
      ]),
      DOM.createElement('div', { class: 'demo-actions' }, [
        DOM.createElement('button', {
          class: 'action-btn',
          onclick: () => router.navigate('/')
        }, ['🏠 Back to Home'])
      ])
    ])
  ]);
};

const ContactPage = () => {
  return DOM.createElement('div', { class: 'page-content' }, [
    DOM.createElement('div', { class: 'page-header' }, [
      DOM.createElement('h2', {}, ['📞 Contact Page']),
      DOM.createElement('p', {}, ['Get in touch with us'])
    ]),
    DOM.createElement('div', { class: 'page-body' }, [
      DOM.createElement('div', { class: 'contact-info' }, [
        DOM.createElement('p', {}, ['📧 Email: hello@lightframe.dev']),
        DOM.createElement('p', {}, ['🌐 Website: lightframe.dev']),
        DOM.createElement('p', {}, ['📱 Twitter: @lightframe'])
      ]),
      DOM.createElement('div', { class: 'demo-actions' }, [
        DOM.createElement('button', {
          class: 'action-btn',
          onclick: () => router.navigate('/')
        }, ['🏠 Back to Home']),
        DOM.createElement('button', {
          class: 'action-btn secondary',
          onclick: () => router.navigate('/about')
        }, ['ℹ️ About'])
      ])
    ])
  ]);
};

// Dynamic route component with parameters
const GamePage = (params) => {
  const gameId = params.id || 'unknown';
  
  return DOM.createElement('div', { class: 'page-content' }, [
    DOM.createElement('div', { class: 'page-header' }, [
      DOM.createElement('h2', {}, ['🎮 Game Page']),
      DOM.createElement('p', {}, [`Playing Game #${gameId}`])
    ]),
    DOM.createElement('div', { class: 'page-body' }, [
      DOM.createElement('div', { class: 'game-info' }, [
        DOM.createElement('h3', {}, ['Game Information:']),
        DOM.createElement('p', {}, [`Game ID: ${gameId}`]),
        DOM.createElement('p', {}, ['Status: ✅ Active']),
        DOM.createElement('p', {}, ['Players: 🎯 Single Player'])
      ]),
      DOM.createElement('div', { class: 'demo-actions' }, [
        DOM.createElement('button', {
          class: 'action-btn primary',
          onclick: () => router.navigate('/game/' + (parseInt(gameId) + 1))
        }, [`🎮 Next Game (#${parseInt(gameId) + 1})`]),
        DOM.createElement('button', {
          class: 'action-btn',
          onclick: () => router.navigate('/')
        }, ['🏠 Back to Home'])
      ])
    ])
  ]);
};

// Custom 404 component for router demo
const Router404 = ({ requestedPath }) => {
  return DOM.createElement('div', { class: 'page-content error-page' }, [
    DOM.createElement('div', { class: 'page-header' }, [
      DOM.createElement('h2', { class: 'error-code' }, ['404']),
      DOM.createElement('p', {}, ['Route Not Found'])
    ]),
    DOM.createElement('div', { class: 'page-body' }, [
      DOM.createElement('p', { class: 'error-message' }, [
        `The route "${requestedPath}" doesn't exist in this demo.`
      ]),
      DOM.createElement('div', { class: 'available-routes' }, [
        DOM.createElement('h3', {}, ['Available Routes:']),
        DOM.createElement('ul', {}, [
          DOM.createElement('li', {}, [
            DOM.createElement('a', { 
              href: '#/',
              onclick: (e) => { e.preventDefault(); router.navigate('/'); }
            }, ['🏠 Home (/)'])
          ]),
          DOM.createElement('li', {}, [
            DOM.createElement('a', { 
              href: '#/about',
              onclick: (e) => { e.preventDefault(); router.navigate('/about'); }
            }, ['ℹ️ About (/about)'])
          ]),
          DOM.createElement('li', {}, [
            DOM.createElement('a', { 
              href: '#/contact',
              onclick: (e) => { e.preventDefault(); router.navigate('/contact'); }
            }, ['📞 Contact (/contact)'])
          ]),
          DOM.createElement('li', {}, ['🎮 Game (/game/:id)'])
        ])
      ]),
      DOM.createElement('div', { class: 'demo-actions' }, [
        DOM.createElement('button', {
          class: 'action-btn primary',
          onclick: () => router.navigate('/')
        }, ['🏠 Go Home'])
      ])
    ])
  ]);
};

// Setup Router with modern API
const router = new Router({
  '/': HomePage,
  '/about': AboutPage,
  '/contact': ContactPage,
  '/game/:id': GamePage
}, Router404);

// Render function
const render = (component) => {
  const routeView = document.getElementById('route-view');
  if (routeView && component) {
    DOM.render(component, routeView);
  }
};

// Subscribe to route changes and render
router.subscribe((routeInfo) => {
  console.log('🧭 Route changed:', routeInfo);
  
  if (routeInfo && routeInfo.is404) {
    // Handle 404
    render(Router404({ requestedPath: routeInfo.path }));
  } else if (routeInfo && routeInfo.component) {
    // Handle normal routes
    if (typeof routeInfo.component === 'function') {
      const component = routeInfo.component(routeInfo.params || {});
      render(component);
    }
  }
});

// Setup navigation buttons
document.addEventListener('DOMContentLoaded', () => {
  const setupNav = () => {
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navContact = document.getElementById('nav-contact');
    const navGame = document.getElementById('nav-game');

    if (navHome) navHome.onclick = () => router.navigate('/');
    if (navAbout) navAbout.onclick = () => router.navigate('/about');
    if (navContact) navContact.onclick = () => router.navigate('/contact');
    if (navGame) navGame.onclick = () => router.navigate('/game/1');

    console.log('✅ Navigation buttons setup complete');
  };

  // Setup navigation after a short delay to ensure DOM is ready
  setTimeout(setupNav, 100);
});

console.log('✅ Router Demo initialized successfully!');