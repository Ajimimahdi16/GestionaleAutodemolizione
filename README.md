# Gestionale Ricambi — installazione e avvio locale

Applicazione locale per AUTODEMOLIZIONE RICAMBI TORINO SRL. Il progetto usa React + Vite, API Express e MySQL. Le password e i token restano nel file `.env` locale, escluso da Git.

## Requisiti

- Node.js LTS e npm
- MySQL Server locale e MySQL Workbench

## 1. Preparare MySQL

Da MySQL Workbench, apri ed esegui in ordine `database/schema.sql` e `database/seed.sql`. Il seed inserisce sei ricambi dimostrativi e può riallineare quei record agli ID del demo.

Crea poi un utente MySQL applicativo dedicato con accesso limitato al database `gestionale_ricambi`; non configurare l'app con `root`. Se l'utente applicativo esiste già, dopo aver ruotato la password condivisa in precedenza, inserisci la nuova password soltanto nel `.env` locale.

## 2. Installare le dipendenze

Dalla cartella principale:

```sh
npm --prefix backend install
npm --prefix frontend install
```

Non c'è un `package.json` nella cartella principale.

## 3. Configurare il file locale

È stato predisposto `.env` in questa cartella con un `JWT_SECRET` casuale e permessi locali restrittivi. Per sicurezza `DB_PASSWORD` è lasciata vuota: prima di avviare l'API, modifica solo quella variabile con la password MySQL appena ruotata, mantenendola tra virgolette se contiene caratteri speciali. Non inviare il contenuto del file in chat e non aggiungerlo a Git.

`DB_HOST`, `DB_USER`, `DB_NAME`, `APP_PORT` e `UPLOAD_DIR` sono impostati per l'installazione locale. Per cambiare la porta, aggiorna `APP_PORT` nel `.env`.

## 4. Creare l'amministratore

Con MySQL attivo e `.env` configurato, esegui dalla cartella principale:

```sh
npm --prefix backend run crea-admin
```

Lo script chiede username, nome e password nel terminale; la password viene mostrata solo come asterischi e nel database viene salvato l'hash bcrypt. Non digitare la password in un comando o in un file temporaneo.

## 5. Avvio in sviluppo

Apri due terminali nella cartella principale.

Terminale 1, avvia API e backend:

```sh
npm --prefix backend start
```

Terminale 2, avvia Vite:

```sh
npm --prefix frontend run dev
```

Apri `http://localhost:5173`. Vite inoltra `/api` e `/uploads` al backend locale sulla porta configurata (predefinita `3000`).

## 6. Avvio integrato su una sola porta

Per compilare la UI e servirla insieme alle API da Express:

```sh
npm --prefix frontend run build
npm --prefix backend start
```

Apri `http://localhost:3000`. Per uscire, premi `Ctrl+C` nel terminale del backend.

## API principali

- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/POST /api/pezzi`, `GET/PUT/DELETE /api/pezzi/:id`
- `PATCH /api/pezzi/:id/venduto` e `PATCH /api/pezzi/:id/disponibile`
- `POST /api/pezzi/:id/foto` e `DELETE /api/foto/:id` (solo amministratore per eliminazione)
- `GET/POST /api/veicoli`, `GET/POST /api/tipologie`, `GET /api/filtri`
- `GET /health` controlla Express; `GET /health/database` prova la connessione MySQL e restituisce 503 se non è disponibile.

Le foto accettate sono JPEG, PNG o WEBP, massimo 10 MB ciascuna e otto per richiesta. Il server le converte in JPEG e le ridimensiona fino a 1200 px, salvandole in `backend/uploads/`.

## Note di sicurezza e stato

- `.env`, upload e backup sono esclusi da Git.
- Il cookie di sessione è HTTP-only e la protezione login limita i tentativi.
- Cambia ogni credenziale che sia stata inserita nella cronologia della chat.
- L'accesso a MySQL, la creazione admin e le chiamate API con dati reali funzionano soltanto quando MySQL è avviato e `DB_PASSWORD` è stata impostata localmente.
