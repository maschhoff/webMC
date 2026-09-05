/**
 * WebMC — Modern Midnight-Commander-Style Web File Manager
 * Single-file JS app. No dependencies.
 */

"use strict";

/* ============================================================
   Configuration
   ============================================================ */
const API_BASE = window.location.origin;
const FILE_ICONS = {
  directory: '📁', updir: '📂', file: '📄', image: '🖼️',
  archive: '📦', exec: '⚡', video: '🎬', audio: '🎵',
  link: '🔗', code: '💻', text: '📝', pdf: '📕',
};
const SIZE_UNITS = ['B', 'K', 'M', 'G', 'T'];

/* ============================================================
   Internationalization (i18n)
   ============================================================ */
let lang = 'en';

const L = {
  en: {
    langName: 'English',
    entries: 'entries',
    error: 'Error',
    opened: 'Opened',
    ready: 'Ready',
    help: 'Help',
    rename: 'Rename',
    view: 'View',
    edit: 'Edit',
    copy: 'Copy',
    move: 'Move',
    paste: 'Paste',
    mkdir: 'Directory',
    delete: 'Delete',
    terminal: 'Terminal',
    exit: 'Exit',
    saved: 'Saved!',
    save: '💾 Save',
    close: '✕ Close',
    allMarked: 'All marked',
    unmarked: 'Selection cleared',
    inverted: 'Selection inverted',
    search: 'Search files (pattern, e.g. *.txt):',
    noResults: 'No results',
    results: 'Results',
    newDir: 'New directory:',
    created: 'Created',
    deleted: 'deleted',
    confirmDelete: 'Delete',
    confirmDeleteMultiple: 'files delete?',
    copied: 'copied to',
    moved: 'moved to',
    sameDir: 'Source and destination are identical!',
    renameTo: 'Rename to:',
    download: 'Download',
    downloaded: 'files as archive',
    downloadFailed: 'Download failed',
    uploaded: 'uploaded',
    failed: 'failed',
    unknown: 'Unknown',
    sourceDestIdentical: 'Source and destination are identical!',
    closeWebMC: 'Close WebMC?',
    terminalCwd: 'Terminal',
    terminalHint: 'Enter a command (Enter). "exit" to close.',
    terminalError: 'Error',
    cmdPwd: 'Path',
    sortName: 'Name',
    sortSize: 'Size',
    sortDate: 'Date',
    statusInfo: 'Ctrl+O: Terminal · F10: Exit',
    contextOpen: '📁 Open',
    contextEdit: '📝 Edit',
    contextCopy: '📋 Copy (F5)',
    contextMove: '✂️ Move (F6)',
    contextPaste: '📌 Paste',
    contextRename: '✏️ Rename',
    contextDelete: '🗑️ Delete (F8)',
    contextMkdir: '📁 New Directory (F7)',
    contextSearch: '🔍 Search (Ctrl+R)',
    contextDownload: '⬇️ Download',
    contextTerminal: '🖥️ Terminal (Ctrl+O)',
    contextUpload: '⬆️ Datei(en) hochladen',
    uploadHere: 'Dateien werden hochgeladen nach',
    uploadStarted: 'wird hochgeladen…',
    helpTitle: 'WebMC Keyboard Shortcuts:',
    helpF1: '  F1        Help',
    helpF2: '  F2        Rename',
    helpF3: '  F3        View file',
    helpF4: '  F4        Edit',
    helpF5: '  F5        Copy',
    helpF6: '  F6        Move',
    helpF7: '  F7        New directory',
    helpF8: '  F8        Delete',
    helpF9: '  F9        Terminal',
    helpF10: '  F10       Exit',
    helpTab: '  Tab       Switch panel',
    helpEnter: '  Enter     Open directory / file',
    helpArrow: '  ↑/↓       Move cursor',
    helpPage: '  PgUp/PgDn Page up/down',
    helpHome: '  Home/End  Beginning/End',
    helpIns: '  Ins       Toggle mark',
    helpPlus: '  +         Mark all',
    helpBSlash: '  \\        Invert selection',
    helpCtrlO: '  Ctrl+O    Terminal',
    helpCtrlR: '  Ctrl+R    Search',
    helpCtrlBS: '  Ctrl+\\   Invert selection',
    helpAltEnter: '  Alt+Enter Open in other panel',
  },
  de: {
    langName: 'Deutsch',
    entries: 'Einträge',
    error: 'Fehler',
    opened: 'Geöffnet',
    ready: 'Bereit',
    help: 'Hilfe',
    rename: 'Umbenennen',
    view: 'Anzeigen',
    edit: 'Bearbeiten',
    copy: 'Kopieren',
    move: 'Verschieben',
    paste: 'Einfügen',
    mkdir: 'Verzeichnis',
    delete: 'Löschen',
    terminal: 'Terminal',
    exit: 'Beenden',
    saved: 'Gespeichert!',
    save: '💾 Speichern',
    close: '✕ Schließen',
    allMarked: 'Alle markiert',
    unmarked: 'Markierung aufgehoben',
    inverted: 'Auswahl umgekehrt',
    search: 'Dateisuche (Muster, z.B. *.txt):',
    noResults: 'Keine Treffer',
    results: 'Treffer',
    newDir: 'Neues Verzeichnis:',
    created: 'Erstellt',
    deleted: 'gelöscht',
    confirmDelete: 'Löschen:',
    confirmDeleteMultiple: 'Dateien löschen?',
    copied: 'kopiert nach',
    moved: 'verschoben nach',
    sameDir: 'Quelle und Ziel sind identisch!',
    renameTo: 'Umbenennen in:',
    download: 'Download',
    downloaded: 'Dateien als Archiv',
    downloadFailed: 'Download fehlgeschlagen',
    uploaded: 'hochgeladen',
    failed: 'fehlgeschlagen',
    unknown: 'Unbekannt',
    sourceDestIdentical: 'Quelle und Ziel sind identisch!',
    closeWebMC: 'WebMC schließen?',
    terminalCwd: 'Terminal',
    terminalHint: 'Geben Sie einen Befehl ein (Enter). "exit" zum Schließen.',
    terminalError: 'Fehler',
    cmdPwd: 'Pfad',
    sortName: 'Name',
    sortSize: 'Größe',
    sortDate: 'Datum',
    statusInfo: 'Ctrl+O: Terminal · F10: Beenden',
    contextOpen: '📁 Öffnen',
    contextEdit: '📝 Bearbeiten',
    contextCopy: '📋 Kopieren (F5)',
    contextMove: '✂️ Verschieben (F6)',
    contextPaste: '📌 Einfügen',
    contextRename: '✏️ Umbenennen',
    contextDelete: '🗑️ Löschen (F8)',
    contextMkdir: '📁 Verzeichnis anlegen (F7)',
    contextSearch: '🔍 Suchen (Strg+R)',
    contextDownload: '⬇️ Herunterladen',
    contextTerminal: '🖥️ Terminal (Strg+O)',
    contextUpload: '⬆️ Datei(en) hochladen',
    uploadHere: 'Dateien werden hochgeladen nach',
    uploadStarted: 'wird hochgeladen…',
    helpTitle: 'WebMC Tastenkürzel:',
    helpF1: '  F1        Hilfe',
    helpF2: '  F2        Umbenennen',
    helpF3: '  F3        Datei anzeigen',
    helpF4: '  F4        Bearbeiten',
    helpF5: '  F5        Kopieren',
    helpF6: '  F6        Verschieben',
    helpF7: '  F7        Verzeichnis anlegen',
    helpF8: '  F8        Löschen',
    helpF9: '  F9        Terminal',
    helpF10: '  F10       Beenden',
    helpTab: '  Tab       Panel wechseln',
    helpEnter: '  Enter     Verzeichnis öffnen / Datei',
    helpArrow: '  ↑/↓       Cursor bewegen',
    helpPage: '  PgUp/PgDn Seite',
    helpHome: '  Home/End  Anfang/Ende',
    helpIns: '  Ins       Markieren',
    helpPlus: '  +         Alle markieren',
    helpBSlash: '  \\        Auswahl umkehren',
    helpCtrlO: '  Ctrl+O    Terminal',
    helpCtrlR: '  Ctrl+R    Suchen',
    helpCtrlBS: '  Ctrl+\\   Markierung umkehren',
    helpAltEnter: '  Alt+Enter In anderem Panel öffnen',
  },
};

