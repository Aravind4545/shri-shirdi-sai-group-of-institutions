const fs = require('fs');
const path = require('path');

const replacements = [
  // Sri Shirdi Sai -> Academic Companion
  { regex: /sri shirdi sai/gi, replaceFn: (match) => match === match.toUpperCase() ? 'ACADEMIC COMPANION' : (match[0] === 'S' ? 'Academic Companion' : 'academic companion') },
  // Lakshya -> IIT
  { regex: /lakshya/gi, replaceFn: (match) => match === match.toUpperCase() ? 'IIT' : (match[0] === 'L' ? 'IIT' : 'iit') },
  // Deekshya -> NEET
  { regex: /deekshya/gi, replaceFn: (match) => match === match.toUpperCase() ? 'NEET' : (match[0] === 'D' ? 'NEET' : 'neet') },
  // Dafne -> UPSC
  { regex: /dafne/gi, replaceFn: (match) => match === match.toUpperCase() ? 'UPSC' : (match[0] === 'D' ? 'UPSC' : 'upsc') },
];

function processFile(fullPath) {
  let content = fs.readFileSync(fullPath, 'utf8');
  let changed = false;

  for (const { regex, replaceFn } of replacements) {
    if (regex.test(content)) {
      content = content.replace(regex, replaceFn);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Updated:', fullPath);
  }
}

function processDirectory(dir) {
  if (!fs.existsSync(dir) || dir.includes('node_modules') || dir.includes('.git') || dir.includes('dist') || dir.includes('.vite')) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else {
      const ext = path.extname(fullPath);
      if (['.ts', '.tsx', '.js', '.json', '.html', '.md', '.css'].includes(ext)) {
        // Exclude package-lock.json and this script itself
        if (file === 'package-lock.json' || file === 'rebrand.js') continue;
        processFile(fullPath);
      }
    }
  }
}

console.log('Starting mass replace...');
processDirectory(__dirname);
console.log('Mass replace complete.');
