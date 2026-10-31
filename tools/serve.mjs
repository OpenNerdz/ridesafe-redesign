// Local preview server: node tools/serve.mjs [root=dist] [port=8702]
// Serves dir/index.html for clean URLs and 404.html (status 404) for anything missing, like a static host.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const [root = 'dist', port = '8702'] = process.argv.slice(2);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain',
};
http.createServer((req, res) => {
  const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(root, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!p.endsWith('/')) { res.writeHead(301, { location: `${p}/` }); res.end(); return; }
    f = path.join(f, 'index.html');
  }
  let status = 200;
  if (!fs.existsSync(f)) { f = path.join(root, '404.html'); status = 404; }
  res.writeHead(status, { 'content-type': types[path.extname(f)] ?? 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(Number(port), '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/`));