function t(key) {
  if (L[lang] && L[lang][key] !== undefined) return L[lang][key];
  if (L['en'][key] !== undefined) return L['en'][key];
  return key;
}

/* Apply language to all static UI elements */
function applyLanguage() {
  // Status bar
  const infoEl = document.getElementById('status-info');
  if (infoEl) infoEl.textContent = t('statusInfo');
  const msgEl = document.getElementById('status-center');
  if (msgEl) msgEl.textContent = t('ready');

  // Column headers
  $$('.sort-header[data-label]').forEach(h => {
    const field = h.dataset.sort;
    const labelKey = 'sort' + field.charAt(0).toUpperCase() + field.slice(1);
    const label = t(labelKey);
    h.dataset.label = label;
    // Determine if active, keep arrow
    const side = h.closest('.panel') === el.left ? 'left' : 'right';
    if (field === state.panels[side].sortBy) {
      h.textContent = state.panels[side].sortDir === 1 ? `${label} ▲` : `${label} ▼`;
    } else {
      h.textContent = label;
    }
  });
}

/* ============================================================
   State
   ============================================================ */
const state = {
  activePanel: 'left',
  panels: {
    left:  { path: '/', files: [], cursor: 0, scroll: 0, marked: new Set(), sortBy: 'name', sortDir: 1 },
    right: { path: '/', files: [], cursor: 0, scroll: 0, marked: new Set(), sortBy: 'name', sortDir: 1 },
  },
  cmdHistory: [],
  cmdHistoryIdx: -1,
  clipboard: null,
  terminal: { output: '', cwd: '' },
  activeContextMenu: null,
};

/* ============================================================
   DOM refs
   ============================================================ */
const $ = (s, p) => (p||document).querySelector(s);
const $$ = (s, p) => [...(p||document).querySelectorAll(s)];
const el = {};

function cacheDom() {
  el.left = $('#panel-left'); el.right = $('#panel-right');
  el.listingL = $('#listing-left'); el.listingR = $('#listing-right');
  el.titleL = $('#title-left'); el.titleR = $('#title-right');
  el.infoL = $('#info-left'); el.infoR = $('#info-right');
  el.cmdInput = $('#cmdline-input');
  el.termOv = $('#terminal-overlay'); el.termOut = $('#terminal-output');
  el.termInput = $('#terminal-input'); el.termClose = $('#terminal-close');
  el.toast = $('#toast-container'); el.statusMsg = $('#status-center');
}

/* ============================================================
   API calls
   ============================================================ */
async function apiList(path) {
  const p = path === '/' ? '/' : path.replace(/\/$/, '');
  const r = await fetch(`${API_BASE}/webmc-api/list?path=${encodeURIComponent(p)}`);
  if (!r.ok) throw new Error(`API error: ${r.status}`);
  return r.json();
}

async function apiMkdir(path) {
  const r = await fetch(`${API_BASE}/webmc-api/mkdir`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify({path}) });
  if (!r.ok) throw new Error((await r.json()).error || 'mkdir failed');
  return r.json();
}

async function apiRemove(paths) {
  const r = await fetch(`${API_BASE}/webmc-api/remove`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify({paths}) });
  if (!r.ok) throw new Error((await r.json()).error || 'remove failed');
  return r.json();
}

async function apiMove(sources, dest) {
  const r = await fetch(`${API_BASE}/webmc-api/move`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify({sources, dest}) });
  if (!r.ok) throw new Error((await r.json()).error || 'move failed');
  return r.json();
}

async function apiCopy(sources, dest) {
  const r = await fetch(`${API_BASE}/webmc-api/copy`, { method:'POST',
    headers:{'Content-Type':'application/json'}, body:JSON.stringify({sources, dest}) });
  if (!r.ok) throw new Error((await r.json()).error || 'copy failed');
  return r.json();
}

