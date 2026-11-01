-- Cataloghi ri-eseguibili: non cancella tipologie, veicoli, colori o ricambi.
-- Eseguire con MySQL Workbench oppure con il comando indicato nel README.
USE gestionale_ricambi;

-- 1) Unifica eventuali record veicolo con stessa marca e modello.
-- I ricambi collegati vengono ripuntati al record più vecchio; gli intervalli
-- presenti vengono uniti, così non si perdono gli anni già registrati.
DROP TEMPORARY TABLE IF EXISTS tmp_catalogo_veicoli;
DROP TEMPORARY TABLE IF EXISTS tmp_mappa_veicoli;
CREATE TEMPORARY TABLE tmp_catalogo_veicoli AS
SELECT MIN(id) AS id_principale, marca, modello, MIN(anno_da) AS anno_da, MAX(anno_a) AS anno_a
FROM veicoli
GROUP BY marca, modello;
CREATE TEMPORARY TABLE tmp_mappa_veicoli AS
SELECT v.id, c.id_principale
FROM veicoli v
JOIN tmp_catalogo_veicoli c ON c.marca = v.marca AND c.modello = v.modello;
UPDATE veicoli v
JOIN tmp_catalogo_veicoli c ON c.id_principale = v.id
SET v.anno_da = c.anno_da, v.anno_a = c.anno_a;
UPDATE pezzi p
JOIN tmp_mappa_veicoli m ON m.id = p.veicolo_id
SET p.veicolo_id = m.id_principale
WHERE p.veicolo_id <> m.id_principale;
DELETE v FROM veicoli v
JOIN tmp_mappa_veicoli m ON m.id = v.id
WHERE m.id <> m.id_principale;
DROP TEMPORARY TABLE tmp_mappa_veicoli;
DROP TEMPORARY TABLE tmp_catalogo_veicoli;

-- Gli anni sono facoltativi per i modelli di catalogo senza intervallo noto.
ALTER TABLE veicoli
  MODIFY anno_da SMALLINT UNSIGNED NULL,
  MODIFY anno_a SMALLINT UNSIGNED NULL;

-- Sostituisce il vecchio indice univoco (marca, modello, anni) con marca+modello.
SET @esiste_indice = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veicoli' AND INDEX_NAME = 'uq_veicolo'
);
SET @sql_indice = IF(@esiste_indice > 0, 'ALTER TABLE veicoli DROP INDEX uq_veicolo', 'SELECT 1');
PREPARE stmt_indice FROM @sql_indice;
EXECUTE stmt_indice;
DEALLOCATE PREPARE stmt_indice;
SET @esiste_indice = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'veicoli' AND INDEX_NAME = 'uq_veicoli_marca_modello'
);
SET @sql_indice = IF(@esiste_indice = 0, 'CREATE UNIQUE INDEX uq_veicoli_marca_modello ON veicoli (marca, modello)', 'SELECT 1');
PREPARE stmt_indice FROM @sql_indice;
EXECUTE stmt_indice;
DEALLOCATE PREPARE stmt_indice;

