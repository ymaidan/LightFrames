// Router Demo with State Synchronization
import { DOM } from '../../src/index.js';

console.log('🚀 Router Demo with State Starting...');

// Create state store for the app
const appState = window.MiniState?.createStateStore({
  currentRoute: '/',
  routeParams: {},
  user: { name: 'Guest', visits: 0 },
  isLoading: false
}) || null;

// Home Page Component
const HomePage = (params) => {
  const state = appState ? appState.getCurrentState() : { user: { visits: 0 } };
  
  return DOM.createElement('div', { 
    style: 'text-align: center; color: white; padding: 40px;' 
  }, [
    DOM.createElement('h1', { 
      style: 'font-size: 2.5rem; margin-bottom: 20px;' 
    }, ['🏠 Home Page']),
    DOM.createElement('p', { 
      style: 'margin-bottom: 20px; opacity: 0.9;' 
    }, [`Welcome! You've visited ${state.user.visits} times`]),
    DOM.createElement('div', {
      style: 'display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;'
    }, [
      DOM.createElement('button', {
        style: 'background: rgba(255,224,102,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer; margin: 5px;',
        onclick: () => router.navigate('/about')
      }, ['About']),
      DOM.createElement('button', {
        style: 'background: rgba(76,175,80,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer; margin: 5px;',
        onclick: () => router.navigate('/game/42')
      }, ['Game #42']),
      DOM.createElement('button', {
        style: 'background: rgba(255,152,0,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer; margin: 5px;',
        onclick: () => {
          if (appState) {
            appState.updateState(state => ({
              ...state,
              user: { ...state.user, visits: state.user.visits + 1 }
            }));
          }
        }
      }, ['Increment Visits'])
    ])
  ]);
};

// About Page Component
const AboutPage = (params) => {
  return DOM.createElement('div', { 
    style: 'text-align: center; color: white; padding: 40px;' 
  }, [
    DOM.createElement('h1', { 
      style: 'font-size: 2.5rem; margin-bottom: 20px;' 
    }, ['ℹ️ About']),
    DOM.createElement('p', { 
      style: 'margin-bottom: 20px; opacity: 0.9; line-height: 1.6;' 
    }, ['This router demo shows URL and state synchronization. When you navigate, both the URL and app state change together.']),
    DOM.createElement('button', {
      style: 'background: rgba(255,224,102,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer;',
      onclick: () => router.navigate('/')
    }, ['← Back Home'])
  ]);
};

// Contact Page Component
const ContactPage = (params) => {
  return DOM.createElement('div', { 
    style: 'text-align: center; color: white; padding: 40px;' 
  }, [
    DOM.createElement('h1', { 
      style: 'font-size: 2.5rem; margin-bottom: 20px;' 
    }, ['📞 Contact']),
    DOM.createElement('p', { 
      style: 'margin-bottom: 20px; opacity: 0.9; line-height: 1.6;' 
    }, ['Get in touch with us! This page demonstrates routing with navigation buttons.']),
    DOM.createElement('div', {
      style: 'margin-bottom: 20px; opacity: 0.8;'
    }, [
      DOM.createElement('p', { style: 'margin: 5px 0;' }, ['📧 Email: hello@miniframework.dev']),
      DOM.createElement('p', { style: 'margin: 5px 0;' }, ['🌐 Website: miniframework.dev']),
      DOM.createElement('p', { style: 'margin: 5px 0;' }, ['📱 Twitter: @miniframework'])
    ]),
    DOM.createElement('button', {
      style: 'background: rgba(255,224,102,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer;',
      onclick: () => router.navigate('/')
    }, ['← Back Home'])
  ]);
};

// Game Page with Dynamic Parameters
const GamePage = (params) => {
  const gameId = params.id || 'unknown';
  
  return DOM.createElement('div', { 
    style: 'text-align: center; color: white; padding: 40px;' 
  }, [
    DOM.createElement('h1', { 
      style: 'font-size: 2.5rem; margin-bottom: 20px;' 
    }, [`🎮 Game #${gameId}`]),
    DOM.createElement('p', { 
      style: 'margin-bottom: 20px; opacity: 0.9;' 
    }, [`You're playing game ${gameId}! The URL parameter is automatically extracted.`]),
    DOM.createElement('div', {
      style: 'display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;'
    }, [
      DOM.createElement('button', {
        style: 'background: rgba(76,175,80,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer; margin: 5px;',
        onclick: () => router.navigate(`/game/${parseInt(gameId) + 1}`)
      }, [`Next Game (#${parseInt(gameId) + 1})`]),
      DOM.createElement('button', {
        style: 'background: rgba(255,224,102,0.3); border: 1px solid rgba(255,255,255,0.3); border-radius: 12px; color: white; padding: 10px 20px; cursor: pointer; margin: 5px;',
        onclick: () => router.navigate('/')
      }, ['← Home'])
    ])
  ]);
};

// Create router with state store including the missing /contact route
const router = new window.Router({
  '/': HomePage,
  '/about': AboutPage,
  '/contact': ContactPage,
  '/game/:id': GamePage
}, window.NotFoundComponent, appState);

// Setup navigation buttons using custom event system
const setupNavigation = () => {
  const navHome = document.getElementById('nav-home');
  const navAbout = document.getElementById('nav-about');
  const navContact = document.getElementById('nav-contact');
  const navGame = document.getElementById('nav-game');

  if (navHome && window.MiniEvents) {
    MiniEvents.addEvent(navHome, 'click', () => router.navigate('/'));
  }
  if (navAbout && window.MiniEvents) {
    MiniEvents.addEvent(navAbout, 'click', () => router.navigate('/about'));
  }
  if (navContact && window.MiniEvents) {
    MiniEvents.addEvent(navContact, 'click', () => router.navigate('/contact'));
  }
  if (navGame && window.MiniEvents) {
    MiniEvents.addEvent(navGame, 'click', () => router.navigate('/game/1'));
  }

  console.log('✅ Navigation buttons setup complete');
};

// Wait for DOM to be ready, then setup navigation
setTimeout(setupNavigation, 100);

// Listen to state changes and re-render when state updates
if (appState) {
  appState.listenToStateChanges((newState) => {
    console.log('🔄 State changed:', newState);
    // Re-render current route when state changes
    router.handleRoute();
  });
}

// Subscribe to route changes
router.subscribe((routeInfo) => {
  console.log('🧭 Route changed:', routeInfo.path, 'Params:', routeInfo.params);
});

console.log('✅ Router Demo with State Synchronization loaded!');