async function apiConfig() {
  const r = await fetch(`${API_BASE}/webmc-api/config`);
  if (!r.ok) return null;
  return r.json();
}

async function apiDownload(paths) {
  const r = await fetch(`${API_BASE}/webmc-api/download`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({paths})
  });
  if (!r.ok) throw new Error((await r.json()).error || 'download failed');
  // Return the URL for direct download
  return r;
}

async function apiSearch(root, pattern) {
  const r = await fetch(`${API_BASE}/webmc-api/search?root=${encodeURIComponent(root)}&pattern=${encodeURIComponent(pattern)}`);
  if (!r.ok) throw new Error((await r.json()).error || 'search failed');
  return r.json();
}

async function apiOpen(path) {
  const r = await fetch(`${API_BASE}/webmc-api/open`, {
    method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({path})
  });
  if (!r.ok) throw new Error((await r.json()).error || 'open failed');
  return r.json();
}

async function apiSave(path, content) {
  const r = await fetch(`${API_BASE}/webmc-api/save`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({path, content})
  });
  if (!r.ok) throw new Error((await r.json()).error || 'save failed');
  return r.json();
}

async function apiExec(cmd, cwd) {
  const r = await fetch(`${API_BASE}/webmc-api/exec`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({command: cmd, cwd})
  });
  if (!r.ok) throw new Error(`exec error: ${r.status}`);
  return r.json();
}

/* ============================================================
   Utility
   ============================================================ */