-- 2) Catalogo dei colori. La collation evita doppioni che differiscono solo
-- per maiuscole/minuscole.
CREATE TABLE IF NOT EXISTS colori (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_colori_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS marche (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(80) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_marche_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO colori (nome) VALUES
('Antracite'), ('Arancione'), ('Argento'), ('Avorio'), ('Azzurro'), ('Beige'),
('Bianco'), ('Bianco avorio'), ('Bianco perlato'), ('Blu'), ('Blu chiaro'),
('Blu scuro'), ('Blu metallizzato'), ('Bordeaux'), ('Bronzo'), ('Camoscio'),
('Celeste'), ('Champagne'), ('Crema'), ('Giallo'), ('Giallo metallizzato'),
('Grigio'), ('Grigio antracite'), ('Grigio chiaro'), ('Grigio scuro'),
('Grigio metallizzato'), ('Grigio perla'), ('Marrone'), ('Marrone metallizzato'),
('Nero'), ('Nero opaco'), ('Nero metallizzato'), ('Oro'), ('Rosa'), ('Rosso'),
('Rosso metallizzato'), ('Tortora'), ('Trasparente'), ('Verde'), ('Verde chiaro'),
('Verde scuro'), ('Verde metallizzato'), ('Viola'), ('Viola metallizzato'),
('Non verniciato'), ('Altro');

-- 3) Oltre 200 tipologie di ricambio. INSERT IGNORE conserva i record esistenti.
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

-- Se tipo_codice esiste già, assegna la categoria ai componenti speciali.
-- La colonna non viene creata da questo script se non è presente.
SET @esiste_tipo_codice = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tipologie_pezzo' AND COLUMN_NAME = 'tipo_codice'
);
SET @sql_tipo_codice = IF(
  @esiste_tipo_codice > 0,
  'UPDATE tipologie_pezzo SET tipo_codice = CASE WHEN nome IN (''Motore completo'') THEN ''motore'' WHEN nome IN (''ABS / centralina ABS'', ''Autoradio'', ''Body computer'', ''Centralina ABS'', ''Centralina airbag'', ''Centralina cambio'', ''Centralina comfort'', ''Centralina motore (ECU)'', ''Centralina servosterzo'', ''Centralina sensori parcheggio'', ''Centralina porta'', ''Centralina preriscaldo'', ''Centralina iniezione'', ''Centralina luci'', ''Centralina elettronica'', ''ECU / centralina motore'', ''Navigatore'', ''Quadro strumenti'') THEN ''codice'' ELSE tipo_codice END WHERE nome IN (''Motore completo'', ''ABS / centralina ABS'', ''Autoradio'', ''Body computer'', ''Centralina ABS'', ''Centralina airbag'', ''Centralina cambio'', ''Centralina comfort'', ''Centralina motore (ECU)'', ''Centralina servosterzo'', ''Centralina sensori parcheggio'', ''Centralina porta'', ''Centralina preriscaldo'', ''Centralina iniezione'', ''Centralina luci'', ''Centralina elettronica'', ''ECU / centralina motore'', ''Navigatore'', ''Quadro strumenti'')',
  'SELECT 1'
);
PREPARE stmt_tipo_codice FROM @sql_tipo_codice;
EXECUTE stmt_tipo_codice;
DEALLOCATE PREPARE stmt_tipo_codice;

