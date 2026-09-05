#!/bin/sh
set -e

PUID="${PUID:-99}"
PGID="${PGID:-100}"
UMASK="${UMASK:-022}"

# --- Gruppe ---
GROUP_NAME="$(awk -F: -v gid="$PGID" '$3==gid {print $1; exit}' /etc/group)"
if [ -z "$GROUP_NAME" ]; then
    GROUP_NAME="webmc"
    addgroup -g "$PGID" "$GROUP_NAME"
fi

# --- User ---
USER_NAME="$(awk -F: -v uid="$PUID" '$3==uid {print $1; exit}' /etc/passwd)"
if [ -z "$USER_NAME" ]; then
    USER_NAME="webmc"
    adduser -D -H -u "$PUID" -G "$GROUP_NAME" -s /sbin/nologin "$USER_NAME"
else
    # Bestehenden User (z.B. node mit UID 1000) der Zielgruppe zuordnen
    usermod -g "$PGID" "$USER_NAME" >/dev/null 2>&1 || true
fi

# --- Rechte ---
# Nur das App-Verzeichnis, niemals die gemounteten Shares
chown -R "$PUID:$PGID" /app
export HOME=/app

umask "$UMASK"

echo "WebMC startet als ${USER_NAME}:${GROUP_NAME} (${PUID}:${PGID}), umask ${UMASK}"

exec su-exec "$PUID:$PGID" "$@"
