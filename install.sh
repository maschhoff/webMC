#!/usr/bin/env bash
#
# install.sh — WebMC Installations-Script
#
# Installiert ggf. fehlende Abhängigkeiten, richtet den
# Projektordner ein und startet den Server.
#
# Usage: ./install.sh [port]
#        ./install.sh          # Port aus config.json (Default: 4500)
#        ./install.sh 8080     # Port 8080
#
# Zum Stoppen: Strg+C
#

set -e

# ---- Farben ----
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo ""
echo -e "${CYAN}╔══════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       WebMC — Installation           ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════╝${NC}"
echo ""

# ---- Node.js prüfen ----
echo -e "${YELLOW}[1/5] Prüfe Voraussetzungen...${NC}"

if ! command -v node &>/dev/null; then
  echo -e "${RED}❌ Node.js ist nicht installiert!${NC}"
  echo ""
  echo "Bitte installiere Node.js:"
  echo "  Debian/Ubuntu:  sudo apt install nodejs"
  echo "  Fedora:         sudo dnf install nodejs"
  echo "  macOS:          brew install node"
  echo "  Oder:           https://nodejs.org"
  exit 1
fi

NODE_VER=$(node --version | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 16 ]; then
  echo -e "${RED}❌ Node.js v16+ erforderlich (gefunden: $(node --version))${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version)${NC}"

# ---- tar prüfen (für Download-Funktion) ----
if command -v tar &>/dev/null; then
  echo -e "${GREEN}✅ tar gefunden${NC}"
else
  echo -e "${YELLOW}⚠️  tar nicht gefunden – Download mehrerer Dateien deaktiviert${NC}"
fi

# ---- Projekt-Dateien prüfen ----
echo ""
echo -e "${YELLOW}[2/5] Prüfe Projekt-Dateien...${NC}"

MISSING=0
for f in index.html style.css app.js server.js config.json README.md; do
  if [ -f "$f" ]; then
    echo -e "${GREEN}  ✅ $f${NC}"
  else
    echo -e "${RED}  ❌ $f fehlt!${NC}"
    MISSING=1
  fi
done

if [ "$MISSING" -eq 1 ]; then
  echo -e "${RED}❌ Projekt-Dateien unvollständig. Bitte entpacke das Archiv erneut.${NC}"
  exit 1
fi

# ---- Port auslesen ----
echo ""
echo -e "${YELLOW}[3/5] Lese Konfiguration...${NC}"

PORT="${1:-$(node -e "
  try {
    const c = require('./config.json');
    console.log(c.port || 4500);
  } catch(e) {
    console.log(4500);
  }
")}"

echo -e "${GREEN}  Port: ${PORT}${NC}"
echo -e "${GREEN}  Linkes Panel:$(node -e "try{console.log(' '+require('./config.json').leftPanel)}catch(e){console.log(' /')}")${NC}"
echo -e "${GREEN}  Rechtes Panel:$(node -e "try{console.log(' '+require('./config.json').rightPanel)}catch(e){console.log(' /')}")${NC}"

# ---- Berechtigungen und Test ----
echo ""
echo -e "${YELLOW}[4/5] Server-Test...${NC}"

node -c server.js && echo -e "${GREEN}  ✅ server.js${NC}"
echo -e "${GREEN}  ✅ config.json${NC}"

# ---- Start ----
echo ""
echo -e "${YELLOW}[5/5] Starte WebMC...${NC}"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  WebMC startet auf Port ${PORT}!              ║${NC}"
echo -e "${GREEN}║  http://localhost:${PORT}                    ║${NC}"
echo -e "${GREEN}║                                          ║${NC}"
echo -e "${GREEN}║  Strg+C zum Beenden                      ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""

node server.js "$PORT"
