// Zone dell'auto che si "aprono". I nomi dei pezzi sono quelli del gestionale: se un nome non esiste
// (o viene rinominato) quel pezzo semplicemente non compare, senza rompere il resto.
// `forma` è la parte di carrozzeria che si stacca; `sposta` di quanto si sposta (nello spazio del disegno);
// `interno` sono i componenti disegnati sotto, che compaiono quando la zona si apre.
export const zone = [
  {
    id: 'vano-motore',
    etichetta: 'Vano motore e frontale',
    intro: 'Dal cofano al motore, fino al radiatore e ai fari.',
    forma: 'M594 174 L706 196 C742 200 760 214 763 236 L764 262 L664 262 L650 238 L618 204 Z',
    sposta: { x: 16, y: -36 },
    interno: 'M622 216 h88 v32 h-88 z M638 232 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M660 232 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M682 232 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M704 232 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M644 202 h40 v10 h-40 z M730 206 v42 M736 206 v42 M610 204 h22 v10 h-22 z',
    gruppi: [
      { titolo: 'Motore', nomi: ['Motore completo', 'Testata motore', 'Guarnizione testata', 'Pistone', 'Albero motore', 'Albero a camme', 'Volano', 'Coppa dell’olio', 'Puleggia', 'Supporto motore', 'Cinghia distribuzione', 'Kit distribuzione', 'Cinghia servizi'] },
      { titolo: 'Aspirazione e turbo', nomi: ['Turbina / turbocompressore', 'Valvola turbo', 'Intercooler', 'Collettore aspirazione', 'Corpo farfallato', 'Valvola EGR', 'Filtro aria', 'Scatola filtro aria', 'Presa aria'] },
      { titolo: 'Raffreddamento', nomi: ['Radiatore acqua', 'Radiatore olio', 'Pompa acqua', 'Elettroventola', 'Resistenza ventola', 'Valvola termostatica', 'Manicotto radiatore', 'Radiatore riscaldamento'] },
      { titolo: 'Elettrico e centraline', nomi: ['Alternatore', 'Regolatore alternatore', 'Motorino avviamento', 'Batteria', 'Vano batteria', 'Bobina di accensione', 'Gruppo bobine', 'Centralina motore (ECU)', 'ECU / centralina motore', 'Centralina motore diesel', 'Centralina iniezione', 'Centralina preriscaldo', 'Cablaggio motore', 'Fusibile / scatola fusibili'] },
      { titolo: 'Alimentazione e olio', nomi: ['Iniettore', 'Carburatore', 'Pompa carburante', 'Filtro carburante', 'Pompa olio', 'Filtro olio', 'Asta livello olio', 'Sensore pressione olio', 'Sensore livello olio', 'Impianto GPL'] },
      { titolo: 'Cofano e carrozzeria anteriore', nomi: ['Cofano', 'Asta cofano', 'Cerniera cofano', 'Serratura cofano', 'Paratia motore', 'Mascherina anteriore', 'Griglia anteriore', 'Muso anteriore', 'Paraurti anteriore', 'Fascia paraurti', 'Rinforzo paraurti', 'Parafango anteriore', 'Faro anteriore', 'Fanale anteriore', 'Gruppo ottico', 'Fendinebbia', 'Antinebbia / fendinebbia'] },
    ],
  },
  {
    id: 'abitacolo',
    etichetta: 'Abitacolo',
    intro: 'Plancia, sedili, sicurezza e tutto quello che c’è dentro.',
    forma: 'M158 207 C206 168 262 138 330 126 L436 120 C496 120 552 142 594 172 L552 186 L236 200 Z',
    sposta: { x: 0, y: -38 },
    interno: 'M470 192 l-6 -32 q-2 -10 8 -10 h10 q8 0 8 10 l6 32 M296 192 l-6 -32 q-2 -10 8 -10 h10 q8 0 8 10 l6 32 M524 184 m-6 0 a6 10 0 1 0 12 0 a6 10 0 1 0 -12 0 M552 186 l-16 -14 M240 192 h320',
    gruppi: [
      { titolo: 'Plancia e comandi', nomi: ['Cruscotto', 'Quadro strumenti', 'Pannello strumenti', 'Volante', 'Piantone sterzo', 'Canna sterzo', 'Blocco accensione', 'Devioluci', 'Interruttore luci', 'Leva cambio', 'Leva freno a mano', 'Pedaliera', 'Pedale acceleratore', 'Pedale freno', 'Comando finestrino'] },
      { titolo: 'Sicurezza', nomi: ['Airbag', 'Airbag conducente', 'Airbag passeggero', 'Airbag laterale', 'Airbag a tendina', 'Kit airbag', 'Centralina airbag', 'Sensore airbag', 'Cintura di sicurezza'] },
      { titolo: 'Sedili e interni', nomi: ['Sedile anteriore', 'Sedile posteriore', 'Appoggiatesta', 'Bracciolo', 'Cappelliera', 'Tappetino', 'Parasole', 'Retrovisore interno', 'Specchietto retrovisore interno'] },
      { titolo: 'Multimedia e clima', nomi: ['Autoradio', 'Display / schermo', 'Navigatore', 'Antenna', 'Tromba / clacson', 'Ventola abitacolo', 'Riscaldatore', 'Compressore aria condizionata', 'Condensatore climatizzatore'] },
      { titolo: 'Centraline e sensori', nomi: ['Body computer', 'Centralina comfort', 'Centralina luci', 'Centralina parcheggio', 'Centralina sensori parcheggio', 'Sensore parcheggio', 'Sensore pioggia', 'Cablaggio principale'] },
      { titolo: 'Tergicristalli', nomi: ['Tergicristallo', 'Motorino tergicristallo'] },
    ],
  },
  {
    id: 'portiere',
    etichetta: 'Portiere e vetri',
    intro: 'Portiere, serrature, specchietti e alzacristalli.',
    forma: 'M236 202 L552 186 L528 262 L272 262 Z',
    sposta: { x: 0, y: 20 },
    interno: 'M250 216 L520 210 M250 226 L516 220 M330 238 m-10 0 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M440 236 h40 v14 h-40 z',
    gruppi: [
      { titolo: 'Portiere', nomi: ['Portiera anteriore', 'Portiera posteriore', 'Cerniera portiera', 'Serratura portiera', 'Maniglia esterna', 'Maniglia interna', 'Nottolino porta', 'Cablaggio portiera', 'Centralina porta', 'Interruttore portiera'] },
      { titolo: 'Vetri e alzacristalli', nomi: ['Finestrino', 'Cristallo / vetro laterale', 'Alzacristalli elettrico', 'Dispositivo alzacristalli', 'Motorino alzacristalli', 'Interruttore alzacristalli'] },
      { titolo: 'Esterni', nomi: ['Specchietto retrovisore', 'Emblema / logo', 'Parafango anteriore', 'Parafango posteriore'] },
    ],
  },
  {
    id: 'posteriore',
    etichetta: 'Posteriore e bagagliaio',
    intro: 'Portellone, luci, paraurti, serbatoio e scarico finale.',
    forma: 'M60 262 C54 240 62 222 92 214 L158 207 L236 200 L272 262 Z',
    sposta: { x: -26, y: -24 },
    interno: 'M98 238 h76 q8 0 8 8 v8 h-92 v-8 q0 -8 8 -8 z M150 224 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0 M64 254 h28',
    gruppi: [
      { titolo: 'Portellone e baule', nomi: ['Portellone posteriore', 'Baule', 'Fondo baule', 'Ammortizzatore portellone', 'Spoiler', 'Motorino tergilunotto', 'Gancio traino'] },
      { titolo: 'Paraurti e luci', nomi: ['Paraurti posteriore', 'Faro posteriore', 'Terzo stop', 'Retronebbia', 'Luce di posizione', 'Lampadina', 'Gruppo ottico'] },
      { titolo: 'Carburante', nomi: ['Serbatoio carburante', 'Tappo carburante', 'Galleggiante carburante', 'Pompa carburante'] },
    ],
  },
  {
    id: 'sottoscocca',
    etichetta: 'Sottoscocca e trasmissione',
    intro: 'Cambio, frizione, scarico, sospensioni, sterzo e freni.',
    forma: 'M276 250 L524 250 L524 272 L276 272 Z',
    sposta: { x: 0, y: 30 },
    interno: 'M120 262 C220 262 300 258 420 260 L520 260 M380 254 h50 v14 h-50 z M200 254 h24 v22 h-24 z M500 258 h44 v22 h-44 z',
    gruppi: [
      { titolo: 'Cambio e frizione', nomi: ['Cambio manuale', 'Cambio automatico', 'Centralina cambio', 'Supporto cambio', 'Leva cambio', 'Forcella cambio', 'Cavo selettore', 'Frizione completa', 'Kit frizione', 'Disco frizione', 'Cilindro secondario frizione', 'Filtro cambio automatico'] },
      { titolo: 'Trasmissione', nomi: ['Albero di trasmissione', 'Differenziale', 'Cuscinetto differenziale', 'Semiasse', 'Flangia'] },
      { titolo: 'Scarico', nomi: ['Catalizzatore', 'Filtro antiparticolato (DPF)', 'Filtro antiparticolato benzina', 'Collettore scarico', 'Flessibile scarico', 'Terminale scarico', 'Sensore temperatura'] },
      { titolo: 'Sospensioni e sterzo', nomi: ['Ammortizzatore anteriore', 'Ammortizzatore posteriore', 'Barra di torsione', 'Braccetto sospensione', 'Braccio oscillante', 'Sterzo', 'Scatola sterzo', 'Scatola guida', 'Cremagliera sterzo', 'Tirante sterzo', 'Pompa servosterzo', 'Tubo servosterzo', 'EPS / servosterzo elettrico', 'Centralina servosterzo'] },
      { titolo: 'Freni e ABS', nomi: ['Disco freno', 'Pastiglie freno', 'Pompa freni', 'Cilindro maestro', 'Servofreno', 'ABS / centralina ABS', 'Centralina ABS', 'Gruppo ABS', 'Pompa ABS', 'Sensore ABS'] },
    ],
  },
  {
    id: 'ruote',
    etichetta: 'Ruote e freni',
    intro: 'Cerchi, gomme, mozzi e componenti dei freni.',
    forma: 'M160 268 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0 M540 268 a50 50 0 1 0 100 0 a50 50 0 1 0 -100 0',
    sposta: { x: 0, y: 24 },
    interno: 'M210 268 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 M590 268 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0 M226 250 h14 v16 h-14 z M606 250 h14 v16 h-14 z',
    gruppi: [
      { titolo: 'Cerchi e gomme', nomi: ['Cerchio in lega', 'Cerchio in ferro', 'Gomma / pneumatico', 'Ruota di scorta'] },
      { titolo: 'Mozzo e freni', nomi: ['Mozzo ruota', 'Ralla / cuscinetto ruota', 'Disco freno', 'Pastiglie freno', 'Sensore ABS'] },
    ],
  },
]
