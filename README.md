# Autodemolizione Ricambi Torino

Gestionale e sito web per un'autodemolizione di Torino: il personale gestisce il magazzino dei ricambi e i clienti scoprono online, in tempo reale, se il pezzo che cercano è disponibile.

**Sito per i clienti:** https://autodemolizionericambitorino.it

![Anteprima del sito](docs/anteprima.png)

## Cosa c'è dentro

**Gestionale (area riservata, per il personale)**
- Login con ruoli: amministratore e operatore
- Ricerca rapida e filtri per marca, modello, anno e codice
- Inserimento e modifica dei ricambi, con menu a tendina per tipologie, marche, modelli e colori
- Foto dei pezzi (JPEG, PNG, WEBP), ridimensionate automaticamente
- Stato venduto/disponibile
- Utilizzabile da computer e da telefono

**Sito pubblico (per i clienti)**
- Un'auto disegnata a linee tecniche che si "apre" per zone (vano motore, abitacolo, portiere, posteriore, sottoscocca, ruote) e mostra i pezzi di ogni zona con la disponibilità reale del magazzino
- Ricerca per pezzo, marca e modello
- Informazioni sul ritiro del veicolo e sui documenti per la demolizione, con e senza fermo amministrativo
- Mappa (caricata solo dopo il clic), orari con stato "aperto ora", contatti e social
- Nessun cookie e nessun dato personale raccolto; il sito non mostra mai prezzi né codici interni

**Operazioni**
- Backup notturno di database e foto
- Messa online su AWS Lightsail con HTTPS automatico

## Tecnologie
React + Vite · Node.js + Express · MySQL · Caddy · AWS Lightsail

## Struttura del progetto
```
backend/         API Express: login, ricambi, foto e API pubbliche del sito
frontend/        Il gestionale (React)
sito-pubblico/   Il sito per i clienti (React)
database/        Schema, dati iniziali e migrazioni di MySQL
deploy/          Configurazione del server (Caddy, servizio, backup) e guida
docs/            Immagini della documentazione
```

## Come provarlo in locale
Servono Node.js, MySQL e un file `.env` (il modello è `.env.example`). Le istruzioni complete sono in [INSTALLAZIONE.md](INSTALLAZIONE.md).

```bash
cd backend && npm install && npm start        # API su http://127.0.0.1:3000
cd frontend && npm install && npm run dev      # gestionale su http://localhost:5173
cd sito-pubblico && npm install && npm run dev # sito su http://localhost:5174
```

## Come metterlo online
La guida passo passo (server, database, HTTPS, backup, sito pubblico) è in [deploy/GUIDA-ONLINE.md](deploy/GUIDA-ONLINE.md).

## Sicurezza
- Password salvate con hash bcrypt, sessioni in cookie protetti e limite ai tentativi di login
- Query sempre parametrizzate e dati in ingresso controllati
- Le API pubbliche espongono solo i campi sicuri e hanno un limite di richieste
- Credenziali e chiavi stanno solo nel file `.env`, escluso da Git: il repository è pubblico, non inserire mai segreti nel codice

## Autore
Mahdi Ajimi · Master in Web Development, [Boolean](https://www.boolean.careers)
