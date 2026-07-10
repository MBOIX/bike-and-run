#!/usr/bin/env bash
# Sert le site en local et ouvre le navigateur.
# Indispensable : en file:// (double-clic sur index.html), les navigateurs bloquent
# les modules ES et fetch() par sécurité — le site doit être servi en HTTP.
set -euo pipefail

PORT="${1:-8000}"
URL="http://localhost:${PORT}"

echo "BIKE&RUN → ${URL}  (Ctrl-C pour arrêter)"
if command -v open >/dev/null; then
  (sleep 1 && open "${URL}") &
fi
python3 -m http.server "${PORT}"
