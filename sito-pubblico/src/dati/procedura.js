// Testi della procedura di demolizione mostrati nel sito.
// Modificarli qui li aggiorna nella sezione "Ritiro veicoli".

export const documenti = [
  { titolo: 'Carta d’identità' },
  { titolo: 'Codice fiscale' },
  { titolo: 'Libretto del veicolo' },
  {
    titolo: 'Certificato di proprietà',
    nota: 'Serve solo se il veicolo è stato acquistato prima del 10/10/2015. Dopo quella data il certificato è digitale e non serve.',
  },
]

export const documentoMancante = 'Se manca qualche documento basta la denuncia del documento mancante. Per altre informazioni, chiamaci.'

export const senzaFermo = {
  titolo: 'Senza fermo amministrativo: ritiro gratuito',
  testo: 'Il fermo amministrativo è un vincolo sul veicolo. Se non c’è, la demolizione è diretta: ce ne occupiamo noi e il ritiro è gratuito.',
}

export const conFermo = {
  titolo: 'Con fermo amministrativo: la procedura è diversa',
  testo: 'I documenti da preparare sono gli stessi, ma la procedura cambia. Dipende da dove risiedi.',
  residenti: [
    {
      titolo: 'Risiedi a Torino',
      opzioni: [
        { titolo: 'Possiamo occuparcene noi', testo: 'La procedura richiede tempo e ha un costo. Per le informazioni, chiamaci.' },
        { titolo: 'Oppure puoi farla tu', testo: 'Recati ai Vigili municipali in via Druento 355, Torino: ti spiegano la procedura.' },
      ],
    },
    {
      titolo: 'Risiedi fuori Torino',
      opzioni: [
        { titolo: 'Chiedi informazioni in loco', testo: 'Puoi rivolgerti ai Vigili municipali o al Comune di residenza per farti spiegare la procedura.' },
      ],
    },
  ],
}
