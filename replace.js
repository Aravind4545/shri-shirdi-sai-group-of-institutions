const fs = require('fs');
const path = require('path');

function replaceInDir(dir, searchUrls, replaceUrl) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, searchUrls, replaceUrl);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const search of searchUrls) {
        if (content.includes(search)) {
          content = content.split(search).join(replaceUrl);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

const frontendDir = path.join(__dirname, 'frontend/src');
const mobileDir = path.join(__dirname, 'mobile');
const searchUrls = ['http://localhost:5001', 'http://192.168.29.35:5001', 'http://10.75.234.230:5001'];
const newUrl = 'https://shri-shirdi-sai-group-of-institutions.onrender.com';

console.log('Replacing old API URLs with new Render URL...');
replaceInDir(frontendDir, searchUrls, newUrl);
replaceInDir(mobileDir, searchUrls, newUrl);
console.log('Done!');
