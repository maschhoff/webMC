#!/usr/bin/env node

/**
 * WebMC Server — Standalone Node.js backend
 * Serves the frontend and handles all file operations.
 *
 * Usage: node server.js [port]
 *        node server.js 8080 --left /home --right /tmp
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, exec: execCb } = require('child_process');

// Config laden
let CONFIG = { port: 4500, leftPanel: '/', rightPanel: '/' };
const configPath = path.join(__dirname, 'config.json');
try {
  if (fs.existsSync(configPath)) {
    CONFIG = { ...CONFIG, ...JSON.parse(fs.readFileSync(configPath, 'utf-8')) };
    console.log(`📋 Config geladen: ${configPath}`);
  }
} catch (e) {
  console.warn(`⚠️  Config-Fehler: ${e.message}, verwende Defaults`);
}

// Kommandozeilen-Argumente parsen (überschreiben config.json)
const args = process.argv.slice(2);
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--left' && args[i + 1]) CONFIG.leftPanel = args[++i];
  else if (args[i] === '--right' && args[i + 1]) CONFIG.rightPanel = args[++i];
  else if (args[i] === '--help') {
    console.log('WebMC — node server.js [port] [--left <pfad>] [--right <pfad>]');
    process.exit(0);
  } else if (!isNaN(parseInt(args[i], 10))) {
    CONFIG.port = parseInt(args[i], 10);
  }
}

console.log(`📐 Links: ${CONFIG.leftPanel}  Rechts: ${CONFIG.rightPanel}`);

const PORT = CONFIG.port;
const ROOT = __dirname;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
  '.txt':  'text/plain; charset=utf-8',
  '.md':   'text/markdown; charset=utf-8',
};

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function sendError(res, msg, status = 400) {
  sendJSON(res, { error: msg }, status);
}

function safePath(p) {
  // Use the absolute path directly - resolve from / if relative
  if (path.isAbsolute(p)) {
    return path.normalize(p);
  }
  return path.resolve('/', p);
}

/* ============================================================
   API Handlers
   ============================================================ */
function handleList(url, res) {
  const dirPath = url.searchParams.get('path') || '/';
  const abs = safePath(dirPath);

  try {
    const items = fs.readdirSync(abs, { withFileTypes: true });
    const files = items
      .filter(item => !item.name.startsWith('.')) // skip hidden
      .map(item => {
        const fullPath = path.join(abs, item.name);
        let stat;
        try { stat = fs.statSync(fullPath); } catch { return null; }
        if (!stat) return null;
        return {
          name: item.name,
          path: fullPath,
          isDirectory: item.isDirectory(),
          isLink: item.isSymbolicLink(),
          size: stat.size,
          modified: stat.mtimeMs,
          mode: stat.mode,
        };
      })
      .filter(Boolean);

    sendJSON(res, { path: dirPath, files });
  } catch (err) {
    sendError(res, `Kann Verzeichnis nicht lesen: ${err.message}`, 500);
  }
}

function handleStat(url, res) {
  const filePath = url.searchParams.get('path');
  if (!filePath) return sendError(res, 'path required');
  const abs = safePath(filePath);
  try {
    const stat = fs.statSync(abs);
    sendJSON(res, {
      name: path.basename(abs),
      path: abs,
      isDirectory: stat.isDirectory(),
      isLink: stat.isSymbolicLink(),
      size: stat.size,
      modified: stat.mtimeMs,
    });
  } catch { sendJSON(res, null); }
}

