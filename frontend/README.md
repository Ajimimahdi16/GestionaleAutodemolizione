# Frontend Gestionale Ricambi

Interfaccia React + Vite per la gestione locale dei ricambi. La UI utilizza le API del backend; non contiene più dati mock persistenti.

Per l'installazione completa, la configurazione MySQL, la creazione dell'amministratore e l'avvio integrato su `http://localhost:3000`, consulta il [README principale](../README.md).

## Sviluppo UI

Installa le dipendenze dalla cartella principale con `npm --prefix frontend install`. Avvia il backend in un terminale e Vite in un altro con `npm --prefix frontend run dev`; la UI sarà su `http://localhost:5173` e il proxy inoltrerà `/api` e `/uploads` al backend.

Controlli disponibili: `npm --prefix frontend run build` e `npm --prefix frontend run lint`.
