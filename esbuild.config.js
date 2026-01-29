// esbuild.config.js
require('dotenv').config({ path: './.env.production' });
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const distDir = 'dist';

// Clean the dist directory before building to save space and ensure fresh assets
if (fs.existsSync(distDir)){
    fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir);

// Copy index.html and index.css to dist
fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(distDir, 'index.html'));
fs.copyFileSync(path.join(__dirname, 'index.css'), path.join(distDir, 'index.css'));

// Copy public assets (images, etc.) if they exist
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    // Node 16.7.0+ supports fs.cpSync
    if (fs.cpSync) {
        fs.cpSync(publicDir, distDir, { recursive: true });
    } else {
        // Fallback for older node versions (simple recursive copy)
        function copyRecursiveSync(src, dest) {
            const exists = fs.existsSync(src);
            const stats = exists && fs.statSync(src);
            const isDirectory = exists && stats.isDirectory();
            if (isDirectory) {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest);
                fs.readdirSync(src).forEach((childItemName) => {
                    copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        }
        copyRecursiveSync(publicDir, distDir);
    }
}

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: true,
  sourcemap: true,
  target: ['es2020'],
  define: {
    'process.env.API_KEY': `"${process.env.API_KEY}"`,
    'process.env.GOOGLE_CLIENT_ID': `"${process.env.GOOGLE_CLIENT_ID}"`,
  },
  loader: {
    '.tsx': 'tsx'
  }
}).then(() => {
  console.log('Build finished successfully!');
  
  // Fix index.html for production deployment
  const indexPath = path.join(distDir, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove the importmap script (dependencies are bundled in bundle.js)
  html = html.replace(/<script type="importmap">[\s\S]*?<\/script>/g, '');
  
  // Replace /index.tsx with /bundle.js
  html = html.replace(/<script type="module" src="\/index\.tsx"><\/script>/g, 
    '<script src="/bundle.js"></script>');
  
  // Save the modified index.html
  fs.writeFileSync(indexPath, html);
  console.log('index.html patched for production!');
  
}).catch(() => process.exit(1));
