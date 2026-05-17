# ============================================================
# WebMC Dockerfile
# ============================================================
# Base-Image mit Node.js (entspricht "Voraussetzungen" in install.sh)
FROM node:22-alpine

# Zusätzliche System-Tools (tar für Download mehrerer Dateien)
RUN apk add --no-cache tar

# Projekt-Dateien kopieren
WORKDIR /app
COPY config.json index.html style.css app.js server.js README.md install.sh Dockerfile ./

# Environment-Variablen für Startordner (überschreiben config.json zur Laufzeit)
ENV WEBMC_LEFT="/"
ENV WEBMC_RIGHT="/"

# Nicht-root User (wie in install.sh empfohlen)
RUN adduser -D webmc && chown -R webmc:webmc /app

# Port aus config.json (Default: 4500)
EXPOSE 4500

USER webmc

# Start – übergibt Environment-Variablen an server.js
CMD ["sh", "-c", "node server.js --left \"$WEBMC_LEFT\" --right \"$WEBMC_RIGHT\""]
