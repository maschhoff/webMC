# 📂 WebMC — Midnight Commander für den Browser

**WebMC** ist ein moderner, webbasierter Dateimanager im Stil von **Midnight Commander (MC)** und **Krusader**. Zwei Panels, Tastatursteuerung, integriertes Terminal – alles in einem einzigen, portablen Ordner.

> Kein npm, keine Abhängigkeiten, kein Build-Prozess. Nur Node.js.

---

## 🚀 Features

| Funktion | Beschreibung |
|---|---|
| **Zwei Panels** | Wie MC – links/rechts, unabhängig navigierbar |
| **Tastatursteuerung** | F1–F10, Pfeiltasten, Tab, Insert, +, \\ und mehr |
| **Button-Leiste** | Alle F-Tasten als Klick-Buttons unten |
| **Dateioperationen** | Kopieren, Verschieben, Löschen, Umbenennen, Verzeichnis anlegen |
| **Integriertes Terminal** | Shell im Browser (Strg+O), arbeitet im aktuellen Ordner |
| **Inline-Editor** | Textdateien direkt im Browser bearbeiten und speichern |
| **Drag & Drop** | Dateien per Drag & Drop in WebMC hochladen |
| **Rechtsklick-Menü** | Kontextmenü mit allen Aktionen |
| **Markieren** | Insert, + (alle), \\ (umkehren) |
| **Suchen** | Rekursive Dateisuche mit Platzhaltern |
| **Herunterladen** | Einzeldateien oder mehrere als tar.gz-Archiv |
| **Panel-Größe** | Trennbalken per Maus verschiebbar |
| **Anpassbar** | Port und Startordner in `config.json` |

---

## 📦 Installation

### Voraussetzungen

- **Node.js** (v16 oder neuer)

Prüfen mit: `node --version`

### Variante 1: Per Install-Script

```bash
# 1. Entpacken
tar xzf webmc-project.tar.gz

# 2. Installation ausführen
cd webmc
chmod +x install.sh
./install.sh
```

Das Script installiert ggf. fehlende Abhängigkeiten und startet den Server.

### Variante 2: Manuell

```bash
cd webmc
node server.js
```

Dann im Browser öffnen: **http://localhost:4500**

### Port ändern

```bash
node server.js 8080          # via Kommandozeile
# oder in config.json bearbeiten:
```

---

## ⚙️ Konfiguration

Die Datei **`config.json`** im Projektordner:

```json
{
  "port": 4500,
  "leftPanel": "/",
  "rightPanel": "/"
}
```

| Feld | Beschreibung |
|---|---|
| `port` | Port auf dem der Server läuft (Default: 4500) |
| `leftPanel` | Startverzeichnis des linken Panels |
| `rightPanel` | Startverzeichnis des rechten Panels |

---

## ⌨️ Tastenkürzel

| Taste | Aktion |
|---|---|
| **F1** | Hilfe anzeigen |
| **F2** | Umbenennen |
| **F3** / **F4** | Datei öffnen/bearbeiten |
| **F5** | In anderes Panel kopieren |
| **F6** | In anderes Panel verschieben |
| **F7** | Verzeichnis anlegen |
| **F8** | Löschen |
| **F9** | Terminal öffnen |
| **F10** | Beenden |
| **Tab** | Panel wechseln |
| **↑ ↓** | Cursor bewegen |
| **PgUp / PgDn** | Seite hoch/runter |
| **Home / End** | Anfang/Ende der Liste |
| **Enter** | Ordner öffnen / Datei |
| **Insert** | Datei markieren |
| **+** | Alle markieren |
| **\\** | Auswahl umkehren |
| **:** | Kommandozeile (cd, mkdir, rm, …) |
| **Strg+O** | Terminal umschalten |
| **Strg+R** | Suchen |
| **Strg+L** | Beide Panels aktualisieren |
| **Alt+Enter** | Im anderen Panel öffnen |

---

## 📁 Dateien

```
webmc/
├── config.json      ← Konfiguration (Port, Startordner)
├── index.html       ← Oberfläche (HTML)
├── style.css        ← Design (Tokyo-Night-Dark-Theme)
├── app.js           ← Frontend-Logik (Browser)
├── server.js        ← Backend-Server (Node.js)
└── install.sh       ← Installations-Script
```

Alles **ohne externe Abhängigkeiten**. Einfach kopieren, `node server.js` – fertig.

---

## 🛡️ Sicherheit

- WebMC ist für **lokale Netzwerke** gedacht
- Keine Authentifizierung – nicht direkt ins Internet hängen
- Zugriff auf das gesamte Dateisystem des Servers
- Pfad-Traversal wird durch `safePath()` verhindert

---

## 📝 Lizenz

MIT – mach damit was du willst.
