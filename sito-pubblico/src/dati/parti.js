// Punti cliccabili sull'auto. Le coordinate sono nello spazio del disegno (viewBox 36 92 748 244).
// `nomi` sono i tipi di pezzo del gestionale collegati al punto (il primo trovato è quello "principale").
// `forma` è l'area che si illumina quando il punto è attivo.
export const parti = [
  { id: 'faro-anteriore', etichetta: 'Faro anteriore', nomi: ['Faro anteriore', 'Fanale anteriore'], x: 726, y: 208,
    forma: 'M704 203 C726 198 745 205 752 217 L712 218 Z' },
  { id: 'cofano', etichetta: 'Cofano', nomi: ['Cofano'], x: 656, y: 182,
    forma: 'M606 172 L702 190 L706 203 L642 197 L600 181 Z' },
  { id: 'paraurti-anteriore', etichetta: 'Paraurti anteriore', nomi: ['Paraurti anteriore'], x: 746, y: 246,
    forma: 'M692 224 L752 224 C760 234 763 250 763 262 L692 262 Z' },
  { id: 'specchietto', etichetta: 'Specchietto retrovisore', nomi: ['Specchietto retrovisore'], x: 562, y: 168,
    forma: 'M546 166 L574 161 L583 175 L554 181 Z' },
  { id: 'portiera-anteriore', etichetta: 'Portiera anteriore', nomi: ['Portiera anteriore'], x: 462, y: 228,
    forma: 'M392 190 L548 190 L530 262 L392 262 Z' },
  { id: 'portiera-posteriore', etichetta: 'Portiera posteriore', nomi: ['Portiera posteriore'], x: 318, y: 228,
    forma: 'M228 191 L384 190 L384 262 L272 262 Z' },
  { id: 'cerchio', etichetta: 'Cerchio', nomi: ['Cerchio in lega', 'Cerchio in ferro'], x: 590, y: 268,
    forma: 'M540 268 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0' },
  { id: 'portellone', etichetta: 'Portellone / baule', nomi: ['Portellone posteriore', 'Baule'], x: 122, y: 190,
    forma: 'M92 203 L150 197 L182 165 L128 181 Z' },
  { id: 'faro-posteriore', etichetta: 'Faro posteriore', nomi: ['Faro posteriore'], x: 82, y: 220,
    forma: 'M66 213 L97 209 L99 228 L68 230 Z' },
  { id: 'paraurti-posteriore', etichetta: 'Paraurti posteriore', nomi: ['Paraurti posteriore'], x: 78, y: 248,
    forma: 'M60 236 L114 236 L114 262 L62 262 Z' },
]
