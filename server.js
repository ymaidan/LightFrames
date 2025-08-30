// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files
app.use('/src', express.static('src'));
app.use('/examples', express.static('examples'));

// Get examples
const getExamples = () => {
  try {
    return fs.readdirSync('examples', { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch { return []; }
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
      max-width: 900px; 
      width: 100%; 
      box-shadow: 0 8px 32px rgba(31,38,135,0.25); 
    }
    h1 { 
      text-align: center; 
      font-size: 4rem; 
      font-weight: 200; 
      color: #fff; 
      margin-bottom: 40px; 
      text-shadow: 0 2px 8px rgba(0,0,0,0.3); 
    }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
      gap: 20px; 
    }
    .card { 
      background: rgba(80,80,80,0.3); 
      border: 1px solid rgba(255,255,255,0.3); 
      border-radius: 16px; 
      padding: 20px; 
      transition: all 0.3s ease; 
      text-decoration: none; 
      color: #fff; 
      text-align: center;
    }
    .card:hover { 
      background: rgba(100,100,100,0.4); 
      transform: translateY(-5px); 
      border-color: rgba(255,224,102,0.5); 
    }
    .card h3 { 
      margin-bottom: 8px; 
      text-transform: capitalize; 
    }
    @media (max-width: 768px) { 
      h1 { font-size: 3rem; } 
      .container { padding: 30px 20px; } 
      .grid { grid-template-columns: 1fr; } 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>💡 LightFrame</h1>
    
    <div class="grid">
      ${examples.map(ex => `
        <a href="/examples/${ex}" class="card">
          <h3>${ex}</h3>
        </a>
      `).join('')}
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
  <title>${exampleName} - Mini Framework</title>
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
      padding: 10px 16px;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
    }
    .back-button:hover {
      background: rgba(140,140,140,0.5);
      transform: translateY(-2px);
    }
    #app {
      max-width: 1200px;
      margin: 60px auto 20px;
      background: rgba(120,120,120,0.45);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      border: 1.5px solid rgba(255,255,255,0.25);
      padding: 40px;
      box-shadow: 0 8px 32px rgba(31,38,135,0.25);
    }
  </style>
</head>
<body>
  <div class="back-nav">
    <a href="/" class="back-button">← Back</a>
  </div>
  
  <div id="app"></div>
  
  <!-- Load framework files -->
  <script src="../../src/core.js"></script>
  <script src="../../src/events.js"></script>
  <script src="../../src/state.js"></script>
  <script src="../../src/router.js"></script>
  <script src="../../src/component.js"></script>
  <script src="../../src/framework.js"></script>
  
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
    }
    h2 { 
      color: #fff; 
      margin-bottom: 20px; 
    }
    p { 
      color: rgba(255,255,255,0.8); 
      margin-bottom: 30px; 
    }
    .back-button { 
      background: rgba(255,224,102,0.3); 
      color: #fff; 
      border: 1px solid rgba(255,255,255,0.3); 
      border-radius: 12px; 
      padding: 12px 24px; 
      font-size: 1rem; 
      cursor: pointer; 
      transition: all 0.3s ease; 
      text-decoration: none; 
      display: inline-block; 
    }
    .back-button:hover { 
      background: rgba(255,224,102,0.4); 
      transform: translateY(-2px); 
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>The example "${exampleName}" doesn't exist.</p>
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