function handleMkdir(body, res) {
  if (!body.path) return sendError(res, 'path required');
  const abs = safePath(body.path);
  try {
    fs.mkdirSync(abs, { recursive: true });
    sendJSON(res, { success: true, path: abs });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function handleRemove(body, res) {
  if (!body.paths || !Array.isArray(body.paths)) return sendError(res, 'paths array required');
  try {
    for (const p of body.paths) {
      const abs = safePath(p);
      const stat = fs.lstatSync(abs);
      if (stat.isDirectory()) {
        fs.rmSync(abs, { recursive: true, force: true });
      } else {
        fs.unlinkSync(abs);
      }
    }
    sendJSON(res, { success: true });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function handleMove(body, res) {
  if (!body.sources || !body.dest) return sendError(res, 'sources and dest required');
  const dest = safePath(body.dest);
  try {
    for (const src of body.sources) {
      const abs = safePath(src);
      const name = path.basename(abs);
      const target = path.join(dest, name);
      try {
        // Erst Versuch mit rename (schnell, gleiches Dateisystem)
        fs.renameSync(abs, target);
      } catch (renameErr) {
        // rename schlägt fehl (cross-device) → kopieren + löschen
        const stat = fs.lstatSync(abs);
        if (stat.isDirectory()) {
          cpRecursive(abs, target);
          fs.rmSync(abs, { recursive: true, force: true });
        } else {
          fs.copyFileSync(abs, target);
          fs.unlinkSync(abs);
        }
      }
    }
    sendJSON(res, { success: true });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function handleCopy(body, res) {
  if (!body.sources || !body.dest) return sendError(res, 'sources and dest required');
  const dest = safePath(body.dest);
  try {
    for (const src of body.sources) {
      const abs = safePath(src);
      const name = path.basename(abs);
      const target = path.join(dest, name);
      const stat = fs.lstatSync(abs);
      if (stat.isDirectory()) {
        cpRecursive(abs, target);
      } else {
        fs.copyFileSync(abs, target);
      }
    }
    sendJSON(res, { success: true });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function cpRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const items = fs.readdirSync(src, { withFileTypes: true });
  for (const item of items) {
    const s = path.join(src, item.name);
    const d = path.join(dest, item.name);
    if (item.isDirectory()) cpRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

function handleOpen(body, res) {
  if (!body.path) return sendError(res, 'path required');
  const abs = safePath(body.path);
  try {
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      return sendJSON(res, { type: 'directory' });
    }

    // Check if it's a text file by trying to read as UTF-8
    const ext = path.extname(abs).toLowerCase();
    const textExts = ['.txt','.md','.js','.ts','.py','.go','.rs','.c','.cpp','.h','.hpp','.java','.kt','.swift','.rb','.php','.pl','.lua','.css','.scss','.less','.html','.xml','.json','.yaml','.yml','.toml','.ini','.cfg','.conf','.sh','.bash','.zsh','.fish','.sql','.log','.diff','.patch','.nfo','.rst','.csv','.env','.gitignore','.dockerfile','.conf','.config','.editorconfig','.htaccess','.svg'];
    const isText = textExts.includes(ext);
    const isMedia = /\.(png|jpg|jpeg|gif|webp|bmp|ico|mp4|avi|mkv|mov|mp3|wav|flac|ogg|pdf)$/i.test(ext);

    if (isMedia) {
      // Redirect to raw serve for media
      return sendJSON(res, { type: 'media', url: `/webmc-api/raw?path=${encodeURIComponent(abs)}`, opened: true });
    }

    if (isText) {
      const content = fs.readFileSync(abs, 'utf-8');
      return sendJSON(res, { type: 'text', content, path: abs });
    }

    // Binary unknown: serve as download
    return sendJSON(res, { type: 'binary', url: `/webmc-api/raw?path=${encodeURIComponent(abs)}`, opened: true });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function handleSave(body, res) {
  if (!body.path || body.content === undefined) return sendError(res, 'path and content required');
  const abs = safePath(body.path);
  try {
    fs.writeFileSync(abs, body.content, 'utf-8');
    sendJSON(res, { success: true });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function handleExec(body, res) {
  if (!body.command) return sendError(res, 'command required');
  const cwd = safePath(body.cwd || '/');
  try {
    const result = execSync(body.command, {
      cwd,
      encoding: 'utf-8',
      timeout: 30000,
      maxBuffer: 1024 * 1024,
      shell: '/bin/bash',
    });
    sendJSON(res, { stdout: result, stderr: '', exitCode: 0 });
  } catch (err) {
    sendJSON(res, {
      stdout: err.stdout || '',
      stderr: err.stderr || '',
      exitCode: err.status !== undefined ? err.status : -1,
    });
  }
}

function handleDownload(req, res) {
  let body = '';
  req.on('data', c => { body += c; });
  req.on('end', () => {
    try {
      let paths;
      // JSON oder Form-Data (paths_json)
      const ct = req.headers['content-type'] || '';
      if (ct.includes('application/json')) {
        paths = JSON.parse(body).paths;
      } else {
        const params = new URLSearchParams(body);
        paths = JSON.parse(params.get('paths_json') || '[]');
      }
      if (!paths || !paths.length) return sendError(res, 'paths required');

      // Bei nur einer Datei: direkt ausliefern
      if (paths.length === 1) {
        const abs = safePath(paths[0]);
        const stat = fs.lstatSync(abs);
        if (stat.isDirectory()) return sendError(res, 'Verzeichnisse können nicht einzeln heruntergeladen werden', 400);
        const name = path.basename(abs);
        res.writeHead(200, {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${name}"`,
          'Content-Length': stat.size,
        });
        fs.createReadStream(abs).pipe(res);
        return;
      }

      // Mehrere Dateien: Als TAR.GZ bündeln (kein zip nötig)
      const tmpFile = path.join(require('os').tmpdir(), `webmc-dl-${Date.now()}.tar.gz`);
      const files = paths.map(p => safePath(p));

      const tarCmd = `tar czf "${tmpFile}" -C / ${files.map(f => {
        // relativen Pfad von / aus ermitteln
        const rel = f.startsWith('/') ? f.slice(1) : f;
        return `"${rel}"`;
      }).join(' ')}`;
      execSync(tarCmd, { timeout: 30000, shell: '/bin/bash' });

      const stat = fs.statSync(tmpFile);
      res.writeHead(200, {
        'Content-Type': 'application/gzip',
        'Content-Disposition': `attachment; filename="webmc-download.tar.gz"`,
        'Content-Length': stat.size,
      });
      const stream = fs.createReadStream(tmpFile);
      stream.pipe(res);
      stream.on('end', () => fs.unlinkSync(tmpFile));
    } catch (err) {
      sendError(res, err.message, 500);
    }
  });
}

function handleSearch(url, res) {
  const root = url.searchParams.get('root') || '/';
  const pattern = url.searchParams.get('pattern') || '*';
  const abs = safePath(root);

  // Convert glob-like pattern to regex
  let reStr = '^' + pattern.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
  const re = new RegExp(reStr, 'i');

  try {
    const results = [];
    walkDir(abs, results, re);
    sendJSON(res, { files: results });
  } catch (err) {
    sendError(res, err.message, 500);
  }
}

function walkDir(dir, results, re, depth = 0) {
  if (depth > 10) return; // limit depth
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (re.test(item.name)) {
        try {
          const stat = fs.statSync(fullPath);
          results.push({
            name: item.name,
            path: fullPath,
            isDirectory: item.isDirectory(),
            isLink: item.isSymbolicLink(),
            size: stat.size,
            modified: stat.mtimeMs,
          });
        } catch {}
      }
      if (item.isDirectory() && !item.name.startsWith('.')) {
        walkDir(fullPath, results, re, depth + 1);
      }
    }
  } catch {}
}

function handleUpload(req, res) {
  // Parse multipart form
  const boundary = req.headers['content-type'].split('boundary=')[1];
  if (!boundary) return sendError(res, 'no boundary');

  let raw = Buffer.alloc(0);
  req.on('data', chunk => { raw = Buffer.concat([raw, chunk]); });
  req.on('end', () => {
    try {
      // Simple multipart parser
      const parts = parseMultipart(raw, boundary);
      const filePart = parts.find(p => p.filename);
      const pathPart = parts.find(p => p.name === 'path');

      if (!filePart || !pathPart) return sendError(res, 'file and path required');
      
      const targetDir = safePath(pathPart.data.toString().trim());
      const targetFile = path.join(targetDir, filePart.filename);

      // Prevent overwriting existing files accidentally? Allow for now.
      fs.writeFileSync(targetFile, filePart.data);
      sendJSON(res, { success: true, path: targetFile });
    } catch (err) {
      sendError(res, err.message, 500);
    }
  });
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const delim = Buffer.from('--' + boundary);
  const delimEnd = Buffer.from('--' + boundary + '--');

  let pos = 0;
  while (pos < buffer.length) {
    const start = buffer.indexOf(delim, pos);
    if (start === -1) break;
    const end = buffer.indexOf(Buffer.from('\r\n'), start);
    if (end === -1) break;

    const nextDelim = buffer.indexOf(delim, end + 2);
    if (nextDelim === -1) break;

    // Check if this is the closing delimiter
    if (buffer.slice(start, start + delimEnd.length).equals(delimEnd)) break;

    const section = buffer.slice(end + 2, nextDelim);
    // Section: headers + \r\n\r\n + data
    const headerEnd = section.indexOf('\r\n\r\n');
    if (headerEnd === -1) { pos = nextDelim; continue; }

    const headerStr = section.slice(0, headerEnd).toString();
    const data = section.slice(headerEnd + 4);

    // Strip trailing \r\n
    const cleanData = data.slice(0, data.length - 2 < 0 ? 0 : data.length - 2);

    const part = { data: cleanData };
    // Parse disposition
    const dispMatch = headerStr.match(/Content-Disposition: form-data; name="([^"]+)"(?:; filename="([^"]*)")?/);
    if (dispMatch) {
      part.name = dispMatch[1];
      part.filename = dispMatch[2] || undefined;
    }
    parts.push(part);
    pos = nextDelim;
  }
  return parts;
}

/* ============================================================
   HTTP Server
   ============================================================ */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // CORS / CSP
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ====== API Routes ======
  if (pathname === '/webmc-api/list')       return handleList(url, res);
  if (pathname === '/webmc-api/stat')       return handleStat(url, res);
  if (pathname === '/webmc-api/search')     return handleSearch(url, res);

  if (pathname === '/webmc-api/mkdir' && req.method === 'POST')   return readJSON(req, res, handleMkdir);
  if (pathname === '/webmc-api/remove' && req.method === 'POST') return readJSON(req, res, handleRemove);
  if (pathname === '/webmc-api/move' && req.method === 'POST')   return readJSON(req, res, handleMove);
  if (pathname === '/webmc-api/copy' && req.method === 'POST')   return readJSON(req, res, handleCopy);
  if (pathname === '/webmc-api/open' && req.method === 'POST')   return readJSON(req, res, handleOpen);
  if (pathname === '/webmc-api/save' && req.method === 'POST')   return readJSON(req, res, handleSave);
  if (pathname === '/webmc-api/exec' && req.method === 'POST')   return readJSON(req, res, handleExec);
  if (pathname === '/webmc-api/upload' && req.method === 'POST') return handleUpload(req, res);

  // Config API (gibt dem Client leftPanel/rightPanel)
  if (pathname === '/webmc-api/config') {
    return sendJSON(res, {
      leftPanel: CONFIG.leftPanel,
      rightPanel: CONFIG.rightPanel,
      port: CONFIG.port,
    });
  }

  // Download mehrerer Dateien als ZIP
  if (pathname === '/webmc-api/download' && req.method === 'POST') {
    return handleDownload(req, res);
  }

  // Raw file serving
  if (pathname === '/webmc-api/raw') {
    const filePath = url.searchParams.get('path');
    if (!filePath) return sendError(res, 'path required');
    const abs = safePath(filePath);
    try {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) return sendError(res, 'is a directory');
      const stream = fs.createReadStream(abs);
      res.writeHead(200, {
        'Content-Type': getMimeType(abs),
        'Content-Length': stat.size,
        'Content-Disposition': `inline; filename="${path.basename(abs)}"`,
      });
      stream.pipe(res);
    } catch {
      sendError(res, 'file not found', 404);
    }
    return;
  }

  // ====== Static files ======
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);

  try {
    if (!fs.existsSync(filePath)) {
      filePath = path.join(ROOT, 'index.html');
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': getMimeType(filePath),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

function readJSON(req, res, handler) {
  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      handler(data, res);
    } catch (err) {
      sendError(res, 'Invalid JSON: ' + err.message);
    }
  });
}

server.listen(PORT, () => {
  const addrs = [];
  const os = require('os');
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addrs.push(`http://${iface.address}:${PORT}`);
      }
    }
  }
  addrs.unshift(`http://localhost:${PORT}`);
  console.log(`
╔══════════════════════════════════════════╗
║           WebMC File Manager             ║
║   Midnight-Commander für den Browser     ║
╠══════════════════════════════════════════╣
║  Läuft auf:                              ║
${addrs.map(a => `║  ${a.padEnd(40)}║`).join('\n')}
║                                          ║
║  Tipp: Auf anderen Rechnern kopieren:    ║
║  Ordner "webmc" kopieren, dann:          ║
║  node server.js [port]                   ║
╚══════════════════════════════════════════╝
`);
});
