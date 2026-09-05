# ============================================================
# WebMC Dockerfile
# ============================================================
FROM node:22-alpine

# Zusätzliche System-Tools
# tar: Download mehrerer Dateien
# su-exec: Rechte-Downgrade im Entrypoint
# shadow: usermod/groupmod für bestehende IDs
RUN apk add --no-cache tar su-exec shadow

WORKDIR /app
COPY config.json index.html style.css app.js server.js README.md install.sh Dockerfile ./
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Startordner (überschreiben config.json zur Laufzeit)
ENV WEBMC_LEFT="/"
ENV WEBMC_RIGHT="/"

# Unraid-Defaults: nobody:users
ENV PUID=99
ENV PGID=100
ENV UMASK=022

EXPOSE 4500

# Kein USER-Statement mehr, der Entrypoint startet als root
# und wechselt selbst auf den gewünschten User
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["sh", "-c", "node server.js --left \"$WEBMC_LEFT\" --right \"$WEBMC_RIGHT\""]
