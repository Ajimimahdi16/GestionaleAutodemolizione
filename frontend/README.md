# Gestionale Ricambi — demo frontend

Demo locale del gestionale per AUTODEMOLIZIONE RICAMBI TORINO SRL. Questa fase contiene solo React + Vite: nessun backend o database. I ricambi sono dati finti conservati nello stato della pagina e le modifiche si azzerano al ricaricamento.

## Requisiti

- Node.js versione LTS (include npm)
- Browser aggiornato

## Avvio passo passo

1. Apri un terminale nella cartella principale del progetto.
2. Entra nella cartella del frontend con `cd frontend`.
3. Installa le dipendenze con `npm install`. Questo comando scarica React, Vite e React Router; normalmente va eseguito solo la prima volta.
4. Avvia il server locale con `npm run dev`.
5. Apri nel browser l'indirizzo indicato nel terminale, normalmente http://localhost:5173.
6. Per fermare il server, torna al terminale e premi Ctrl+C.

## Verifiche facoltative

- `npm run build` crea una versione ottimizzata dentro `dist/`.
- `npm run lint` controlla il codice JavaScript.

## Cosa si può provare

- Ricerca immediata per tipo di pezzo, marca, modello, colore e anno.
- Filtro per marca e interruttore per includere i venduti.
- Dettaglio del ricambio.
- Aggiunta e modifica temporanea di un ricambio.
- Cambio disponibilità con conferma per segnare un pezzo venduto.

Le immagini sono rappresentazioni grafiche segnaposto, non fotografie reali. Backend, persistenza, caricamento delle foto reali e autenticazione non sono inclusi in questa fase.
