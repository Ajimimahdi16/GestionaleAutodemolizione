// Dati dell'azienda usati in tutto il sito: modificarli qui li aggiorna ovunque.
export const azienda = {
  nome: 'Autodemolizione Ricambi Torino',
  ragioneSociale: 'Autodemolizione Ricambi Torino S.r.l.',
  partitaIva: '12721980014',
  indirizzo: 'Corso Orbassano 368/23',
  citta: 'Torino',
  telefonoUfficio: { mostra: '011 309 4494', link: 'tel:+390113094494' },
  telefonoCarrista: { mostra: '347 681 6822', link: 'tel:+393476816822' },
  googleMaps: 'https://share.google/bMj0JoDnQ2x3EFPM5',
  indicazioni: 'https://www.google.com/maps/dir/?api=1&destination=Corso+Orbassano+368%2F23%2C+Torino',
  mappaIncorporata: 'https://www.google.com/maps?q=Corso+Orbassano+368%2F23%2C+Torino&output=embed',
  vigiliTorino: { indirizzo: 'Via Druento 355, Torino', mappa: 'https://www.google.com/maps/search/?api=1&query=Via+Druento+355+Torino' },
  instagram: 'https://www.instagram.com/auto.demolizionericambitorino',
  tiktok: 'https://www.tiktok.com/@autodemolizione_torino',
}

// Orari di apertura: ogni voce è un elenco di fasce [apertura, chiusura] in formato HH:MM.
// L'indice del giorno segue Date.getDay(): 0 = domenica.
export const orari = [
  { giorno: 'Domenica', fasce: [] },
  { giorno: 'Lunedì', fasce: [['08:30', '12:30'], ['14:00', '18:00']] },
  { giorno: 'Martedì', fasce: [['08:30', '12:30'], ['14:00', '18:00']] },
  { giorno: 'Mercoledì', fasce: [['08:30', '12:30'], ['14:00', '18:00']] },
  { giorno: 'Giovedì', fasce: [['08:30', '12:30'], ['14:00', '18:00']] },
  { giorno: 'Venerdì', fasce: [['08:30', '12:30'], ['14:00', '18:00']] },
  { giorno: 'Sabato', fasce: [['08:30', '12:00']] },
]

export const marche = [
  'Fiat', 'Lancia', 'Alfa Romeo', 'Ford', 'Renault', 'Volkswagen', 'Opel', 'Peugeot', 'Citroën',
  'BMW', 'Audi', 'Mercedes', 'Toyota', 'Dacia', 'Nissan', 'Seat', 'Skoda', 'Hyundai', 'Kia', 'Jeep',
]
