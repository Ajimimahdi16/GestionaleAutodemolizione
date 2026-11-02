// Punti cliccabili sull'auto. Le coordinate sono nello spazio del disegno (viewBox 36 92 748 244).
// `nomi` sono i tipi di pezzo del gestionale collegati al punto (il primo trovato è quello "principale").
// `forma` è l'area che si illumina quando il punto è attivo.
export const parti = [
  { id: 'faro-anteriore', etichetta: 'Faro anteriore', nomi: ['Faro anteriore', 'Fanale anteriore'], x: 728, y: 214,
    forma: 'M706 208 C728 204 746 210 752 220 L712 220 Z' },
  { id: 'cofano', etichetta: 'Cofano', nomi: ['Cofano'], x: 652, y: 187,
    forma: 'M598 174 L706 196 L708 206 L650 200 L594 182 Z' },
  { id: 'paraurti-anteriore', etichetta: 'Paraurti anteriore', nomi: ['Paraurti anteriore'], x: 748, y: 248,
    forma: 'M690 226 L753 226 C761 236 764 250 764 262 L690 262 Z' },
  { id: 'specchietto', etichetta: 'Specchietto retrovisore', nomi: ['Specchietto retrovisore'], x: 564, y: 177,
    forma: 'M548 176 L574 170 C581 170 584 176 581 181 L552 185 Z' },
  { id: 'portiera-anteriore', etichetta: 'Portiera anteriore', nomi: ['Portiera anteriore'], x: 468, y: 232,
    forma: 'M394 200 L548 198 L528 262 L394 262 Z' },
  { id: 'portiera-posteriore', etichetta: 'Portiera posteriore', nomi: ['Portiera posteriore'], x: 316, y: 232,
    forma: 'M236 202 L388 200 L388 262 L272 262 Z' },
  { id: 'cerchio', etichetta: 'Cerchio', nomi: ['Cerchio in lega', 'Cerchio in ferro'], x: 590, y: 268,
    forma: 'M540 268 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0' },
  { id: 'portellone', etichetta: 'Portellone / baule', nomi: ['Portellone posteriore', 'Baule'], x: 124, y: 200,
    forma: 'M96 214 L156 207 L190 180 L128 196 Z' },
  { id: 'faro-posteriore', etichetta: 'Faro posteriore', nomi: ['Faro posteriore'], x: 82, y: 224,
    forma: 'M64 218 L96 214 L98 230 L68 232 Z' },
  { id: 'paraurti-posteriore', etichetta: 'Paraurti posteriore', nomi: ['Paraurti posteriore'], x: 84, y: 250,
    forma: 'M60 238 L116 240 L114 262 L62 262 Z' },
]
