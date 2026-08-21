const fs = require('fs');
const path = require('path');

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

// 3. Process script.js to inject Environment Variables
if (fs.existsSync('script.js')) {
  let scriptContent = fs.readFileSync('script.js', 'utf8');

  // Replace placeholders with Vercel environment variables if they exist
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (supabaseUrl) {
    scriptContent = scriptContent.replace(
      /const SUPABASE_URL = ".*";/,
      `const SUPABASE_URL = "${supabaseUrl}";`
    );
  }
  
  if (supabaseKey) {
    scriptContent = scriptContent.replace(
      /const SUPABASE_KEY = ".*";/,
      `const SUPABASE_KEY = "${supabaseKey}";`
    );
  }

  fs.writeFileSync(path.join('public', 'script.js'), scriptContent);
}

console.log('Static public directory created successfully with ENV variables injected!');