function formatSize(bytes) {
  if (bytes === null || bytes === undefined) return '';
  let i = 0; let s = bytes;
  while (s >= 1024 && i < SIZE_UNITS.length-1) { s /= 1024; i++; }
  return i === 0 ? `${s} B` : `${s.toFixed(1)} ${SIZE_UNITS[i]}`;
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const p = n => String(n).padStart(2,'0');
  return `${p(d.getDate())}.${p(d.getMonth()+1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function basename(p) { return p.replace(/\/$/,'').split('/').filter(Boolean).pop() || '/'; }

function dirname(p) {
  if (p === '/') return '/';
  const parts = p.replace(/\/$/,'').split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/') || '/';
}

function joinPath(...parts) {
  return parts.map(p => p.replace(/^\/|\/$/g,'')).filter(Boolean).join('/');
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function toast(msg, type='info') {
  const d = document.createElement('div');
  d.className = `toast ${type}`;
  d.textContent = msg;
  el.toast.appendChild(d);
  setTimeout(() => d.remove(), 3000);
}

/* File type detection */
function getFileType(name, isDir, isLink) {
  if (isLink) return 'link';
  if (isDir) return 'directory';
  if (/\.(png|jpg|jpeg|gif|webp|svg|bmp|ico)$/i.test(name)) return 'image';
  if (/\.(zip|tar|gz|bz2|xz|rar|7z)$/i.test(name)) return 'archive';
  if (/\.(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(name)) return 'video';
  if (/\.(mp3|wav|flac|ogg|aac|m4a)$/i.test(name)) return 'audio';
  if (!/\./.test(name) || /\.(sh|bin|run|appimage)$/i.test(name)) return 'exec';
  if (/\.(js|ts|py|go|rs|c|cpp|h|java|rb|php|css|html|json|xml|yaml|yml|sh|bash|sql)$/i.test(name)) return 'code';
  if (/\.(txt|md|rst|log|diff|patch|nfo)$/i.test(name)) return 'text';
  if (/\.pdf$/i.test(name)) return 'pdf';
  return 'file';
}

function getIcon(ft) { return FILE_ICONS[ft] || FILE_ICONS.file; }

/* ============================================================
   Panel Rendering
   ============================================================ */
function renderPanel(side) {
  const panel = state.panels[side];
  const listing = side === 'left' ? el.listingL : el.listingR;
  const title = side === 'left' ? el.titleL : el.titleR;
  const info = side === 'left' ? el.infoL : el.infoR;

  title.textContent = panel.path;
  info.textContent = `${panel.files.length} ${t('entries')}`;

  let html = '';
  if (panel.path !== '/') {
    html += `<div class="file-entry updir" data-path="${dirname(panel.path)}" data-type="updir">`;
    html += `<span class="icon">${FILE_ICONS.updir}</span><span class="name">..</span>`;
    html += `<span class="size"></span><span class="date"></span></div>`;
  }

  const sorted = [...panel.files].sort((a,b) => {
    if (a.isDirectory && !b.isDirectory) return -1;
    if (!a.isDirectory && b.isDirectory) return 1;
    const dir = panel.sortDir;
    switch (panel.sortBy) {
      case 'date':
        const da = a.modified || 0, db = b.modified || 0;
        return dir * (da - db);
      case 'size':
        const sa = a.isDirectory ? 0 : (a.size || 0);
        const sb = b.isDirectory ? 0 : (b.size || 0);
        return dir * (sa - sb);
      default:
        return dir * (a.name||'').localeCompare(b.name||'');
    }
  });

  for (const f of sorted) {
    const ft = getFileType(f.name, f.isDirectory, f.isLink);
    const cls = `file-entry ${ft}${panel.marked.has(f.path) ? ' marked' : ''}`;
    html += `<div class="${cls}" data-path="${f.path}" data-type="${ft}" data-name="${f.name}">`;
    html += `<span class="icon">${getIcon(ft)}</span>`;
    html += `<span class="name">${escapeHtml(f.name)}${f.isLink ? ' →' : ''}</span>`;
    html += `<span class="size">${f.isDirectory ? '' : formatSize(f.size)}</span>`;
    html += `<span class="date">${formatDate(f.modified)}</span></div>`;
  }

  listing.innerHTML = html;
  requestAnimationFrame(() => { listing.scrollTop = panel.scroll; });
}

function refreshPanel(side) {
  const panel = state.panels[side];
  panel.scroll = (side === 'left' ? el.listingL : el.listingR).scrollTop;
  apiList(panel.path).then(d => {
    panel.files = d.files || [];
    renderPanel(side);
    applyCursor(side);
  }).catch(e => toast(`${t('error')}: ${e.message}`, 'error'));
}

function refreshBoth() { refreshPanel('left'); refreshPanel('right'); }

/* ============================================================
   Cursor
   ============================================================ */
function applyCursor(side) {
  const panel = state.panels[side];
  const listing = side === 'left' ? el.listingL : el.listingR;
  $$('.file-entry', listing).forEach((e,i) => e.classList.toggle('cursor', i===panel.cursor));
  const ce = $$('.file-entry', listing)[panel.cursor];
  if (ce) {
    const r = ce.getBoundingClientRect(), lr = listing.getBoundingClientRect();
    if (r.bottom > lr.bottom-4) ce.scrollIntoView({block:'end',behavior:'smooth'});
    else if (r.top < lr.top+4) ce.scrollIntoView({block:'start',behavior:'smooth'});
  }
}

function setActivePanel(side) {
  state.activePanel = side;
  el.left.classList.toggle('active-panel', side==='left');
  el.right.classList.toggle('active-panel', side==='right');
  const listing = side==='left' ? el.listingL : el.listingR;
  listing.focus();
  updateSortHeaders(side);
}

/* ============================================================
   Sorting
   ============================================================ */
function toggleSort(side, field) {
  const panel = state.panels[side];
  if (panel.sortBy === field) {
    panel.sortDir *= -1;
  } else {
    panel.sortBy = field;
    panel.sortDir = 1;
  }
  panel.cursor = 0;
  panel.marked.clear();
  renderPanel(side);
  applyCursor(side);
  updateSortHeaders(side);
}

function updateSortHeaders(side) {
  const header = side === 'left' ? $$('.sort-header', el.left) : $$('.sort-header', el.right);
  header.forEach(h => {
    const field = h.dataset.sort;
    h.classList.toggle('active', field === state.panels[side].sortBy);
    if (field === state.panels[side].sortBy) {
      h.textContent = state.panels[side].sortDir === 1 ? `${h.dataset.label} ▲` : `${h.dataset.label} ▼`;
    } else {
      h.textContent = h.dataset.label;
    }
  });
}

function getActivePanel() { return state.activePanel; }
function getActiveState() { return state.panels[getActivePanel()]; }

function getCursorFile(side) {
  const listing = side==='left' ? el.listingL : el.listingR;
  const e = $$('.file-entry', listing)[state.panels[side].cursor];
  if (!e) return null;
  return { path: e.dataset.path, name: e.dataset.name, type: e.dataset.type, el: e };
}

/* ============================================================
   Navigation
   ============================================================ */
function cursorUp(side) {
  if (state.panels[side].cursor > 0) state.panels[side].cursor--;
  applyCursor(side);
}

function cursorDown(side) {
  const listing = side==='left' ? el.listingL : el.listingR;
  const n = $$('.file-entry', listing).length;
  if (state.panels[side].cursor < n-1) state.panels[side].cursor++;
  applyCursor(side);
}

function cursorPageUp(side) {
  const listing = side==='left' ? el.listingL : el.listingR;
  const page = Math.floor(listing.clientHeight/24)-1;
  state.panels[side].cursor = Math.max(0, state.panels[side].cursor - page);
  applyCursor(side);
}

function cursorPageDown(side) {
  const listing = side==='left' ? el.listingL : el.listingR;
  const n = $$('.file-entry', listing).length;
  const page = Math.floor(listing.clientHeight/24)-1;
  state.panels[side].cursor = Math.min(n-1, state.panels[side].cursor + page);
  applyCursor(side);
}

function cursorHome(side) { state.panels[side].cursor = 0; applyCursor(side); }

function cursorEnd(side) {
  const listing = side==='left' ? el.listingL : el.listingR;
  state.panels[side].cursor = $$('.file-entry', listing).length - 1;
  applyCursor(side);
}

function enterDir(side) {
  const cf = getCursorFile(side);
  if (!cf) return;
  if (cf.type === 'updir') {
    state.panels[side].path = dirname(state.panels[side].path);
    state.panels[side].cursor = 0;
    state.panels[side].marked.clear();
    refreshPanel(side); return;
  }
  if (cf.type === 'directory') {
    state.panels[side].path = cf.path;
    state.panels[side].cursor = 0;
    state.panels[side].marked.clear();
    refreshPanel(side); return;
  }
  openFile(cf.path);
}

async function openFile(path) {
  try {
    const r = await apiOpen(path);
    if (r.opened) return;
    if (r.type === 'text' && r.content !== undefined) showInlineEditor(path, r.content);
    else toast(`${t('opened')}: ${basename(path)}`, 'success');
  } catch(e) { toast(`${t('error')}: ${e.message}`, 'error'); }
}

function openInOtherPanel() {
  const cf = getCursorFile(getActivePanel());
  if (!cf) return;
  const other = getActivePanel() === 'left' ? 'right' : 'left';
  const panel = state.panels[other];
  panel.path = cf.type === 'updir' ? dirname(cf.path)
    : cf.type === 'directory' ? cf.path
    : dirname(cf.path);
  panel.cursor = 0; panel.marked.clear();
  setActivePanel(other); refreshPanel(other);
}

/* ============================================================
   Marking
   ============================================================ */
function toggleMark(side) {
  const cf = getCursorFile(side);
  if (!cf) return;
  const panel = state.panels[side];
  if (panel.marked.has(cf.path)) { panel.marked.delete(cf.path); cf.el.classList.remove('marked'); }
  else { panel.marked.add(cf.path); cf.el.classList.add('marked'); }
  cursorDown(side);
}

function markAll(side) {
  const panel = state.panels[side];
  const listing = side==='left'?el.listingL:el.listingR;
  $$('.file-entry', listing).forEach(e => {
    if (e.dataset.path && e.dataset.type !== 'updir') { panel.marked.add(e.dataset.path); e.classList.add('marked'); }
  });
  updateStatusMsg(t('allMarked'));
}

function unmarkAll(side) {
  state.panels[side].marked.clear();
  const listing = side==='left'?el.listingL:el.listingR;
  $$('.file-entry', listing).forEach(e => e.classList.remove('marked'));
  updateStatusMsg(t('unmarked'));
}

function markInvert(side) {
  const panel = state.panels[side];
  const listing = side==='left'?el.listingL:el.listingR;
  $$('.file-entry', listing).forEach(e => {
    const p = e.dataset.path;
    if (!p || e.dataset.type === 'updir') return;
    if (panel.marked.has(p)) { panel.marked.delete(p); e.classList.remove('marked'); }
    else { panel.marked.add(p); e.classList.add('marked'); }
  });
  updateStatusMsg(t('inverted'));
}

function downloadAction() {
  const side = getActivePanel();
  const items = getMarkedOrCurrent(side);
  if (!items.length) return;
  const sideName = side === 'left' ? 'left' : 'right';
  
  if (items.length === 1) {
    // Einzeldatei: direkter Download
    const url = `${API_BASE}/webmc-api/raw?path=${encodeURIComponent(items[0])}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = basename(items[0]);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast(`Download: ${basename(items[0])}`, 'success');
  } else {
    // Mehrere Dateien: via fetch und Blob-Download
    downloadAsZip(items);
  }
}

