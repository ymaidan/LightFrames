// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from src directory (for your framework files)
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve static files from examples directory
app.use('/examples', express.static(path.join(__dirname, 'examples')));

// Function to get all example directories
function getExamples() {
  const examplesDir = path.join(__dirname, 'examples');
  try {
    return fs.readdirSync(examplesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  } catch (error) {
    console.error('Error reading examples directory:', error);
    return [];
  }
}

// Root route - Show example selector
app.get('/', (req, res) => {
  const examples = getExamples();
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mini Framework - Examples</title>
    <style>
        body {
            background: #d4d0c8;
            margin: 0;
            font-family: 'Inter', Arial, sans-serif;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }
        
        .container {
            background: rgba(120, 120, 120, 0.45);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border-radius: 24px;
            border: 1.5px solid rgba(255, 255, 255, 0.25);
            width: 100%;
            max-width: 900px;
            padding: 40px;
            transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        
        .container:hover {
            box-shadow: 0 12px 48px 0 rgba(31, 38, 135, 0.35);
            transform: translateY(-2px);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 10px;
            font-size: 4rem;
            font-weight: 200;
            color: #fff;
            text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            letter-spacing: 3px;
        }
        
        .subtitle {
            text-align: center;
            margin-bottom: 40px;
            color: rgba(255, 255, 255, 0.9);
            font-size: 1.2rem;
            font-weight: 300;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .examples-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .example-card {
            background: rgba(80, 80, 80, 0.3);
            border-radius: 16px;
            padding: 30px;
            text-decoration: none;
            color: #fff;
            transition: all 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.3);
            backdrop-filter: blur(8px);
            position: relative;
            overflow: hidden;
        }
        
        .example-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, transparent 50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .example-card:hover::before {
            opacity: 1;
        }
        
        .example-card:hover {
            transform: translateY(-8px);
            background: rgba(100, 100, 100, 0.4);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
            border-color: rgba(255, 224, 102, 0.5);
        }
        
        .example-title {
            font-size: 1.4rem;
            font-weight: 500;
            margin-bottom: 12px;
            text-transform: capitalize;
            color: #fff;
            position: relative;
            z-index: 1;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        
        .example-description {
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.6;
            margin-bottom: 15px;
            font-weight: 300;
            position: relative;
            z-index: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .status {
            display: inline-block;
            padding: 8px 16px;
            background: rgba(255, 224, 102, 0.3);
            color: #ffeb3b;
            border-radius: 12px;
            font-size: 0.85rem;
            font-weight: 500;
            border: 1px solid rgba(255, 224, 102, 0.4);
            box-shadow: 0 0 15px rgba(255, 224, 102, 0.2);
            position: relative;
            z-index: 1;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .framework-info {
            text-align: center;
            margin-top: 40px;
            padding-top: 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 0.9);
            font-weight: 300;
        }
        
        .framework-info strong {
            color: #fff;
            font-weight: 500;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        
        .features {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 15px;
        }
        
        .feature {
            color: #ffeb3b;
            font-weight: 400;
            font-size: 0.95rem;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 30px 20px;
            }
            
            h1 {
                font-size: 3rem;
            }
            
            .examples-grid {
                grid-template-columns: 1fr;
            }
            
            .features {
                flex-direction: column;
                gap: 10px;
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .example-card {
            animation: slideIn 0.5s ease forwards;
        }
        
        .example-card:nth-child(2) { animation-delay: 0.1s; }
        .example-card:nth-child(3) { animation-delay: 0.2s; }
        .example-card:nth-child(4) { animation-delay: 0.3s; }
        .example-card:nth-child(5) { animation-delay: 0.4s; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Mini Framework</h1>
        <div class="subtitle">Choose an example to explore framework features</div>
        
        <div class="examples-grid">
            ${examples.map((example, index) => {
              const descriptions = {
                'basic': 'Simple DOM manipulation and component rendering example',
                'component-demo': 'Component system demonstration with reusable components',
                'events-demo': 'Custom event handling system showcase',
                'router-demo': 'Client-side routing and navigation example',
                'TodoMVC': 'Complete TodoMVC implementation using all framework features'
              };
              
              return `
                <a href="/examples/${example}" class="example-card" style="animation-delay: ${index * 0.1}s">
                    <div class="example-title">${example}</div>
                    <div class="example-description">
                        ${descriptions[example] || 'Framework feature demonstration'}
                    </div>
                    <div class="status">Ready to test</div>
                </a>
              `;
            }).join('')}
        </div>
        
        <div class="framework-info">
            <strong>Mini Framework Features:</strong>
            <div class="features">
                <div class="feature">✅ DOM Abstraction</div>
                <div class="feature">✅ State Management</div>
                <div class="feature">✅ Routing System</div>
                <div class="feature">✅ Event Handling</div>
            </div>
        </div>
    </div>
</body>
</html>`;
  
  res.send(html);
});

// Serve individual examples
app.get('/examples/:exampleName', (req, res) => {
  const exampleName = req.params.exampleName;
  const examplePath = path.join(__dirname, 'examples', exampleName, 'index.html');
  
  // Check if example exists
  if (fs.existsSync(examplePath)) {
    res.sendFile(examplePath);
  } else {
    res.status(404).send(`
      <h1>Example not found</h1>
      <p>The example "${exampleName}" doesn't exist.</p>
      <a href="/">← Back to examples</a>
    `);
  }
});

// API endpoint to get available examples (useful for CLI tools)
app.get('/api/examples', (req, res) => {
  const examples = getExamples();
  res.json({ examples });
});

app.listen(port, () => {
    console.log(`🚀 Mini-framework server running at http://localhost:${port}`);
    console.log(`📁 Available examples: ${getExamples().join(', ')}`);
    console.log(`🌐 Visit http://localhost:${port} to choose an example`);
});