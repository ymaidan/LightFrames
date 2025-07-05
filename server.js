// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from src directory (for your framework files)
app.use('/src', express.static(path.join(__dirname, 'src')));

// Serve static files from examples directory
app.use('/examples', express.static(path.join(__dirname, 'examples')));

// Redirect root to basic example
app.get('/', (req, res) => {
    res.redirect('/examples/basic');
});

// Serve the basic example
app.get('/examples/basic', (req, res) => {
    res.sendFile(path.join(__dirname, 'examples/basic/index.html'));
});

app.listen(port, () => {
    console.log(`Mini-framework server running at http://localhost:${port}`);
});