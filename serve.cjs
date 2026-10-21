const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, 'skincity');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.resolve(root, '.' + pathname);
    if ((file !== root && !file.startsWith(root + path.sep)) || pathname.split(/[\\/]/).some(part => part.startsWith('.'))) {
      res.writeHead(403); return res.end('Forbidden');
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      const index = path.join(file, 'index.html');
      if (fs.existsSync(index)) file = index;
      else if (fs.existsSync(file + '.html')) file += '.html';
    }
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file) || !fs.statSync(file).isFile() || /\.php\d*$/i.test(file)) {
      res.writeHead(404); return res.end('Not found');
    }
    res.setHeader('Content-Type', types[path.extname(file)] || (path.extname(file) ? 'application/octet-stream' : 'text/html; charset=utf-8'));
    fs.createReadStream(file).pipe(res);
  } catch {
    res.writeHead(400); res.end('Bad request');
  }
}).listen(3000, '127.0.0.1', () => console.log('Skin City running at http://127.0.0.1:3000'));
