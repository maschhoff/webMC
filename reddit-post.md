# I built WebMC, a no-dependency browser-based file manager inspired by Midnight Commander – and it works completely offline

**TL;DR:** A portable web-based dual-panel file manager (like MC/Krusader) that runs on plain Node.js. No npm, no bundler, no Docker needed unless you want it. Just `node server.js` and you're good.

---

## The backstory

I love Midnight Commander. There's something incredibly satisfying about the dual-panel layout, keyboard-driven navigation, and the sheer efficiency of F-keys. But I kept running into the same problem: MC isn't always available on the machines I work on, and installing it on every system gets old fast.

I wanted something that checks ALL of these boxes:

- Dual panels (left/right, like MC)
- Keyboard-first navigation (F-keys, arrow keys, Tab, Insert for marking)
- Completely portable – copy ONE folder, run `node server.js`, done
- Zero dependencies. Not even a `package.json`
- Works on any machine with Node.js (Linux, macOS, Windows)
- Modern dark theme, not a time machine UI
- Actually useful features: file operations, terminal, search, inline editing

So I spent some evenings and built **WebMC**.

## What it does

Two panels side by side. Navigate with arrow keys, switch panels with Tab. Mark files with Insert. F5 copies to the other panel, F6 moves, F7 makes directories, F8 deletes, F3/F4 opens or edits files inline. Just like MC.

But it also has things MC doesn't:

- **Built-in terminal** (Ctrl+O) – opens a shell in the current directory right in the browser
- **Drag & drop upload** – drag files from your desktop into the browser
- **Right-click context menu** – all actions available without memorizing keys
- **Realtime search** (Ctrl+R) – recursive search with patterns
- **Download files** – single files or multiple as a tar.gz archive
- **Button bar** – all F-keys as clickable buttons at the bottom
- **Inline editor** – edit text files directly in the browser with save

## The tech

Dead simple. A single Node.js HTTP server (no Express, no frameworks) serves HTML/CSS/JS and exposes about a dozen API endpoints:

- `/webmc-api/list` – list directory contents
- `/webmc-api/copy` – copy files or directories
- `/webmc-api/move` – move (cross-device safe, falls back to copy+delete)
- `/webmc-api/remove` – delete
- `/webmc-api/open` – opens files with system default
- `/webmc-api/save` – save edited content
- `/webmc-api/search` – recursive file search
- `/webmc-api/exec` – run shell commands
- `/webmc-api/upload` – file upload
- `/webmc-api/raw` – raw file download
- `/webmc-api/config` – configuration endpoint

The frontend is a single-page app with vanilla JavaScript. State management, rendering, keyboard handling, all in one file. Tokyo Night dark theme (because every file manager deserves to look good).

## The portability story

The entire project lives in one folder. Copy it anywhere, run it.

```
webmc/
├── config.json      ← port + start directories
├── index.html       ← UI
├── style.css        ← Tokyo Night theme
├── app.js           ← frontend logic
├── server.js        ← backend server
├── install.sh       ← optional setup script
├── Dockerfile       ← optional container build
└── README.md
```

**To run it:**
```bash
node server.js
# Opens on http://localhost:4500
```

**To change port or start directories:**
```bash
node server.js 8080 --left /home --right /tmp
# Or edit config.json
```

**With Docker:**
```bash
docker build -t webmc .
docker run -p 4500:4500 -e WEBMC_LEFT=/home -e WEBMC_RIGHT=/tmp webmc
```

No npm install. No build step. No `node_modules`. It's literally from the `from scratch` meme but actually real.

## Why not just use MC?

If MC is installed and you have SSH access to everything – use MC. It's better, faster, and has decades of polish.

WebMC fills different niches:

1. **Machines without MC** – minimal containers, fresh servers, embedded systems
2. **Shared environments** – access via browser, no SSH key setup needed
3. **Quick file ops** – spin it up, do what you need, kill it
4. **Teaching/onboarding** – visual file manager for people intimidated by the terminal
5. **Remote management** – expose it on a local port and access from your phone/tablet

## What I learned

Building something that's "just MC but in a browser" turned out to be harder than expected:

- **Keyboard handling is a maze** – F-keys in browsers? `e.preventDefault()` + `e.stopPropagation()` every single time, and even then some keys (F1 for help, F5/F6 for refresh) fight back
- **Cross-device moves** – `fs.renameSync()` fails silently across filesystem boundaries. Had to implement a copy+delete fallback
- **Dual-panel state** – keeping two independent directory states synced without flickering or race conditions took a few rewrites
- **No dependencies is a constraint** – every feature has to be implemented in pure Node.js. Want zip downloads? No, you get tar.gz because `zip` isn't always installed. Willing to write a zip library from scratch? I wasn't.

## Links

- **GitHub:** [github.com/openclaw/webmc](https://github.com/openclaw/webmc) (not yet, but soon)
- **Try it:** Download the tar.gz, unzip, `node server.js`, open browser

## What would you add?

I've got a list of things I'm considering:

- [ ] SSH remote panel (connect to another machine as a panel)
- [ ] FUSE mount support
- [ ] Image preview thumbnails
- [ ] Bookmark sidebar
- [ ] File conflict resolution dialog
- [ ] S3/cloud storage as a panel

What would make this useful for *your* workflow?

---

*Built with Node.js, vanilla JS, and late-night stubbornness.*
