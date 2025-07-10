# Um das Setup Skript zu starten öffne Git Bash und führe folgende Befehle im Root aus:
# chmod +x setup.sh
# ./setup.sh
# danach ist es möglich das projekt im Root mit npm start zu starten

set -euo pipefail

# 1. Prüfe Voraussetzungen
echo "🔎 Prüfe Voraussetzungen…"
for cmd in docker docker-compose node npm; do
  if ! command -v $cmd &> /dev/null; then
    echo "  ❌ $cmd fehlt – bitte installieren!"
    exit 1
  fi
done
echo "  ✅ Alle Voraussetzungen vorhanden."

# 2. Root-Dependencies installieren
echo "📦 Installiere Root-Dependencies…"
npm install

# 3. Backend einrichten
echo "🔧 Richte Backend ein…"
pushd Backend > /dev/null

echo "  📦 Installiere Backend-Dependencies…"
npm install

echo "  🐳 Starte Docker-Container…"
docker-compose up -d

# Optional: auf DB-Start warten (Service-Name 'db' anpassen, falls nötig)
echo -n "  ⏳ Warte auf Datenbank… "
until docker-compose exec db mysqladmin ping -h"db" --silent; do
  echo -n "."
  sleep 1
done
echo " OK."

echo "  🛠 Baue Backend (dist)…"
npm run build
popd > /dev/null

# 4. Frontend einrichten
echo "🔧 Richte Frontend ein…"
pushd Frontend > /dev/null

echo "  📦 Installiere Frontend-Dependencies…"
npm install

echo "  🛠 Baue Frontend (Production)…"
npm run build
popd > /dev/null

# 5. Abschluss
echo
echo "✅ Setup abgeschlossen!"
echo "   • Starte im Dev-Modus mit: npm start"
echo
