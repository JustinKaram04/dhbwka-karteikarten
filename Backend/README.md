[![Lint, Typecheck and Build](https://github.com/DHBW-KA-Webengineering/Template_Node_Express/actions/workflows/build.yml/badge.svg)](https://github.com/DHBW-KA-Webengineering/Template_Node_Express/actions/workflows/build.yml)

# Template_Node_Express

This repository is a template for a backend API using NodeJS and express.


Diese Anleitung zeigt, wie du dich mit dem Benutzer "test" und dem Passwort "12345678" einloggen und anschließend über PowerShell (Invoke-RestMethod) auf die Endpunkte zugreifen kannst.

Melde dich an mit unserm Test User mit folgendem Befehl:

curl -X POST http://localhost:3100/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"test\",\"password\":\"12345678\"}"

Als Antwort bekommst du ein token welches du hier einfügt :

set JWT=Bearer <DEIN_TOKEN>

Nun kannst du die Themenbereiche sowie die dazugehörigen Unterthemen anfragen mit:

curl -X GET http://localhost:3100/api/topics ^
  -H "Authorization: %JWT%"

Um die Flashcards anzufragen benutze folgenden Befehl, ändere jedoch nur die Ids der Themengebiete und Unterthemen auf dessen karten du zugreifen möchtest (mit x und y gekennzeichnet):

curl -X GET http://localhost:3100/api/topics/<x>/subtopics/<y>/flashcards ^
  -H "Authorization: %JWT%"
