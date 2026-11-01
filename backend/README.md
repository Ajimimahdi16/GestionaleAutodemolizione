# Backend Gestionale Ricambi

API Express in CommonJS, connessione MySQL con `mysql2/promise`, autenticazione tramite JWT in cookie HTTP-only e gestione delle foto.

> Consulta il [README principale](../README.md) per preparare MySQL, configurare `.env`, creare l'amministratore e avviare l'app completa sulla porta 3000.

Il controllo `GET /health` verifica solo che Express sia avviato; non prova le credenziali né la connessione MySQL. Le chiamate con dati reali richiedono un database attivo e `DB_PASSWORD` corretta nel file `.env` locale.
