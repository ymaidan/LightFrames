// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files
app.use('/src', express.static('src'));
app.use('/examples', express.static('examples'));
app.use('/docs', express.static('docs'));

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
  const descriptions = {
    'basic': 'Simple DOM manipulation example',
    'component-demo': 'Reusable component system',
    'events-demo': 'Custom event handling showcase',
    'router-demo': 'Client-side routing demo',
    'TodoMVC': 'Complete TodoMVC implementation'
  };

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
      margin-bottom: 10px; 
      text-shadow: 0 2px 8px rgba(0,0,0,0.3); 
    }
    .subtitle { 
      text-align: center; 
      color: rgba(255,255,255,0.9); 
      margin-bottom: 10px; 
      font-size: 1.2rem; 
    }
    .instruction { 
      text-align: center; 
      color: rgba(255,255,255,0.8); 
      margin-bottom: 40px; 
      font-size: 1rem; 
    }
    .docs { 
      background: rgba(102,51,153,0.3); 
      border: 1px solid rgba(147,51,234,0.4); 
      border-radius: 16px; 
      padding: 25px; 
      text-align: center; 
      margin-bottom: 30px; 
      transition: all 0.3s ease; 
    }
    .docs:hover { 
      background: rgba(102,51,153,0.4); 
      transform: translateY(-5px); 
    }
    .docs a { 
      color: #a855f7; 
      text-decoration: none; 
      font-weight: 500; 
      font-size: 1.1rem; 
    }
    .grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
      gap: 20px; 
      margin-bottom: 30px; 
    }
    .card { 
      background: rgba(80,80,80,0.3); 
      border: 1px solid rgba(255,255,255,0.3); 
      border-radius: 16px; 
      padding: 20px; 
      transition: all 0.3s ease; 
      text-decoration: none; 
      color: #fff; 
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
    .card p { 
      color: rgba(255,255,255,0.8); 
      font-size: 0.9rem; 
      margin-bottom: 10px; 
    }
    .badge { 
      background: rgba(255,224,102,0.3); 
      color: #ffeb3b; 
      padding: 4px 8px; 
      border-radius: 8px; 
      font-size: 0.8rem; 
    }
    .features-text { 
      text-align: center; 
      color: rgba(255,255,255,0.8); 
      font-size: 0.9rem; 
      margin-top: 20px; 
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
    <p class="subtitle">Lightweight JavaScript framework</p>
    <p class="instruction">Choose example to explore the framework</p>
    
    <div class="docs">
      <a href="/examples/docs-overview">📚 Documentation & API Reference</a>
    </div>
    
    <div class="grid">
      ${examples.filter(ex => ex !== 'docs-overview').map(ex => `
        <a href="/examples/${ex}" class="card">
          <h3>${ex}</h3>
          <p>${descriptions[ex] || 'Framework demonstration'}</p>
          <span class="badge">Ready to test</span>
        </a>
      `).join('')}
    </div>
    
    <p class="features-text">
      Features: DOM Abstraction • State Management • Routing System • Event Handling
    </p>
  </div>
</body>
</html>`);
});

// Serve examples
app.get('/examples/:name', (req, res) => {
  const filePath = path.join(__dirname, 'examples', req.params.name, 'index.html');
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    // Send 404 page using your framework
    res.status(404).send(`
<!DOCTYPE html>
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
      font-size: 1.1rem; 
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
    <h2>Example Not Found</h2>
    <p>The example "${req.params.name}" doesn't exist.</p>
    <a href="/" class="back-button">← Back to Examples</a>
  </div>
</body>
</html>`);
  }
});

// Handle all other 404s
app.use((req, res) => {
  res.status(404).send(`
<!DOCTYPE html>
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
      font-size: 1.1rem; 
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
    <p>The page you're looking for doesn't exist.</p>
    <a href="/" class="back-button">← Back to Home</a>
  </div>
</body>
</html>`);
});

app.listen(port, () => {
  console.log(`💡 LightFrame server running at http://localhost:${port}`);
  console.log(`📁 Available: ${getExamples().join(', ')}`);
});