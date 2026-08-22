const fs = require('fs');
const path = require('path');

// Sanitize values before injecting into JavaScript string literals
// Prevents code injection if environment variables are compromised
function sanitizeForJSString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

// 1. Create public directory
fs.mkdirSync('public', { recursive: true });

// 2. Copy pure static files
const staticFiles = ['index.html', 'style.css', 'favicon.svg'];
staticFiles.forEach(f => {
  if (fs.existsSync(f)) fs.copyFileSync(f, path.join('public', f));
});
if (fs.existsSync('images')) {
  fs.cpSync('images', path.join('public', 'images'), { recursive: true });
}

// 3. Process script.js to inject Environment Variables (with sanitization)
if (fs.existsSync('script.js')) {
  let scriptContent = fs.readFileSync('script.js', 'utf8');

  // Replace placeholders with Vercel environment variables if they exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl) {
    scriptContent = scriptContent.replace(
      /const SUPABASE_URL = ".*";/,
      `const SUPABASE_URL = "${sanitizeForJSString(supabaseUrl)}";`
    );
  }
  
  if (supabaseKey) {
    scriptContent = scriptContent.replace(
      /const SUPABASE_KEY = ".*";/,
      `const SUPABASE_KEY = "${sanitizeForJSString(supabaseKey)}";`
    );
  }

  fs.writeFileSync(path.join('public', 'script.js'), scriptContent);
}

console.log('Static public directory created successfully with ENV variables injected!');