-- 4) Catalogo ampio di marche/modelli diffuse in Italia ed Europa.
-- Anni NULL indicano che l'intervallo non è stato specificato per il catalogo.
INSERT INTO veicoli (marca, modello, anno_da, anno_a) VALUES
('Abarth','124 Spider',2016,2020),('Abarth','500',2008,2014),('Abarth','500e',2023,NULL),('Abarth','595',2012,2024),('Abarth','695',2008,2024),
('Alfa Romeo','145',1994,2001),('Alfa Romeo','146',1995,2001),('Alfa Romeo','147',2000,2010),('Alfa Romeo','156',1997,2007),('Alfa Romeo','159',2005,2011),('Alfa Romeo','166',1998,2007),('Alfa Romeo','Brera',2005,2010),('Alfa Romeo','Giulia',1962,NULL),('Alfa Romeo','Giulietta',1977,2020),('Alfa Romeo','MiTo',2008,2018),('Alfa Romeo','Stelvio',2017,NULL),('Alfa Romeo','Tonale',2022,NULL),
('Audi','A1',2010,NULL),('Audi','A2',1999,2005),('Audi','A3',1996,NULL),('Audi','A4',1994,NULL),('Audi','A5',2007,NULL),('Audi','A6',1994,NULL),('Audi','A8',1994,NULL),('Audi','Q2',2016,NULL),('Audi','Q3',2011,NULL),('Audi','Q5',2008,NULL),('Audi','Q7',2005,NULL),('Audi','TT',1998,2023),
('BMW','Serie 1',2004,NULL),('BMW','Serie 2',2014,NULL),('BMW','Serie 3',1975,NULL),('BMW','Serie 4',2013,NULL),('BMW','Serie 5',1972,NULL),('BMW','Serie 7',1977,NULL),('BMW','X1',2009,NULL),('BMW','X3',2003,NULL),('BMW','X5',1999,NULL),('BMW','X6',2008,NULL),('BMW','Z3',1995,2002),('BMW','Z4',2002,NULL),
('BYD','Atto 3',2022,NULL),('BYD','Dolphin',2021,NULL),('BYD','Seal',2022,NULL),('BYD','Tang',2015,NULL),
('Chevrolet','Aveo',2002,2011),('Chevrolet','Captiva',2006,2018),('Chevrolet','Cruze',2008,2016),('Chevrolet','Matiz',2005,2010),('Chevrolet','Spark',2009,2015),('Chevrolet','Trax',2013,2022),
('Chrysler','300C',2004,2014),('Chrysler','Voyager',1984,2016),
('Citroën','Berlingo',1996,NULL),('Citroën','C1',2005,2022),('Citroën','C2',2003,2009),('Citroën','C3',2002,NULL),('Citroën','C3 Aircross',2017,NULL),('Citroën','C4',2004,NULL),('Citroën','C4 Cactus',2014,2020),('Citroën','C5',2001,2017),('Citroën','C5 Aircross',2017,NULL),('Citroën','DS3',2009,2015),('Citroën','Saxo',1996,2003),('Citroën','Xsara',1997,2006),
('Cupra','Ateca',2018,NULL),('Cupra','Born',2021,NULL),('Cupra','Formentor',2020,NULL),('Cupra','Leon',2020,NULL),
('Dacia','Dokker',2012,2021),('Dacia','Duster',2010,NULL),('Dacia','Lodgy',2012,2022),('Dacia','Logan',2004,NULL),('Dacia','Sandero',2008,NULL),('Dacia','Spring',2021,NULL),
('Daewoo','Kalos',2002,2007),('Daewoo','Lanos',1997,2002),('Daewoo','Matiz',1998,2005),('Daewoo','Nubira',1997,2002),
('Daihatsu','Cuore',1980,2011),('Daihatsu','Materia',2006,2013),('Daihatsu','Sirion',1998,2011),('Daihatsu','Terios',1997,2017),
('DS Automobiles','DS 3',2015,NULL),('DS Automobiles','DS 4',2011,NULL),('DS Automobiles','DS 7',2017,NULL),('DS Automobiles','DS 9',2020,NULL),
('Fiat','126',1972,2000),('Fiat','500',1957,NULL),('Fiat','500L',2012,2022),('Fiat','500X',2014,2024),('Fiat','600',1955,NULL),('Fiat','Bravo',1995,2014),('Fiat','Brava',1995,2001),('Fiat','Cinquecento',1991,1998),('Fiat','Croma',1985,2011),('Fiat','Doblò',2000,NULL),('Fiat','Ducato',1981,NULL),('Fiat','Fiorino',1977,NULL),('Fiat','Grande Punto',2005,2018),('Fiat','Idea',2003,2012),('Fiat','Marea',1996,2007),('Fiat','Multipla',1998,2010),('Fiat','Panda',1980,NULL),('Fiat','Punto',1993,2018),('Fiat','Qubo',2008,2020),('Fiat','Seicento',1998,2010),('Fiat','Stilo',2001,2008),('Fiat','Tipo',1988,NULL),('Fiat','Ulysse',1994,2010),('Fiat','Uno',1983,2013),
('Ford','B-Max',2012,2017),('Ford','C-Max',2003,2019),('Ford','EcoSport',2013,2023),('Ford','Fiesta',1976,2023),('Ford','Focus',1998,NULL),('Ford','Fusion',2002,2012),('Ford','Galaxy',1995,2023),('Ford','Ka',1996,2021),('Ford','Kuga',2008,NULL),('Ford','Mondeo',1993,2022),('Ford','Puma',1997,NULL),('Ford','S-Max',2006,2023),('Ford','Transit',1965,NULL),
('Honda','Accord',1976,2015),('Honda','Civic',1972,NULL),('Honda','CR-V',1995,NULL),('Honda','HR-V',1999,NULL),('Honda','Jazz',2001,NULL),
('Hyundai','i10',2007,NULL),('Hyundai','i20',2008,NULL),('Hyundai','i30',2007,NULL),('Hyundai','Kona',2017,NULL),('Hyundai','Santa Fe',2000,NULL),('Hyundai','Tucson',2004,NULL),
('Jaguar','E-Pace',2017,NULL),('Jaguar','F-Pace',2016,NULL),('Jaguar','F-Type',2013,NULL),('Jaguar','S-Type',1999,2008),('Jaguar','XE',2015,NULL),('Jaguar','XF',2007,NULL),('Jaguar','XJ',1968,2019),
('Jeep','Cherokee',1974,NULL),('Jeep','Compass',2006,NULL),('Jeep','Grand Cherokee',1993,NULL),('Jeep','Renegade',2014,NULL),('Jeep','Wrangler',1986,NULL),
('Kia','Carens',1999,2019),('Kia','Ceed',2006,NULL),('Kia','Niro',2016,NULL),('Kia','Picanto',2004,NULL),('Kia','Rio',1999,NULL),('Kia','Sportage',1993,NULL),
('Lancia','Dedra',1989,2000),('Lancia','Delta',1979,2014),('Lancia','Lybra',1999,2005),('Lancia','Musa',2004,2012),('Lancia','Phedra',2002,2010),('Lancia','Thema',1984,2014),('Lancia','Y',1995,2003),('Lancia','Ypsilon',2003,NULL),
('Land Rover','Defender',1983,NULL),('Land Rover','Discovery',1989,NULL),('Land Rover','Freelander',1997,2014),('Land Rover','Range Rover',1970,NULL),('Land Rover','Range Rover Evoque',2011,NULL),
('Mazda','2',2002,NULL),('Mazda','3',2003,NULL),('Mazda','6',2002,NULL),('Mazda','CX-3',2015,NULL),('Mazda','CX-30',2019,NULL),('Mazda','CX-5',2012,NULL),('Mazda','MX-5',1989,NULL),
('Mercedes-Benz','Classe A',1997,NULL),('Mercedes-Benz','Classe B',2005,NULL),('Mercedes-Benz','Classe C',1993,NULL),('Mercedes-Benz','Classe E',1984,NULL),('Mercedes-Benz','Classe S',1972,NULL),('Mercedes-Benz','CLA',2013,NULL),('Mercedes-Benz','GLA',2013,NULL),('Mercedes-Benz','GLC',2015,NULL),('Mercedes-Benz','ML',1997,2015),('Mercedes-Benz','Sprinter',1995,NULL),
('MINI','Clubman',2007,NULL),('MINI','Countryman',2010,NULL),('MINI','Mini',1959,NULL),
('Mitsubishi','ASX',2010,NULL),('Mitsubishi','Colt',1978,2012),('Mitsubishi','L200',1978,NULL),('Mitsubishi','Lancer',1973,2017),('Mitsubishi','Outlander',2001,NULL),('Mitsubishi','Pajero',1982,2021),('Mitsubishi','Space Star',1998,NULL),
('Nissan','Juke',2010,NULL),('Nissan','Micra',1982,2022),('Nissan','Navara',1985,NULL),('Nissan','Qashqai',2006,NULL),('Nissan','X-Trail',2001,NULL),
('Opel','Agila',2000,2014),('Opel','Astra',1991,NULL),('Opel','Corsa',1982,NULL),('Opel','Crossland',2017,NULL),('Opel','Frontera',1991,NULL),('Opel','Insignia',2008,2022),('Opel','Meriva',2003,2017),('Opel','Mokka',2012,NULL),('Opel','Tigra',1994,2009),('Opel','Vectra',1988,2008),('Opel','Zafira',1999,2019),
('Peugeot','106',1991,2003),('Peugeot','107',2005,2014),('Peugeot','108',2014,2021),('Peugeot','2008',2013,NULL),('Peugeot','206',1998,2012),('Peugeot','207',2006,2014),('Peugeot','208',2012,NULL),('Peugeot','307',2001,2008),('Peugeot','308',2007,NULL),('Peugeot','3008',2009,NULL),('Peugeot','407',2004,2011),('Peugeot','5008',2009,NULL),('Peugeot','508',2010,NULL),('Peugeot','Partner',1996,NULL),('Peugeot','Rifter',2018,NULL),
('Porsche','718',2016,NULL),('Porsche','911',1963,NULL),('Porsche','Boxster',1996,NULL),('Porsche','Cayenne',2002,NULL),('Porsche','Macan',2014,NULL),('Porsche','Panamera',2009,NULL),('Porsche','Taycan',2019,NULL),
('Renault','Captur',2013,NULL),('Renault','Clio',1990,NULL),('Renault','Espace',1984,2023),('Renault','Kadjar',2015,2022),('Renault','Kangoo',1997,NULL),('Renault','Laguna',1993,2015),('Renault','Master',1980,NULL),('Renault','Megane',1995,NULL),('Renault','Modus',2004,2012),('Renault','Scenic',1996,2022),('Renault','Twingo',1993,2024),('Renault','Zoe',2012,2024),
('SEAT','Alhambra',1996,2020),('SEAT','Arona',2017,NULL),('SEAT','Ateca',2016,NULL),('SEAT','Ibiza',1984,NULL),('SEAT','Leon',1999,NULL),('SEAT','Mii',2011,2021),('SEAT','Toledo',1991,2019),
('Škoda','Fabia',1999,NULL),('Škoda','Kamiq',2019,NULL),('Škoda','Karoq',2017,NULL),('Škoda','Kodiaq',2016,NULL),('Škoda','Octavia',1996,NULL),('Škoda','Superb',2001,NULL),('Škoda','Yeti',2009,2017),
('Smart','Forfour',2004,2021),('Smart','Fortwo',1998,2024),
('Subaru','Forester',1997,NULL),('Subaru','Impreza',1992,NULL),('Subaru','Legacy',1989,2020),('Subaru','Outback',1994,NULL),('Subaru','XV',2011,2023),
('Suzuki','Alto',1979,2014),('Suzuki','Ignis',2000,NULL),('Suzuki','Jimny',1998,NULL),('Suzuki','Swift',1983,NULL),('Suzuki','Vitara',1988,NULL),
('Tesla','Model 3',2017,NULL),('Tesla','Model S',2012,NULL),('Tesla','Model X',2015,NULL),('Tesla','Model Y',2020,NULL),
('Toyota','Auris',2006,2018),('Toyota','Aygo',2005,2022),('Toyota','C-HR',2016,NULL),('Toyota','Corolla',1966,NULL),('Toyota','Prius',1997,NULL),('Toyota','RAV4',1994,NULL),('Toyota','Yaris',1999,NULL),
('Volkswagen','Arteon',2017,2024),('Volkswagen','Beetle',1997,2019),('Volkswagen','Golf',1974,NULL),('Volkswagen','Polo',1975,NULL),('Volkswagen','Passat',1973,NULL),('Volkswagen','T-Cross',2018,NULL),('Volkswagen','T-Roc',2017,NULL),('Volkswagen','Tiguan',2007,NULL),('Volkswagen','Touareg',2002,NULL),('Volkswagen','Touran',2003,NULL),('Volkswagen','Up!',2011,2023),
('Volvo','C30',2006,2013),('Volvo','S40',1995,2012),('Volvo','S60',2000,NULL),('Volvo','V40',1995,2019),('Volvo','V60',2010,NULL),('Volvo','V70',1996,2016),('Volvo','XC40',2017,NULL),('Volvo','XC60',2008,NULL),('Volvo','XC90',2002,NULL)
ON DUPLICATE KEY UPDATE
  anno_da = CASE
    WHEN anno_da IS NULL THEN VALUES(anno_da)
    WHEN VALUES(anno_da) IS NULL THEN anno_da
    ELSE LEAST(anno_da, VALUES(anno_da))
  END,
  anno_a = CASE
    WHEN anno_a IS NULL OR VALUES(anno_a) IS NULL THEN NULL
    ELSE GREATEST(anno_a, VALUES(anno_a))
  END;

-- Rende disponibili nel catalogo anche tutte le marche già usate nei veicoli.
INSERT IGNORE INTO marche (nome)
SELECT DISTINCT marca FROM veicoli WHERE marca IS NOT NULL AND marca <> '';

-- Le righe di catalogo già esistenti non vengono sovrascritte dal seed.
