# Fase 3 — API e autenticazione

Il server è in CommonJS. Legge la configurazione dal `.env` nella cartella principale e usa il pool MySQL in `config/db.js`. Non creare un `.env` in Git né inserire credenziali nel codice.

## Prima di avviare

1. Verifica di aver importato `database/schema.sql` e `database/seed.sql` in MySQL Workbench.
2. Copia `.env.example` in `.env` dalla cartella principale e inserisci la password scelta per l’utente MySQL `ricambi_app` e un valore casuale lungo per `JWT_SECRET`. Il cookie è impostato per HTTP locale (`COOKIE_SECURE=false`).
3. Installa le dipendenze, dalla cartella principale: `npm --prefix backend install`.
4. Crea l’account amministratore con `npm --prefix backend run crea-admin`. Inserisci username, nome e password quando richiesti; la password non viene mostrata mentre la digiti.

## Avvio e prove su macOS/Linux (zsh)

Per la fase di sviluppo, l’API ascolta sulla porta 5000. Il `.env` finale usa la porta 3000 per il funzionamento integrato previsto nelle fasi successive; sovrascrivila solo per questa prova:

```sh
APP_PORT=5000 npm --prefix backend start
```

Lascia il server attivo e apri un secondo terminale. Prova il controllo server:

```sh
curl http://localhost:5000/health
```

La risposta deve indicare `"stato":"ok"`. Verifica che le API richiedano il login:

```sh
curl -i http://localhost:5000/api/pezzi
```

Senza sessione deve rispondere `401` con un messaggio in italiano. Il login, con credenziali valide create da te, si prova così (la risposta salva il cookie nel file locale `cookie.txt`):

```sh
curl -i -c cookie.txt -H 'Content-Type: application/json' -d '{"username":"IL_TUO_UTENTE","password":"LA_TUA_PASSWORD"}' http://localhost:5000/api/auth/login
curl -b cookie.txt http://localhost:5000/api/auth/me
curl -b cookie.txt 'http://localhost:5000/api/pezzi?q=paraurti%20lancia%20y&includi_venduti=true'
curl -b cookie.txt -X POST http://localhost:5000/api/auth/logout
```

Sostituisci i valori tra parentesi con quelli creati da te; non condividere la password né il file cookie. Per fermare il server premi `Ctrl+C` nel terminale in cui è attivo.

## Prove su Windows PowerShell

Dalla cartella principale del progetto:

```powershell
$env:APP_PORT = "5000"
npm --prefix backend start
```

In un secondo PowerShell puoi provare `Invoke-RestMethod http://localhost:5000/health` e `Invoke-RestMethod -SkipHttpErrorCheck http://localhost:5000/api/pezzi` (la seconda deve restituire 401). Nella fase di collegamento frontend configureremo il proxy Vite per inoltrare `/api` al server.

## Endpoint pronti in questa fase

- Autenticazione: login, logout, utente corrente.
- Ricambi: ricerca testuale e filtri; dettaglio; creazione; modifica; vendita/ripristino; eliminazione solo admin.
- Cataloghi: lettura/creazione veicoli e tipologie; filtri per marche, modelli, colori e tipologie.
- Il caricamento foto non è ancora attivo: verrà aggiunto nella fase 5.

Il server non può completare le query ai dati se MySQL non è avviato o se il `.env` non contiene credenziali valide. L’endpoint `/health` controlla solo che Express sia in esecuzione, non verifica la disponibilità di MySQL.
