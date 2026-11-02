# Gestionale Ricambi

Gestionale web per cercare in pochi secondi i ricambi di un'autodemolizione:
per tipo di pezzo, marca, modello, anno, colore, lato (DX/SX), condizione e stato (disponibile/venduto).

## Cosa c'è
- Login con ruoli (amministratore / operatore)
- Ricerca rapida e filtri per marca, modello, anno e codice
- Inserimento e modifica dei ricambi, con menu a tendina per tipologie, marche, modelli e colori
- Foto dei pezzi (JPEG, PNG, WEBP; ridimensionate automaticamente)
- Stato venduto/disponibile
- Interfaccia nei colori dell'azienda (giallo e nero), utilizzabile da computer e telefono
- Backup notturno di database e foto

## Tecnologie
React + Vite, Node.js + Express, MySQL

## Come provarlo in locale
Vedi [INSTALLAZIONE.md](INSTALLAZIONE.md): servono MySQL, un file `.env` (modello in `.env.example`) e due terminali, uno per `backend` (`npm start`) e uno per `frontend` (`npm run dev`).

## Come metterlo online
La guida completa per un server AWS Lightsail con dominio e HTTPS è in [deploy/GUIDA-ONLINE.md](deploy/GUIDA-ONLINE.md).

## Sicurezza
Le credenziali stanno solo nel file `.env`, escluso da Git. Non inserire mai password o chiavi nel codice: il repository è pubblico.

## Autore
Mahdi Ajimi · Master in Web Development, Boolean
