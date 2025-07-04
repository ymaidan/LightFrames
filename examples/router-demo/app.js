// Simple components using your virtual DOM
function showHome() {
    MiniFramework.renderToDOM(
      MiniFramework.createVirtualNode('div', {}, [
        MiniFramework.createVirtualNode('h2', {}, ['Home Page']),
        MiniFramework.createVirtualNode('p', {}, ['Welcome to the Home page!'])
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
  
  // Set up the router
  const router = MiniRouter.makeRouter([
    { path: '/', component: showHome },
    { path: '/about', component: showAbout },
    { path: '/contact', component: showContact }
  ]);
  
  // Navigation buttons
  document.getElementById('nav-home').onclick = () => router.goToRoute('/');
  document.getElementById('nav-about').onclick = () => router.goToRoute('/about');
  document.getElementById('nav-contact').onclick = () => router.goToRoute('/contact');
  
  // Optional: Listen for route changes
  router.onRouteChange(route => {
    console.log('Route changed to:', route.path);
  });