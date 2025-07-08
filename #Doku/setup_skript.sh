#als erstes muss das Repository geklont werden mit folgenden befehl:
#git clone https://github.com/JustinKaram04/dhbwka-karteikarten.git
#cd dhbwka-karteikarten

#als nächstes kann dieses setup script ausgeführt werden mit Bash:
# ./setup.sh

set -euo pipefail

echo "=== 1. .env-Datei anlegen ==="
if [ ! -f .env ]; then
  cp .env.example .env
  echo "-> .env angelegt"
else
  echo "-> .env existiert bereits, wird nicht überschrieben"
fi

echo "=== 2. Datenbank via Docker starten ==="
docker-compose up -d db
sleep 5  # kurz warten, bis MySQL initialisiert ist

echo "=== 3. Backend-Abhängigkeiten installieren und builden ==="
pushd backend
npm install
npm run build
popd

echo "=== 4. Frontend-Abhängigkeiten installieren und builden ==="
pushd frontend
npm install
npm run build
popd

echo "=== Fertig! ==="

#Das Projekt startest du im Repository :/dhbwka-karteikarten mit dem befehl:
#npm start