async function downloadAsZip(paths) {
  try {
    const r = await fetch(`${API_BASE}/webmc-api/download`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths }),
    });
    if (!r.ok) throw new Error(t('downloadFailed'));
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'webmc-download.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast(`${paths.length} ${t('downloaded')}`, 'success');
  } catch (e) {
    toast(e.message, 'error');
  }
}

function getMarkedOrCurrent(side) {
  const panel = state.panels[side];
  if (panel.marked.size > 0) return [...panel.marked];
  const cf = getCursorFile(side);
  return cf ? [cf.path] : [];
}

/* ============================================================
   File Operations
   ============================================================ */
function refreshBothDelayed() {
  setTimeout(() => refreshBoth(), 100);
}

function mkdirAction() {
  const name = prompt(t('newDir'));
  if (!name) return;
  const fullPath = joinPath(getActiveState().path, name);
  apiMkdir(fullPath).then(() => { toast(t('created')+': '+name, 'success'); refreshBothDelayed(); })
    .catch(e => toast(e.message, 'error'));
}

function deleteAction() {
  const side = getActivePanel();
  const items = getMarkedOrCurrent(side);
  if (!items.length) return;
  if (!confirm(items.length===1 ? `${t('confirmDelete')} ${basename(items[0])}?` : `${items.length} ${t('confirmDeleteMultiple')}`)) return;
  apiRemove(items).then(() => {
    toast(`${items.length} ${t('deleted')}`, 'success');
    state.panels[side].marked.clear();
    refreshBothDelayed();
  }).catch(e => toast(e.message, 'error'));
}

function copyAction() {
  // Direktes Kopieren: Ziel ist das andere Panel
  const items = getMarkedOrCurrent(getActivePanel());
  if (!items.length) return;
  const side = getActivePanel();
  const otherSide = side === 'left' ? 'right' : 'left';
  const dest = state.panels[otherSide].path;
  if (dest === state.panels[side].path) {
    toast(t('sourceDestIdentical'), 'error');
    return;
  }
  apiCopy(items, dest).then(() => {
    toast(`${items.length} ${t('copied')} ${basename(dest)}`, 'success');
    state.panels[side].marked.clear();
    refreshBoth();
  }).catch(e => toast(e.message, 'error'));
}

function moveAction() {
  // Direktes Verschieben: Ziel ist das andere Panel
  const items = getMarkedOrCurrent(getActivePanel());
  if (!items.length) return;
  const side = getActivePanel();
  const otherSide = side === 'left' ? 'right' : 'left';
  const dest = state.panels[otherSide].path;
  if (dest === state.panels[side].path) {
    toast(t('sourceDestIdentical'), 'error');
    return;
  }
  apiMove(items, dest).then(() => {
    toast(`${items.length} ${t('moved')} ${basename(dest)}`, 'success');
    state.panels[side].marked.clear();
    refreshBoth();
  }).catch(e => toast(e.message, 'error'));
}

function pasteAction() {
  // Paste macht dasselbe wie copyAction - Legacy-Unterstützung
  copyAction();
}

function renameAction() {
  const cf = getCursorFile(getActivePanel());
  if (!cf) return;
  const old = cf.name || basename(cf.path);
  const nu = prompt(t('renameTo'), old);
  if (!nu || nu === old) return;
  apiMove([cf.path], joinPath(dirname(cf.path), nu)).then(() => {
    toast(`${old} → ${nu}`, 'success');
    state.panels[getActivePanel()].marked.clear();
    refreshBothDelayed();
  }).catch(e => toast(e.message, 'error'));
}

function editFileAction() {
  const cf = getCursorFile(getActivePanel());
  if (!cf) return;
  if (cf.type === 'directory' || cf.type === 'updir') { enterDir(getActivePanel()); return; }
  openFile(cf.path);
}

