// Documentation viewer functionality
async function loadDoc(docType) {
  const viewer = document.getElementById('doc-viewer');
  const title = document.getElementById('doc-title');
  const content = document.getElementById('doc-content');
  
  // Show viewer
  viewer.style.display = 'block';
  
  // Set title
  const titles = {
    'overview': '📚 Framework Overview',
    'api': '⚙️ API Reference',
    'examples': '💡 Code Examples'
  };
  
  title.textContent = titles[docType] || 'Documentation';
  
  // Show loading
  content.innerHTML = '<div class="loading">📖 Loading documentation...</div>';
  
  try {
    // Load the corresponding markdown file
    const response = await fetch(`/docs/${docType === 'overview' ? 'README' : docType.toUpperCase()}.md`);
    const text = await response.text();
    
    // Convert markdown to HTML (simple conversion)
    const html = convertMarkdownToHTML(text);
    content.innerHTML = html;
    
    // Scroll to top
    content.scrollTop = 0;
    
  } catch (error) {
    content.innerHTML = `
      <div class="error">
        <h3>❌ Error Loading Documentation</h3>
        <p>Could not load the documentation file. Please try again later.</p>
        <p><strong>Error:</strong> ${error.message}</p>
      </div>
    `;
  }
}

function closeDoc() {
  document.getElementById('doc-viewer').style.display = 'none';
}

function showQuickStart() {
  document.getElementById('quick-start').style.display = 'block';
}

function closeQuickStart() {
  document.getElementById('quick-start').style.display = 'none';
}

// Simple markdown to HTML converter
function convertMarkdownToHTML(markdown) {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
  
  // Convert bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert code blocks
  html = html.replace(/```(.*?)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
  html = html.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Convert links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = '<p>' + html + '</p>';
  
  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><h/g, '<h');
  html = html.replace(/<\/h([1-6])><\/p>/g, '</h$1>');
  html = html.replace(/<p><pre/g, '<pre');
  html = html.replace(/<\/pre><\/p>/g, '</pre>');
  
  return html;
}

// Add some interactive features
document.addEventListener('DOMContentLoaded', function() {
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeDoc();
      closeQuickStart();
    }
  });
  
  // Add click outside to close
  document.addEventListener('click', function(e) {
    const viewer = document.getElementById('doc-viewer');
    const quickStart = document.getElementById('quick-start');
    
    if (e.target === viewer) {
      closeDoc();
    }
    
    if (e.target === quickStart) {
      closeQuickStart();
    }
  });
}); 