const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Pattern to find fetch('/api/...') and replace with fetch(import.meta.env.VITE_API_URL + '/api/...')
            // We need to be careful with template literals and normal strings.
            
            // 1. fetch('/api/...') -> fetch(`${import.meta.env.VITE_API_URL || ''}/api/...`)
            const regex1 = /fetch\((['"])\/api\//g;
            if (content.match(regex1)) {
                content = content.replace(regex1, "fetch(`${import.meta.env.VITE_API_URL || ''}/api/");
                // we also need to close the template literal, but it's tricky if they used quotes.
            }

            // Instead of complex regex, let's just define a global variable in index.html or replace carefully.
        }
    }
}
