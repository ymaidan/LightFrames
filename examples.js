#!/usr/bin/env node
const fs = require('fs');
const { exec } = require('child_process');

// Production examples only (filter out development/test folders)
const productionExamples = ['basic', 'component-demo', 'events-demo', 'router-demo', 'TodoMVC'];

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

const startServer = (example = null) => {
  console.log('🚀 Starting LightFrame server...');
  exec('npm start');
  
  setTimeout(() => {
    const url = example ? `http://localhost:3000/examples/${example}` : 'http://localhost:3000';
    console.log(`🌐 Opening: ${url}`);
    
    const cmd = process.platform === 'darwin' ? 'open' : 
                process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${cmd} ${url}`, err => err && console.log(`📱 Visit: ${url}`));
  }, 2000);
};

const getExampleDescription = (name) => {
  const descriptions = {
    'TodoMVC': '⭐ Complete TodoMVC implementation (Featured)',
    'basic': '🎯 Simple counter with state management',
    'component-demo': '🧩 Reusable components demonstration',
    'events-demo': '⚡ Custom event system showcase',
    'router-demo': '🧭 Hash-based routing with parameters'
  };
  return descriptions[name] || '📦 Framework demonstration';
};

const showMenu = () => {
  const examples = getExamples();
  
  console.clear();
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                   💡 LightFrame                              ║');
  console.log('║              Interactive Example Selector                    ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  console.log('');
  
  // Documentation section
  console.log('📚 DOCUMENTATION:');
  console.log('  0. 📖 API Reference & Framework Guide');
  console.log('');
  
  // Examples section
  console.log('🎯 LIVE EXAMPLES:');
  examples.forEach((ex, i) => {
    const description = getExampleDescription(ex);
    console.log(`  ${i + 1}. ${description}`);
  });
  console.log('');
  
  // Actions section
  console.log('🌐 NAVIGATION:');
  console.log(`  ${examples.length + 2}. 🏠 Open main page (All examples)`);
  console.log('  q. ❌ Exit');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  process.stdout.write('👉 Select an option: ');
};

const showSuccess = (message, example = null) => {
  console.log('');
  console.log('✅ ' + message);
  if (example) {
    console.log(`🎯 Starting: ${example}`);
    console.log(`📱 URL: http://localhost:3000/examples/${example}`);
  } else {
    console.log('🏠 Opening main page');
    console.log('📱 URL: http://localhost:3000');
  }
  console.log('⏳ Server starting... Please wait...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
};

// Handle command line args
const [arg] = process.argv.slice(2);
if (arg) {
  if (['docs', 'documentation', 'api', 'docs-overview'].includes(arg)) {
    console.log('📖 Opening Documentation...');
    startServer('docs-overview');
  } else if (getExamples().includes(arg)) {
    console.log(`🎯 Opening ${arg}...`);
    startServer(arg);
  } else {
    console.log('❌ Example not found: ' + arg);
    console.log('');
    console.log('📋 Available options:');
    console.log('   📚 docs, documentation, api  → Documentation');
    getExamples().forEach(ex => console.log(`   🎯 ${ex.padEnd(20)} → ${getExampleDescription(ex).replace(/[⭐🎯🧩⚡🧭📦]/g, '').trim()}`));
    console.log('');
    console.log('💡 Usage: node examples.js [option]');
    console.log('💡 Or run: node examples.js (for interactive menu)');
  }
} else {
  // Interactive mode
  const examples = getExamples();
  showMenu();
  
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', input => {
    const choice = input.trim().toLowerCase();
    
    if (['q', 'quit', 'exit'].includes(choice)) {
      console.log('');
      console.log('┌─────────────────────────────────────────┐');
      console.log('│  👋 Thanks for using LightFrame!        │');
      console.log('│  🌟 Star us on GitHub if you liked it!  │');
      console.log('└─────────────────────────────────────────┘');
      process.exit(0);
    } else if (choice === '0') {
      showSuccess('Opening Documentation', 'docs-overview');
      startServer('docs-overview');
    } else {
      const num = parseInt(choice);
      if (num > 0 && num <= examples.length) {
        const selectedExample = examples[num - 1];
        showSuccess(`Launching ${selectedExample}`, selectedExample);
        startServer(selectedExample);
      } else if (num === examples.length + 2) {
        showSuccess('Opening main page');
        startServer();
      } else {
        console.log('');
        console.log('❌ Invalid choice. Please try again.');
        setTimeout(showMenu, 1000);
      }
    }
  });
}