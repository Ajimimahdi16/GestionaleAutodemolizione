-- Seed idempotente per gli elenchi Pezzo e Colore.
-- Aggiunge voci mancanti, non cancella né modifica i ricambi esistenti.
USE gestionale_ricambi;

-- Anche l'API /api/marche usa un catalogo dedicato.
-- Popoliamo la tabella con le marche già presenti nei veicoli.
CREATE TABLE IF NOT EXISTS marche (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_marche_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO marche (nome)
SELECT DISTINCT TRIM(marca) FROM veicoli
WHERE marca IS NOT NULL AND TRIM(marca) <> '';

-- I nomi sono univoci e senza distinzione tra maiuscole/minuscole.
CREATE TABLE IF NOT EXISTS colori (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_colori_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserisce anche i colori già presenti nei ricambi, poi completa il catalogo.
INSERT IGNORE INTO colori (nome)
SELECT DISTINCT TRIM(colore) FROM pezzi
WHERE colore IS NOT NULL AND TRIM(colore) <> '';

INSERT IGNORE INTO colori (nome) VALUES
('Antracite'), ('Arancione'), ('Argento'), ('Avorio'), ('Azzurro'), ('Beige'),
('Bianco'), ('Bianco avorio'), ('Bianco perlato'), ('Blu'), ('Blu chiaro'),
('Blu scuro'), ('Blu metallizzato'), ('Bordeaux'), ('Bronzo'), ('Camoscio'),
('Celeste'), ('Champagne'), ('Crema'), ('Giallo'), ('Giallo metallizzato'),
('Grafite'), ('Grigio'), ('Grigio antracite'), ('Grigio chiaro'), ('Grigio scuro'),
('Grigio metallizzato'), ('Grigio perla'), ('Marrone'), ('Marrone metallizzato'),
('Nero'), ('Nero opaco'), ('Nero metallizzato'), ('Oro'), ('Rosa'), ('Rosso'),
('Rosso metallizzato'), ('Tortora'), ('Trasparente'), ('Turchese'), ('Verde'),
('Verde chiaro'), ('Verde scuro'), ('Verde metallizzato'), ('Viola'),
('Viola metallizzato'), ('Non verniciato'), ('Altro');

-- Il nome della tipologia è già UNIQUE nello schema del gestionale.
-- INSERT IGNORE permette di rieseguire questo elenco senza creare doppioni.
INSERT IGNORE INTO tipologie_pezzo (nome) VALUES
('ABS / centralina ABS'), ('Airbag'), ('Airbag conducente'), ('Airbag passeggero'), ('Airbag laterale'), ('Airbag a tendina'),
('Albero a camme'), ('Albero di trasmissione'), ('Albero motore'), ('Alternatore'), ('Ammortizzatore anteriore'), ('Ammortizzatore posteriore'), ('Ammortizzatore portellone'), ('Antenna'), ('Antinebbia / fendinebbia'), ('Appoggiatesta'), ('Asta cofano'), ('Asta livello olio'), ('Autoradio'),
('Batteria'), ('Baule'), ('Blocco accensione'), ('Bobina di accensione'), ('Body computer'), ('Braccio oscillante'), ('Braccetto sospensione'), ('Bracciolo'),
('Cablaggio motore'), ('Cablaggio portiera'), ('Cablaggio principale'), ('Cambio automatico'), ('Cambio manuale'), ('Canna sterzo'), ('Cappelliera'), ('Carburatore'), ('Catalizzatore'), ('Cerchio in lega'), ('Cerchio in ferro'), ('Cerniera cofano'), ('Cerniera portiera'), ('Cinghia distribuzione'), ('Cinghia servizi'), ('Cintura di sicurezza'), ('Centralina ABS'), ('Centralina airbag'), ('Centralina cambio'), ('Centralina comfort'), ('Centralina motore (ECU)'), ('Centralina servosterzo'), ('Centralina sensori parcheggio'), ('Centralina porta'), ('Centralina preriscaldo'), ('Centralina iniezione'), ('Centralina luci'), ('Centralina elettronica'), ('Cofano'), ('Collettore aspirazione'), ('Collettore scarico'), ('Compressore aria condizionata'), ('Condensatore climatizzatore'), ('Coppa dell’olio'), ('Corpo farfallato'), ('Cremagliera sterzo'), ('Cruscotto'), ('Cristallo / vetro laterale'),
('Devioluci'), ('Differenziale'), ('Disco freno'), ('Disco frizione'), ('Display / schermo'), ('Dispositivo alzacristalli'),
('ECU / centralina motore'), ('Elettroventola'), ('Emblema / logo'), ('EPS / servosterzo elettrico'),
('Faro anteriore'), ('Faro posteriore'), ('Fascia paraurti'), ('Fendinebbia'), ('Filtro aria'), ('Filtro antiparticolato (DPF)'), ('Filtro carburante'), ('Filtro olio'), ('Finestrino'), ('Flangia'), ('Flessibile scarico'), ('Fondo baule'), ('Forcella cambio'), ('Frizione completa'), ('Fusibile / scatola fusibili'),
('Gancio traino'), ('Galleggiante carburante'), ('Gomma / pneumatico'), ('Griglia anteriore'), ('Griglia paraurti'), ('Gruppo ottico'), ('Guarnizione testata'),
('Impianto GPL'), ('Iniettore'), ('Intercooler'), ('Interruttore alzacristalli'), ('Interruttore luci'), ('Interruttore portiera'),
('Kit distribuzione'), ('Kit frizione'), ('Kit airbag'),
('Lampadina'), ('Leva cambio'), ('Leva freno a mano'), ('Maniglia esterna'), ('Maniglia interna'), ('Manicotto radiatore'), ('Mascherina anteriore'), ('Motorino alzacristalli'), ('Motorino avviamento'), ('Motorino tergicristallo'), ('Mozzo ruota'), ('Motore completo'), ('Muso anteriore'),
('Navigatore'), ('Nottolino porta'),
('Olio / tappo coppa'),
('Parafango anteriore'), ('Parafango posteriore'), ('Paraurti anteriore'), ('Paraurti posteriore'), ('Paratia motore'), ('Parasole'), ('Pastiglie freno'), ('Pedale acceleratore'), ('Pedale freno'), ('Pedaliera'), ('Piantone sterzo'), ('Pistone'), ('Pompa ABS'), ('Pompa acqua'), ('Pompa carburante'), ('Pompa freni'), ('Pompa olio'), ('Pompa servosterzo'), ('Portellone posteriore'), ('Portiera anteriore'), ('Portiera posteriore'), ('Presa aria'), ('Puleggia'),
('Quadro strumenti'), ('Radiatore acqua'), ('Radiatore olio'), ('Radiatore riscaldamento'), ('Ralla / cuscinetto ruota'), ('Regolatore alternatore'), ('Resistenza ventola'), ('Retronebbia'), ('Retrovisore interno'), ('Rinforzo paraurti'), ('Riscaldatore'), ('Ruota di scorta'),
('Scatola filtro aria'), ('Scatola guida'), ('Scatola sterzo'), ('Sedile anteriore'), ('Sedile posteriore'), ('Semiasse'), ('Sensore ABS'), ('Sensore airbag'), ('Sensore albero motore'), ('Sensore parcheggio'), ('Sensore pressione'), ('Sensore pioggia'), ('Sensore temperatura'), ('Serbatoio carburante'), ('Serratura cofano'), ('Serratura portiera'), ('Servofreno'), ('Specchietto retrovisore'), ('Specchietto retrovisore interno'), ('Spoiler'), ('Supporto motore'), ('Supporto cambio'), ('Sterzo'),
('Tappo carburante'), ('Tappetino'), ('Tergicristallo'), ('Terminale scarico'), ('Terzo stop'), ('Testata motore'), ('Tirante sterzo'), ('Tromba / clacson'), ('Turbina / turbocompressore'),
('Valvola EGR'), ('Valvola termostatica'), ('Vano batteria'), ('Ventola abitacolo'), ('Volano'), ('Volante'),
('Alzacristalli elettrico'), ('Barra di torsione'), ('Cavo acceleratore'), ('Cavo selettore'), ('Centralina motore diesel'), ('Centralina parcheggio'), ('Cilindro maestro'), ('Cilindro secondario frizione'), ('Comando finestrino'), ('Cuscinetto differenziale'), ('Filtro cambio automatico'), ('Filtro antiparticolato benzina'), ('Gruppo ABS'), ('Gruppo bobine'), ('Luce di posizione'), ('Motorino tergilunotto'), ('Pannello strumenti'), ('Sensore livello olio'), ('Sensore pressione olio'), ('Tubo servosterzo'), ('Valvola turbo'),
('Altro pezzo…');

-- Non crea tipo_codice se la colonna non esiste; se esiste, mantiene i valori attuali.
SET @esiste_tipo_codice = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tipologie_pezzo' AND COLUMN_NAME = 'tipo_codice'
);
SET @sql_tipo_codice = IF(
  @esiste_tipo_codice > 0,
  'UPDATE tipologie_pezzo SET tipo_codice = CASE WHEN nome = ''Motore completo'' THEN ''motore'' WHEN nome IN (''ABS / centralina ABS'', ''Autoradio'', ''Body computer'', ''Centralina ABS'', ''Centralina airbag'', ''Centralina cambio'', ''Centralina comfort'', ''Centralina motore (ECU)'', ''Centralina servosterzo'', ''Centralina sensori parcheggio'', ''Centralina porta'', ''Centralina preriscaldo'', ''Centralina iniezione'', ''Centralina luci'', ''Centralina elettronica'', ''ECU / centralina motore'', ''Navigatore'', ''Quadro strumenti'') THEN ''codice'' ELSE tipo_codice END WHERE nome = ''Motore completo'' OR nome IN (''ABS / centralina ABS'', ''Autoradio'', ''Body computer'', ''Centralina ABS'', ''Centralina airbag'', ''Centralina cambio'', ''Centralina comfort'', ''Centralina motore (ECU)'', ''Centralina servosterzo'', ''Centralina sensori parcheggio'', ''Centralina porta'', ''Centralina preriscaldo'', ''Centralina iniezione'', ''Centralina luci'', ''Centralina elettronica'', ''ECU / centralina motore'', ''Navigatore'', ''Quadro strumenti'')',
  'SELECT 1'
);
PREPARE stmt_tipo_codice FROM @sql_tipo_codice;
EXECUTE stmt_tipo_codice;
DEALLOCATE PREPARE stmt_tipo_codice;
