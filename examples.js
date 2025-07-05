#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('child_process');

const getExamples = () => {
  try {
    return fs.readdirSync('examples', { withFileTypes: true })
      .filter(d => d.isDirectory()).map(d => d.name);
  } catch { return []; }
};

const startServer = (example = null) => {
  console.log('🚀 Starting server...');
  exec('npm start');
  
  setTimeout(() => {
    const url = example ? `http://localhost:3000/examples/${example}` : 'http://localhost:3000';
    console.log(`🌐 Opening: ${url}`);
    
    const cmd = process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`, err => err && console.log(`Visit: ${url}`));
  }, 2000);
};

const showMenu = () => {
  const examples = getExamples();
  console.log('\n💡 LightFrame - Example Selector\n');
  console.log('  0. 📚 Documentation');
  examples.forEach((ex, i) => console.log(`  ${i + 1}. ${ex}`));
  console.log(`  ${examples.length + 2}. Open browser\n  q. Exit\n`);
  process.stdout.write('Select: ');
};

// Handle command line args
const [arg] = process.argv.slice(2);
if (arg) {
  if (['docs', 'documentation'].includes(arg)) {
    startServer('docs-overview');
  } else if (getExamples().includes(arg)) {
    startServer(arg);
  } else {
    console.log(`❌ Not found: ${arg}\nAvailable: docs, ${getExamples().join(', ')}`);
  }
} else {
  // Interactive mode
  const examples = getExamples();
  showMenu();
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', input => {
    const choice = input.trim();
    
    if (['q', 'quit'].includes(choice)) {
      console.log('👋 Goodbye!');
      process.exit(0);
    } else if (choice === '0') {
      console.log('✅ Opening Documentation...');
      startServer('docs-overview');
    } else {
      const num = parseInt(choice);
      if (num > 0 && num <= examples.length) {
        console.log(`✅ Starting ${examples[num - 1]}...`);
        startServer(examples[num - 1]);
      } else if (num === examples.length + 2) {
        console.log('✅ Opening browser...');
        startServer();
      } else {
        console.log('❌ Invalid choice');
        showMenu();
      }
    }
  });
} 