const fs = require('node:fs');
const path = require('node:path');

const source = path.join(__dirname, 'skincity');
const output = path.join(__dirname, 'dist');
let count = 0;

function copyDirectory(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    // Apache configuration, editor files, and PHP source are not static assets.
    if (entry.name.startsWith('.') || /\.php\d*$/i.test(entry.name)) continue;
    const input = path.join(from, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(input, path.join(to, entry.name));
    } else if (entry.isFile()) {
      const name = path.extname(entry.name) ? entry.name : `${entry.name}.html`;
      if (name !== entry.name && fs.existsSync(path.join(from, name))) {
        throw new Error(`Conflicting HTML page: ${input}`);
      }
      fs.copyFileSync(input, path.join(to, name));
      count++;
    }
  }
}

copyDirectory(source, output);
console.log(`Built ${count} static files in dist/`);
