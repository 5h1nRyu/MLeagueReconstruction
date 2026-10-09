import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: {
  directory: { type: 'string', default: '.' },
  port: { type: 'string', default: '4174' },
  base: { type: 'string', default: '/MLeagueReconstruction/' },
} });
const root = resolve(values.directory);
const base = values.base;
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp' };

// Intentionally refuse site-root assets and SPA fallbacks: Pages has neither.
createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (!pathname.startsWith(base)) { response.writeHead(404).end(); return; }
    const relative = pathname.slice(base.length) || 'index.html';
    const file = resolve(root, relative);
    if (!file.startsWith(root + sep)) { response.writeHead(404).end(); return; }
    const contents = await readFile(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : contents);
  } catch {
    response.writeHead(404).end();
  }
}).listen(Number(values.port), '127.0.0.1');
