# Preparazione del database

## Importare lo schema e i dati demo con MySQL Workbench

1. Avvia MySQL Workbench e connettiti al server locale con un account amministratore MySQL. Queste credenziali servono solo per installazione e manutenzione, non verranno messe nell'applicazione.
2. Apri `schema.sql` con **File → Open SQL Script** ed esegui lo script con il pulsante a forma di fulmine. Crea il database `gestionale_ricambi` e le tabelle.
3. Apri `seed.sql` ed eseguilo per inserire i sei ricambi demo uguali a quelli mostrati inizialmente dal frontend.
4. Aggiorna lo schema in Workbench: dovresti vedere le tabelle `utenti`, `veicoli`, `tipologie_pezzo`, `pezzi` e `foto_pezzo`.

Lo script seed è ri-eseguibile sui dati demo: aggiorna gli elementi con gli stessi ID/codici. Non lo usare per caricare dati di un archivio reale che vuoi mantenere senza aver prima verificato cosa farà.

## Creare l'utente MySQL dedicato all'app

Dopo aver importato lo schema, apri una nuova scheda SQL in Workbench e crea un utente applicativo distinto da `root`. Esegui questi comandi da una connessione amministrativa, sostituendo `SOSTITUISCI_CON_UNA_PASSWORD_FORTE` con una password scelta da te. Non salvare la password nel progetto o in Git; riportala solo nel file locale `.env` sul PC dell'ufficio.

```sql
CREATE USER 'ricambi_app'@'127.0.0.1' IDENTIFIED BY 'SOSTITUISCI_CON_UNA_PASSWORD_FORTE';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestionale_ricambi.* TO 'ricambi_app'@'127.0.0.1';
FLUSH PRIVILEGES;
```

L'app si collegherà a MySQL in locale usando l'utente `ricambi_app`, che avrà accesso solo al database del gestionale. Lo schema e l'utente si amministrano separatamente dall'app.

## Amministratore dell'applicazione

Non esiste un account predefinito né una password nel seed. Lo script `backend/scripts/crea-admin.js` chiede nome utente, nome e password nel terminale, verifica la conferma e salva solo l'hash bcrypt. Potrà essere eseguito dopo aver installato le dipendenze backend nella fase di realizzazione del server e aver completato `.env`.
