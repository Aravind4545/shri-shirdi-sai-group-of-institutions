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

            // Replace single quotes
            if (content.match(/'http:\/\/localhost:5001/)) {
                content = content.replace(/'http:\/\/localhost:5001([^']*)'/g, '`http://${window.location.hostname}:5001$1`');
                modified = true;
            }
            // Replace double quotes
            if (content.match(/"http:\/\/localhost:5001/)) {
                content = content.replace(/"http:\/\/localhost:5001([^"]*)"/g, '`http://${window.location.hostname}:5001$1`');
                modified = true;
            }
            // Replace backticks
            if (content.match(/`http:\/\/localhost:5001/)) {
                content = content.replace(/`http:\/\/localhost:5001([^`]*)`/g, '`http://${window.location.hostname}:5001$1`');
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