function showInlineEditor(path, content) {
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:600;display:flex;flex-direction:column;padding:10px;';
  overlay.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:6px 10px;background:#24253a;border-bottom:1px solid #3b3f5c;">
      <span style="color:#7aa2f7;font-weight:bold;">${escapeHtml(path)}</span>
      <div>
        <button id="ed-save" style="background:#9ece6a;color:#1a1b26;border:none;padding:4px 14px;border-radius:3px;cursor:pointer;margin-right:6px;">${t('save')}</button>
        <button id="ed-close" style="background:#f7768e;color:#fff;border:none;padding:4px 14px;border-radius:3px;cursor:pointer;">${t('close')}</button>
      </div>
    </div>
    <textarea id="ed-ta" style="flex:1;background:#1a1b26;color:#c0caf5;border:none;outline:none;resize:none;padding:12px;font-family:inherit;font-size:13px;tab-size:2;">${escapeHtml(content)}</textarea>`;
  document.body.appendChild(overlay);
  const ta = overlay.querySelector('#ed-ta');
  ta.focus();
  overlay.querySelector('#ed-close').onclick = () => overlay.remove();
  overlay.querySelector('#ed-save').onclick = async () => {
    try { await apiSave(path, ta.value); toast(t('saved'), 'success'); overlay.remove(); }
    catch(e) { toast(e.message, 'error'); }
  };
  ta.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.remove();
    if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') overlay.querySelector('#ed-save').click();
  });
}

function openTerminalHere() { openTerminal(getActiveState().path); }

/* ============================================================
   Search
   ============================================================ */
function searchAction() {
  const pattern = prompt(t('search'));
  if (!pattern) return;
  apiSearch(state.panels[getActivePanel()].path, pattern).then(r => {
    if (!r.files.length) { toast(t('noResults'), 'info'); return; }
    showSearchResults(r.files);
  }).catch(e => toast(e.message, 'error'));
}

function showSearchResults(files) {
  const side = getActivePanel();
  const panel = state.panels[side];
  panel.path = `🔍 ${files.length} ${t('results')}`;
  panel.cursor = 0; panel.marked.clear();
  const listing = side==='left'?el.listingL:el.listingR;
  const title = side==='left'?el.titleL:el.titleR;
  const info = side==='left'?el.infoL:el.infoR;
  title.textContent = panel.path;
  info.textContent = `${files.length} ${t('results')}`;
  let html = '';
  for (const f of files) {
    const ft = getFileType(f.name, f.isDirectory, f.isLink);
    html += `<div class="file-entry ${ft}" data-path="${f.path}" data-type="${ft}">
      <span class="icon">${getIcon(ft)}</span>
      <span class="name">${escapeHtml(f.path.replace(/.*\//,'') || f.name)}</span>
      <span class="size">${f.isDirectory?'':formatSize(f.size)}</span>
      <span class="date">${formatDate(f.modified)}</span></div>`;
  }
  listing.innerHTML = html;
  applyCursor(side);
}

/* ============================================================
   Terminal
   ============================================================ */
function openTerminal(cwd) {
  el.termOv.classList.remove('hidden');
  el.termOut.textContent = '';
  el.termInput.value = '';
  el.termInput.focus();
  state.terminal.cwd = cwd || '/';
  state.terminal.output = '';
  writeTerm(`Terminal: ${state.terminal.cwd}\n`);
  writeTerm('Geben Sie einen Befehl ein (Enter). "exit" zum Schließen.\n');
  writeTerm('─'.repeat(50)+'\n\n');
}

function closeTerminal() { el.termOv.classList.add('hidden'); }

function writeTerm(text) {
  state.terminal.output += text;
  el.termOut.textContent = state.terminal.output;
  el.termOut.scrollTop = el.termOut.scrollHeight;
}

async function execTerminalCommand(cmd) {
  if (!cmd.trim()) { writeTerm('\n'); return; }
  if (cmd === 'exit' || cmd === 'quit') { closeTerminal(); return; }
  writeTerm(`$ ${cmd}\n`);
  try {
    const r = await apiExec(cmd, state.terminal.cwd);
    if (r.stdout) writeTerm(r.stdout);
    if (r.stderr) writeTerm(r.stderr);
    if (!r.stdout && !r.stderr) writeTerm(`[Exit: ${r.exitCode}]\n`);
  } catch(e) { writeTerm(`Fehler: ${e.message}\n`); }
  writeTerm('\n');
}

/* ============================================================
   Cmdline
   ============================================================ */
function updateStatusMsg(msg) { el.statusMsg.textContent = msg; }

function executeCmdline(cmd) {
  if (!cmd.trim()) return;
  state.cmdHistory.push(cmd);
  state.cmdHistoryIdx = state.cmdHistory.length;
  const parts = cmd.trim().split(/\s+/);
  const main = parts[0].toLowerCase();
  const args = parts.slice(1);
  const side = getActivePanel();
  el.cmdInput.value = '';

  switch (main) {
    case 'cd':
      if (args.length) {
        let np = args[0];
        if (!np.startsWith('/')) np = joinPath(state.panels[side].path, np);
        state.panels[side].path = np;
        state.panels[side].cursor = 0;
        state.panels[side].marked.clear();
        refreshBoth();
      }
      break;
    case 'ls': refreshBoth(); break;
    case 'mkdir':
      if (args.length) apiMkdir(joinPath(state.panels[side].path, args[0]))
        .then(() => { toast('Erstellt: '+args[0], 'success'); refreshBoth(); }).catch(e=>toast(e.message,'error'));
      break;
    case 'rm': case 'del': deleteAction(); break;
    case 'cp': copyAction(); break;
    case 'mv': moveAction(); break;
    case 'paste': pasteAction(); break;
    case 'ren': case 'rename': renameAction(); break;
    case 'find': case 'search': searchAction(); break;
    case 'pwd': toast(state.panels[side].path, 'info'); break;
    case 'help': showHelp(); break;
    case 'quit': case 'exit': if (confirm('WebMC schließen?')) window.close(); break;
    default:
      toast(`Unbekannt: ${main}`, 'error');
  }
}

function showHelp() {
  const help = `${t('helpTitle')}\n${t('helpF1')}\n${t('helpF2')}\n${t('helpF3')}\n${t('helpF4')}\n${t('helpF5')}\n${t('helpF6')}\n${t('helpF7')}\n${t('helpF8')}\n${t('helpF9')}\n${t('helpF10')}\n${t('helpTab')}\n${t('helpEnter')}\n${t('helpArrow')}\n${t('helpPage')}\n${t('helpHome')}\n${t('helpIns')}\n${t('helpPlus')}\n${t('helpBSlash')}\n${t('helpCtrlO')}\n${t('helpCtrlR')}\n${t('helpCtrlBS')}\n${t('helpAltEnter')}`;
  alert(help);
}

/* ============================================================
   Button Bar (F-Tasten Leiste)
   ============================================================ */
function setupButtonBar() {
  const map = {
    help:     () => showHelp(),
    rename:   () => renameAction(),
    view:     () => editFileAction(),
    edit:     () => editFileAction(),
    copy:     () => copyAction(),
    move:     () => moveAction(),
    paste:    () => pasteAction(),
    mkdir:    () => mkdirAction(),
    delete:   () => deleteAction(),
    terminal: () => openTerminalHere(),
    exit:     () => { if (confirm(t('closeWebMC'))) window.close(); },
  };
  document.querySelectorAll('.fn-btn').forEach(btn => {
    const fn = btn.dataset.fn;
    if (map[fn]) btn.addEventListener('click', e => {
      e.preventDefault();
      map[fn]();
    });
  });
}

/* ============================================================
   Keyboard handler
   ============================================================ */
function handleKey(e) {
  const side = getActivePanel();
  const isCmdline = document.activeElement === el.cmdInput;
  const isTerminal = document.activeElement === el.termInput;
  const isEditor = document.activeElement && document.activeElement.id === 'ed-ta';

  if (isEditor) return; // editor handles its own keys
  if (isTerminal) {
    if (e.key === 'Escape') { closeTerminal(); e.preventDefault(); }
    return;
  }

  // Ctrl+O — Terminal toggle
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault();
    if (el.termOv.classList.contains('hidden')) openTerminalHere();
    else closeTerminal();
    return;
  }

  // Ctrl+R — Search
  if (e.ctrlKey && e.key === 'r') {
    e.preventDefault();
    if (!el.termOv.classList.contains('hidden')) return;
    searchAction();
    return;
  }

  // Ctrl+L — Refresh
  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    refreshBoth();
    return;
  }

  if (isCmdline) {
    // In cmdline mode, Enter executes, Escape cancels
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCmdline(el.cmdInput.value);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      el.cmdInput.value = '';
      el.cmdInput.blur();
      (side==='left'?el.listingL:el.listingR).focus();
    }
    // History up/down
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (state.cmdHistoryIdx > 0) {
        state.cmdHistoryIdx--;
        el.cmdInput.value = state.cmdHistory[state.cmdHistoryIdx];
      }
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (state.cmdHistoryIdx < state.cmdHistory.length - 1) {
        state.cmdHistoryIdx++;
        el.cmdInput.value = state.cmdHistory[state.cmdHistoryIdx];
      } else {
        state.cmdHistoryIdx = state.cmdHistory.length;
        el.cmdInput.value = '';
      }
    }
    return;
  }

  // Main keyboard shortcuts
  switch (e.key) {
    // Function keys — preventDefault damit Browser nix abfängt
    case 'F1': e.preventDefault(); e.stopPropagation(); showHelp(); break;
    case 'F2': e.preventDefault(); e.stopPropagation(); renameAction(); break;
    case 'F3': e.preventDefault(); e.stopPropagation(); editFileAction(); break;
    case 'F4': e.preventDefault(); e.stopPropagation(); editFileAction(); break;
    case 'F5': e.preventDefault(); e.stopPropagation(); copyAction(); break;
    case 'F6': e.preventDefault(); e.stopPropagation(); moveAction(); break;
    case 'F7': e.preventDefault(); e.stopPropagation(); mkdirAction(); break;
    case 'F8': e.preventDefault(); e.stopPropagation(); deleteAction(); break;
    case 'F9': e.preventDefault(); e.stopPropagation(); openTerminalHere(); break;
    case 'F10': e.preventDefault(); e.stopPropagation(); if (confirm(t('closeWebMC'))) window.close(); break;

    // Tab — switch panel
    case 'Tab': e.preventDefault(); setActivePanel(side==='left'?'right':'left'); break;

    // Navigation
    case 'ArrowUp': e.preventDefault(); cursorUp(side); break;
    case 'ArrowDown': e.preventDefault(); cursorDown(side); break;
    case 'PageUp': e.preventDefault(); cursorPageUp(side); break;
    case 'PageDown': e.preventDefault(); cursorPageDown(side); break;
    case 'Home': e.preventDefault(); cursorHome(side); break;
    case 'End': e.preventDefault(); cursorEnd(side); break;

    // Enter — open dir/file
    case 'Enter': e.preventDefault(); enterDir(side); break;

    // Insert — toggle mark
    case 'Insert': e.preventDefault(); toggleMark(side); break;

    // + — mark all
    case '+': e.preventDefault(); markAll(side); break;
    // \\ — invert
    case '\\': e.preventDefault(); markInvert(side); break;

    // Alt+Enter — open in other panel
    case 'Enter':
      if (e.altKey) { e.preventDefault(); openInOtherPanel(); }
      break;

    // Colon — open cmdline
    case ':':
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        e.preventDefault();
        el.cmdInput.value = '';
        el.cmdInput.focus();
      }
      break;

    // Escape — clear cmdline if focused, else select all
    case 'Escape':
      if (document.activeElement === el.cmdInput) {
        el.cmdInput.blur();
        (side==='left'?el.listingL:el.listingR).focus();
      }
      break;
  }
}

/* ============================================================
   Context menu
   ============================================================ */
function showContextMenu(e, side, ctxPath) {
  e.preventDefault();
  // Aktuell markierte + der Zielordner bestimmen
  const panel = state.panels[side];
  const onDir = ctxPath && !panel.marked.has(ctxPath);
  const destDir = ctxPath && onDir ? ctxPath : panel.path;

  // Vorheriges Context-Menü schließen
  if (state.activeContextMenu) {
    state.activeContextMenu.remove();
    state.activeContextMenu = null;
  }
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  const items = [
    {label: t('contextOpen'), fn: () => enterDir(side)},
    {label: t('contextEdit'), fn: () => editFileAction()},
    {label: '—'},
    {label: t('contextCopy'), fn: () => copyAction()},
    {label: t('contextMove'), fn: () => moveAction()},
    {label: t('contextPaste'), fn: () => pasteAction()},
    {label: t('contextRename'), fn: () => renameAction()},
    {label: t('contextDelete'), fn: () => deleteAction()},
    {label: '—'},
    {label: t('contextUpload'), fn: () => uploadFilesInto(destDir)},
    {label: t('contextMkdir'), fn: () => mkdirAction()},
    {label: t('contextSearch'), fn: () => searchAction()},
    {label: t('contextDownload'), fn: () => downloadAction()},
    {label: '—'},
    {label: t('contextTerminal'), fn: () => openTerminalHere()},
  ];
  for (const item of items) {
    if (item.label === '—') {
      const sep = document.createElement('div');
      sep.className = 'context-menu-separator';
      menu.appendChild(sep);
    } else {
      const div = document.createElement('div');
      div.className = 'context-menu-item';
      div.textContent = item.label;
      div.onclick = () => { item.fn(); menu.remove(); };
      menu.appendChild(div);
    }
  }
  document.body.appendChild(menu);
  state.activeContextMenu = menu;

  const closeMenu = (ev) => {
    if (ev.button && ev.button !== 0) return; // nur Linksklick
    if (!menu.contains(ev.target)) {
      menu.remove();
      state.activeContextMenu = null;
      document.removeEventListener('click', closeMenu);
      document.removeEventListener('contextmenu', closeMenu);
    }
  };
  setTimeout(() => {
    document.addEventListener('click', closeMenu);
    document.addEventListener('contextmenu', closeMenu);
  }, 0);
}

/* ============================================================
   Drag & Drop upload
   ============================================================ */
function setupDragDrop() {
  document.addEventListener('dragover', e => { e.preventDefault(); });
  document.addEventListener('drop', async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files.length) return;
    const side = getActivePanel();
    const dest = state.panels[side].path;
    await uploadFileList([...files], dest);
  });
}

/* Lädt eine Liste von File-Objekten in den Zielordner `dest` hoch. */
async function uploadFileList(fileList, dest) {
  if (!fileList.length) return;
  let ok = 0, fail = 0;
  toast(`${fileList.length} ${t('uploadStarted')}`, 'info');
  for (const file of fileList) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('path', dest);
      const r = await fetch(`${API_BASE}/webmc-api/upload`, { method: 'POST', body: fd });
      if (!r.ok) throw new Error((await r.json()).error || '');
      ok++;
    } catch (_) { fail++; }
  }
  toast(`${ok} ${t('uploaded')} ${t('uploadHere')} ${dest}${fail ? `, ${fail} ${t('failed')}` : ''}`, fail ? 'error' : 'success');
  refreshBoth();
}

/* Rechtsklick → „Datei(en) hochladen“: öffnet Datei-Dialog und lädt in `dest` hoch. */
function uploadFilesInto(dest) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.style.display = 'none';
  document.body.appendChild(input);
  input.addEventListener('change', () => {
    if (input.files.length) uploadFileList([...input.files], dest);
    input.remove();
  });
  input.click();
}

/* ============================================================
   Init
   ============================================================ */
function init() {
  cacheDom();
  setupDragDrop();

  // Config laden (leftPanel/rightPanel + language)
  apiConfig().then(cfg => {
    if (cfg) {
      if (cfg.language === 'de' || cfg.language === 'en') lang = cfg.language;
      state.panels.left.path = cfg.leftPanel || '/';
      state.panels.right.path = cfg.rightPanel || '/';
      applyLanguage();
      refreshBoth();
    } else {
      refreshBoth();
    }
  }).catch(() => refreshBoth());

  // Tab index for keyboard
  el.listingL.tabIndex = 0;
  el.listingR.tabIndex = 0;
  setActivePanel('left');

  // Global keyboard handler
  document.addEventListener('keydown', handleKey);

  // Terminal input
  el.termInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      execTerminalCommand(el.termInput.value);
      el.termInput.value = '';
    }
    if (e.key === 'Escape') { closeTerminal(); }
  });

  // Terminal close button
  el.termClose.addEventListener('click', closeTerminal);

  // ===== Click-Handler für Panel-Auswahl =====
  // Klick auf den leeren Bereich des Listings aktiviert das Panel
  function makePanelClickable(side, listing, titleEl, headerEl) {
    // Klick auf Einträge
    listing.addEventListener('click', e => {
      const entry = e.target.closest('.file-entry');
      if (!entry) {
        // Klick in leeren Bereich -> nur Panel aktivieren, Cursor bleibt
        setActivePanel(side);
        return;
      }
      const idx = [...entry.parentNode.children].indexOf(entry);
      state.panels[side].cursor = idx;
      setActivePanel(side);
      applyCursor(side);
    });

    listing.addEventListener('dblclick', e => {
      const entry = e.target.closest('.file-entry');
      if (entry) enterDir(side);
    });

    // Klick auf Header aktiviert Panel
    headerEl.addEventListener('click', e => {
      setActivePanel(side);
    });

    // Rechtsklick
    listing.addEventListener('contextmenu', e => {
      const entry = e.target.closest('.file-entry');
      let ctxPath = null;
      if (entry && entry.dataset.type === 'directory') ctxPath = entry.dataset.path;
      showContextMenu(e, side, ctxPath);
    });
  }

  makePanelClickable('left', el.listingL, el.titleL, $('#panel-left .panel-header'));
  makePanelClickable('right', el.listingR, el.titleR, $('#panel-right .panel-header'));

  // ===== Sort-Header Klick-Handler =====
  $$('.sort-header', el.left).forEach(h => {
    h.addEventListener('click', e => { e.stopPropagation(); toggleSort('left', h.dataset.sort); });
  });
  $$('.sort-header', el.right).forEach(h => {
    h.addEventListener('click', e => { e.stopPropagation(); toggleSort('right', h.dataset.sort); });
  });
  updateSortHeaders('left');
  updateSortHeaders('right');

  // Panel divider resize
  let isResizing = false;
  el.divider.addEventListener('mousedown', e => {
    isResizing = true;
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isResizing) return;
    const pct = (e.clientX / window.innerWidth) * 100;
    const leftPct = Math.max(20, Math.min(80, pct));
    el.left.style.width = leftPct + '%';
    el.right.style.width = (100 - leftPct) + '%';
  });
  document.addEventListener('mouseup', () => { isResizing = false; });

  // Cmdline Enter
  el.cmdInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCmdline(el.cmdInput.value);
    }
  });

  // Button bar - JETZT erst setupButtonBar aufrufen, DOM ist ready
  setupButtonBar();

  console.log('WebMC initialized. Press F1 for help.');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
