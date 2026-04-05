const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else {
      if (dirPath.endsWith('.js') || dirPath.endsWith('.jsx')) {
        callback(dirPath);
      }
    }
  });
}

const mappings = [
  { regex: /\bpl-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'ps-$1' },
  { regex: /\bpr-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'pe-$1' },
  { regex: /\bml-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'ms-$1' },
  { regex: /\bmr-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'me-$1' },
  { regex: /\bleft-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'start-$1' },
  { regex: /\bright-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'end-$1' },
  { regex: /\bborder-l-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'border-s-$1' },
  { regex: /\bborder-r-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'border-e-$1' },
  { regex: /\btext-left\b/g, replace: 'text-start' },
  { regex: /\btext-right\b/g, replace: 'text-end' },
  { regex: /\brounded-l-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-s-$1' },
  { regex: /\brounded-r-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-e-$1' },
  { regex: /\brounded-tl-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-ts-$1' },
  { regex: /\brounded-tr-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-te-$1' },
  { regex: /\brounded-bl-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-bs-$1' },
  { regex: /\brounded-br-([a-zA-Z0-9.\-\/\[\]]+)\b/g, replace: 'rounded-be-$1' }
];

let filesChanged = 0;

walk(srcDir, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  mappings.forEach(m => {
    content = content.replace(m.regex, m.replace);
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
    filesChanged++;
  }
});

console.log(`\nRefactoring complete. ${filesChanged} files modified.`);
