import http from 'node:http'; // Local development server; Vercel serves the static files directly.
import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = await realpath(fileURLToPath(new URL('.', import.meta.url)));
const args = process.argv.slice(2);
const portFlag = args.findIndex((arg) => arg === '--port');
const inlinePort = args.find((arg) => arg.startsWith('--port='));
const port = Number(portFlag >= 0 ? args[portFlag + 1] : inlinePort?.slice(7) ?? process.env.PORT ?? 3000);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('Cổng không hợp lệ. Dùng --port 3000 hoặc biến môi trường PORT.');
  process.exit(1);
}

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function insideRoot(candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function respond(res, status, message, method) {
  res.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(method === 'HEAD' ? undefined : message);
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    respond(res, 405, 'Phương thức không được hỗ trợ.', req.method);
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname.includes('\0')) throw new Error('Invalid path');
  } catch {
    respond(res, 400, 'Đường dẫn không hợp lệ.', req.method);
    return;
  }

  let filePath = path.resolve(root, pathname.replace(/^[/\\]+/, ''));
  if (!insideRoot(filePath) || pathname.split(/[/\\]/).some((part) => part.startsWith('.'))) {
    respond(res, 403, 'Không được phép truy cập.', req.method);
    return;
  }

  try {
    let info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
    filePath = await realpath(filePath);
    if (!insideRoot(filePath)) {
      respond(res, 403, 'Không được phép truy cập.', req.method);
      return;
    }
    info = await stat(filePath);
    if (!info.isFile()) {
      respond(res, 404, 'Không tìm thấy trang.', req.method);
      return;
    }

    res.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    const stream = createReadStream(filePath);
    stream.on('error', () => res.destroy());
    stream.pipe(res);
  } catch (error) {
    const missing = error.code === 'ENOENT' || error.code === 'ENOTDIR';
    respond(res, missing ? 404 : 500, missing ? 'Không tìm thấy trang.' : 'Không thể đọc tệp.', req.method);
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `Cổng ${port} đang được sử dụng. Thử npm run dev -- --port 3001.` : error.message);
  process.exitCode = 1;
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Trường học Cầu Vồng đang chạy tại http://127.0.0.1:${port}`);
});
