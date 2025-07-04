# Backend/Dockerfile

# Verwende offizielle Node.js Runtime
FROM node:20

# Arbeitsverzeichnis im Container
WORKDIR /app

# Package-Dateien kopieren und Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Quellcode kopieren
COPY . .

# TypeScript build ausführen
RUN npm run build

# Server starten
CMD ["node", "dist/index.js"]

# Offenbaren des Ports (falls gewünscht)
EXPOSE 3100