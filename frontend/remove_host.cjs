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

            // Using proxy, we just need `/api` or `/uploads`
            const searchPattern = /`http:\/\/\$\{window\.location\.hostname\}:5001(\/api|\/uploads)([^`]*)`/g;
            if (content.match(searchPattern)) {
                content = content.replace(searchPattern, "'$1$2'");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log('Updated', fullPath);
            }
        }
    }
}

replaceInFiles('d:/Shirdi Sai/frontend/src');
console.log('Done.');
