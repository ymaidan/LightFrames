#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

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

function showMenu() {
  const examples = getExamples();
  
  console.log('\n🚀 Mini Framework - Example Selector\n');
  console.log('Available examples:');
  examples.forEach((example, index) => {
    console.log(`  ${index + 1}. ${example}`);
  });
  console.log(`  ${examples.length + 1}. Open browser to choose`);
  console.log('  0. Exit\n');
  
  process.stdout.write('Select an example (number): ');
}

function startServer(example = null) {
  const command = 'npm start';
  console.log('🚀 Starting server...');
  
  const server = exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error starting server:', error);
      return;
    }
  });
  
  // Wait a moment then open the URL
  setTimeout(() => {
    const url = example 
      ? `http://localhost:3000/examples/${example}`
      : 'http://localhost:3000';
    
    console.log(`\n🌐 Opening: ${url}`);
    
    // Try to open browser (works on most systems)
    const openCommand = process.platform === 'darwin' ? 'open' : 
                       process.platform === 'win32' ? 'start' : 'xdg-open';
    
    exec(`${openCommand} ${url}`, (err) => {
      if (err) {
        console.log(`Please open your browser and visit: ${url}`);
      }
    });
  }, 2000);
  
  return server;
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.length > 0) {
  const exampleName = args[0];
  const examples = getExamples();
  
  if (examples.includes(exampleName)) {
    startServer(exampleName);
  } else {
    console.log(`❌ Example "${exampleName}" not found.`);
    console.log(`Available: ${examples.join(', ')}`);
  }
} else {
  // Interactive mode
  const examples = getExamples();
  
  showMenu();
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (input) => {
    const choice = parseInt(input.trim());
    
    if (choice === 0) {
      console.log('👋 Goodbye!');
      process.exit(0);
    } else if (choice > 0 && choice <= examples.length) {
      const selectedExample = examples[choice - 1];
      console.log(`\n✅ Starting ${selectedExample}...`);
      startServer(selectedExample);
    } else if (choice === examples.length + 1) {
      console.log('\n✅ Opening example browser...');
      startServer();
    } else {
      console.log('❌ Invalid choice. Please try again.');
      showMenu();
    }
  });
} 