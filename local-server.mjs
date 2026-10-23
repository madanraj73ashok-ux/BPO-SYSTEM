import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg' }

createServer(async (req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0])
  const relative = pathname === '/' ? '/index.html' : pathname === '/login' ? '/login.html' : pathname
  const file = normalize(join(root, relative))
  if (!file.startsWith(root)) {
    res.writeHead(400).end('Bad request')
    return
  }
  try {
    let body = await readFile(file)
    if (relative === '/staff.html') {
      body = Buffer.from(body.toString().replace('</body>', '<script src="/staff-enhancements.js"></script></body>'))
    }
    if (relative === '/index.html') {
      body = Buffer.from(body.toString().replace('</body>', '<script src="/admin-enhancements.js"></script></body>'))
    }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
    res.end(body)
  } catch {
    res.writeHead(404).end('Not found')
  }
}).listen(3000, '127.0.0.1', () => console.log('BPO Operations Desk local UI: http://127.0.0.1:3000'))
