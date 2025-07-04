// Simple components using your virtual DOM
function showHome() {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['Home Page']),
        MiniFramework.createVirtualNode('p', {}, ['Welcome to the Home page!']),
        MiniFramework.createVirtualNode('button', {
          onClick: () => router.goToRoute('/game/42')
        }, ['Go to Game 42'])
      ]),
      document.getElementById('route-view')
    );
  }
  
  function showAbout() {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['About Page']),
        MiniFramework.createVirtualNode('p', {}, ['This is the About page.'])
      ]),
      document.getElementById('route-view')
    );
  }
  
  function showContact() {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['Contact Page']),
        MiniFramework.createVirtualNode('p', {}, ['Contact us at: hello@example.com'])
      ]),
      document.getElementById('route-view')
    );
  }
  
  // Dynamic route component
  function showGame(params) {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['Game Page']),
        MiniFramework.createVirtualNode('p', {}, [`Game ID: ${params.id}`]),
        MiniFramework.createVirtualNode('button', {
          onClick: () => router.goToRoute('/')
        }, ['Back to Home'])
      ]),
      document.getElementById('route-view')
    );
  }
  
  // 404 component
  function show404() {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['404 Not Found']),
        MiniFramework.createVirtualNode('p', {}, ['Sorry, page not found!']),
        MiniFramework.createVirtualNode('button', {
          onClick: () => router.goToRoute('/')
        }, ['Back to Home'])
      ]),
      document.getElementById('route-view')
    );
  }
  
  // Set up the router with dynamic and 404 routes
  const router = MiniRouter.makeRouter([
    { path: '/', component: showHome },
    { path: '/about', component: showAbout },
    { path: '/contact', component: showContact },
    { path: '/game/:id', component: showGame }
  ], show404);
  
  // Navigation buttons
  document.getElementById('nav-home').onclick = () => router.goToRoute('/');
  document.getElementById('nav-about').onclick = () => router.goToRoute('/about');
  document.getElementById('nav-contact').onclick = () => router.goToRoute('/contact');
  
  // Optional: Listen for route changes
  router.onRouteChange(route => {
    console.log('Route changed to:', route.path, route.params);
  });