[![Build Frontend](https://github.com/JustinKaram04/dhbwka-karteikarten/actions/workflows/build-frontend.yml/badge.svg)](https://github.com/JustinKaram04/dhbwka-karteikarten/actions/workflows/build-frontend.yml)
[![Publish Frontend](https://github.com/JustinKaram04/dhbwka-karteikarten/actions/workflows/publish-frontend.yml/badge.svg)](https://github.com/JustinKaram04/dhbwka-karteikarten/actions/workflows/publish-frontend.yml)
# dhbwka-karteikarten
This repository is a template with a working GitHub action for the build and GitHub pages.




       7. Übersicht der relevanten Daten
Welche Daten, Dateien, Datenbanken, Tabellen und Felder sind relevant?

Datenbank:
Für die Frontendentwicklung wird als vorläufige DB ein JSON server zur Speicherung der data models genutzt
Die entgültig verwendete Datenbank wird im Prozess der Backendentwicklung festgesetzt, basierend auf Ansprüchen.

Data models:
Die Data models (JSON-Schemata) für Themen, Unterthemen und Karteikarten werden bereits in der Frontendentwicklung festgesetzt und die DataServices als Schnittstelle zwischen DB und Frontend soweit abstrahiert, dass DataServices unabhängig von verwendeter Datenbank genutzt werden können.

→ Data models an sich auflisten???

Benutzerdaten:
Benutzerdatenschema und Entwicklung entsprechende Speicherung und Überprüfung der Benutzerdaten nach aktuellen Datenschutz und Sicherheitsrichtlinien im Backend.
