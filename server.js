// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use('/src', express.static('src'));
app.use('/examples', express.static('examples'));

// Production examples (filter out development/test folders)
const productionExamples = ['basic', 'component-demo', 'events-demo', 'router-demo', 'TodoMVC'];

// Get filtered examples
const getExamples = () => {
  try {
    return fs.readdirSync('examples', { withFileTypes: true })
      .filter(d => d.isDirectory() && productionExamples.includes(d.name))
      .map(d => d.name)
      .sort((a, b) => {
        // Put TodoMVC first (featured), then alphabetical
        if (a === 'TodoMVC') return -1;
        if (b === 'TodoMVC') return 1;
        return a.localeCompare(b);
      });
  } catch { return []; }
};

// Get example descriptions
const getExampleDescription = (name) => {
  const descriptions = {
    'TodoMVC': 'Complete TodoMVC implementation with persistence and routing',
    'basic': 'Simple counter demonstrating state management',
    'component-demo': 'Reusable components with independent stores',
    'events-demo': 'Custom event system with multiple event types',
    'router-demo': 'Hash-based routing with dynamic parameters'
  };
  return descriptions[name] || 'Framework demonstration';
};

// Main page
app.get('/', (req, res) => {
  const examples = getExamples();

  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>💡 LightFrame</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #d4d0c8; 
      font-family: 'Inter', Arial, sans-serif; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 20px; 
    }
    .container { 
      background: rgba(120,120,120,0.45); 
      backdrop-filter: blur(16px); 
      border-radius: 24px; 
      border: 1.5px solid rgba(255,255,255,0.25); 
      padding: 40px; 
      max-width: 1000px; 
      width: 100%; 
      box-shadow: 0 8px 32px rgba(31,38,135,0.25); 
    }
    h1 { 
      text-align: center; 
      font-size: 4rem; 
      font-weight: 200; 
      color: #fff; 
      margin-bottom: 15px; 
      text-shadow: 0 2px 8px rgba(0,0,0,0.3); 
    }
    .subtitle {
      text-align: center;
      color: rgba(255,255,255,0.8);
      font-size: 1.2rem;
      margin-bottom: 40px;
      font-weight: 300;
    }
    
    /* Documentation Section */
    .docs-section {
      margin-bottom: 40px;
    }
    .section-title {
      color: #fff;
      font-size: 1.5rem;
      margin-bottom: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .docs-card {
      background: rgba(255,224,102,0.2);
      border: 1.5px solid rgba(255,224,102,0.4);
      border-radius: 16px;
      padding: 24px;
      text-decoration: none;
      color: #fff;
      display: block;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }
    .docs-card:hover {
      background: rgba(255,224,102,0.3);
      transform: translateY(-3px);
      box-shadow: 0 8px 32px rgba(255,224,102,0.2);
    }
    .docs-card h3 {
      font-size: 1.3rem;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .docs-card p {
      color: rgba(255,255,255,0.9);
      line-height: 1.5;
    }
    
    /* Examples Section */
    .examples-section {
      margin-top: 20px;
    }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
      gap: 20px; 
    }
    .card { 
      background: rgba(80,80,80,0.3); 
      border: 1px solid rgba(255,255,255,0.3); 
      border-radius: 16px; 
      padding: 24px; 
      transition: all 0.3s ease; 
      text-decoration: none; 
      color: #fff; 
      backdrop-filter: blur(8px);
    }
    .card:hover { 
      background: rgba(100,100,100,0.4); 
      transform: translateY(-5px); 
      border-color: rgba(255,224,102,0.5); 
      box-shadow: 0 12px 40px rgba(0,0,0,0.2);
    }
    .card h3 { 
      margin-bottom: 12px; 
      text-transform: capitalize; 
      font-size: 1.2rem;
      font-weight: 600;
    }
    .card p {
      color: rgba(255,255,255,0.8);
      font-size: 0.95rem;
      line-height: 1.4;
    }
    .featured {
      border: 2px solid rgba(255,215,0,0.6);
      background: rgba(255,215,0,0.1);
      position: relative;
    }
    .featured::before {
      content: "⭐";
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 1.2rem;
    }
    
    @media (max-width: 768px) { 
      h1 { font-size: 3rem; } 
      .subtitle { font-size: 1rem; }
      .container { padding: 30px 20px; } 
      .grid { grid-template-columns: 1fr; } 
      .section-title { font-size: 1.3rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>💡 LightFrame</h1>
    <p class="subtitle">Custom JavaScript Framework with Virtual DOM, State Management & Routing</p>
    
    <!-- Documentation Section -->
    <div class="docs-section">
      <h2 class="section-title">📚 Documentation</h2>
      <a href="/examples/docs-overview" class="docs-card">
        <h3>📖 API Reference & Guide</h3>
        <p>Complete documentation with examples, API reference, and framework architecture overview</p>
      </a>
    </div>
    
    <!-- Examples Section -->
    <div class="examples-section">
      <h2 class="section-title">🎯 Live Examples</h2>
      <div class="grid">
        ${examples.map(ex => {
          const description = getExampleDescription(ex);
          const isFeatured = ex === 'TodoMVC';
          return `
            <a href="/examples/${ex}" class="card ${isFeatured ? 'featured' : ''}">
              <h3>${ex}</h3>
              <p>${description}</p>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  </div>
</body>
</html>`);
});

// Auto-generate HTML for app.js only examples
function generateAutoHTML(exampleName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${exampleName} - LightFrame</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #d4d0c8; 
      font-family: 'Inter', Arial, sans-serif; 
      min-height: 100vh; 
      padding: 20px; 
    }
    .back-nav {
      position: fixed;
      top: 20px;
      left: 20px;
      z-index: 1000;
    }
    .back-button {
      background: rgba(120,120,120,0.45);
      backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 12px;
      color: #fff;
      padding: 12px 20px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .back-button:hover {
      background: rgba(140,140,140,0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    #app {
      max-width: 1200px;
      margin: 80px auto 20px;
      background: rgba(120,120,120,0.45);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      border: 1.5px solid rgba(255,255,255,0.25);
      padding: 40px;
      box-shadow: 0 8px 32px rgba(31,38,135,0.25);
      min-height: 500px;
    }
  </style>
</head>
<body>
  <div class="back-nav">
    <a href="/" class="back-button">← Back to Examples</a>
  </div>
  
  <div id="app"></div>
  
  <!-- Load framework files -->
  <script src="../../src/core.js"></script>
  <script src="../../src/events.js"></script>
  <script src="../../src/state.js"></script>
  <script src="../../src/router.js"></script>
  <script src="../../src/component.js"></script>
  <script src="../../src/framework.js"></script>
  <script src="../../src/404.js"></script>
  
  <!-- Load app -->
  <script type="module" src="app.js"></script>
</body>
</html>`;
}

// Simple 404 page
function generate404Page(exampleName) {
  return `<!DOCTYPE html>
<html>
<head>
  <title>404 - LightFrame</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      background: #d4d0c8; 
      font-family: 'Inter', Arial, sans-serif; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      padding: 20px; 
    }
    .container { 
      background: rgba(120,120,120,0.45); 
      backdrop-filter: blur(16px); 
      border-radius: 24px; 
      border: 1.5px solid rgba(255,255,255,0.25); 
      padding: 40px; 
      max-width: 600px; 
      width: 100%; 
      box-shadow: 0 8px 32px rgba(31,38,135,0.25); 
      text-align: center;
    }
    h1 { 
      font-size: 4rem; 
      color: #ff6b6b; 
      margin-bottom: 20px; 
      text-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    h2 { 
      color: #fff; 
      margin-bottom: 20px; 
      font-weight: 300;
    }
    p { 
      color: rgba(255,255,255,0.8); 
      margin-bottom: 30px; 
      line-height: 1.5;
    }
    .back-button { 
      background: rgba(255,224,102,0.3); 
      color: #fff; 
      border: 1px solid rgba(255,255,255,0.3); 
      border-radius: 12px; 
      padding: 14px 28px; 
      font-size: 1rem; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      text-decoration: none; 
      display: inline-block; 
      font-weight: 500;
    }
    .back-button:hover { 
      background: rgba(255,224,102,0.4); 
      transform: translateY(-2px); 
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The example "${exampleName}" doesn't exist or has been moved.</p>
    <a href="/" class="back-button">← Back to Home</a>
  </div>
</body>
</html>`;
}

// Route handler for examples
app.get('/examples/:name', (req, res) => {
  const exampleDir = path.join(__dirname, 'examples', req.params.name);
  const htmlPath = path.join(exampleDir, 'index.html');
  const appJsPath = path.join(exampleDir, 'app.js');
  
  if (fs.existsSync(htmlPath)) {
    res.sendFile(htmlPath);
  } else if (fs.existsSync(appJsPath)) {
    res.send(generateAutoHTML(req.params.name));
  } else {
    res.status(404).send(generate404Page(req.params.name));
  }
});

// Handle all other 404s
app.use((req, res) => {
  res.status(404).send(generate404Page('unknown'));
});

app.listen(port, () => {
  console.log(`💡 LightFrame server running at http://localhost:${port}`);
});