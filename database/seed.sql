-- Dati dimostrativi allineati ai sei ricambi presenti nel frontend.
-- Lo script è ri-eseguibile: gli ID esistenti vengono aggiornati, non duplicati.
USE gestionale_ricambi;

INSERT INTO veicoli (id, marca, modello, anno_da, anno_a) VALUES
  (1, 'Lancia', 'Ypsilon', 2011, 2024),
  (2, 'Fiat', 'Panda', 2012, 2024),
  (3, 'Ford', 'Fiesta', 2008, 2023),
  (4, 'Renault', 'Clio', 2012, 2024),
  (5, 'Fiat', '500', 2007, 2024)
ON DUPLICATE KEY UPDATE
  marca = VALUES(marca), modello = VALUES(modello),
  anno_da = VALUES(anno_da), anno_a = VALUES(anno_a);

INSERT INTO tipologie_pezzo (id, nome, tipo_codice) VALUES
  (1, 'Paraurti anteriore', 'nessuno'),
  (2, 'Fanale anteriore', 'nessuno'),
  (3, 'Specchietto retrovisore', 'nessuno'),
  (4, 'Portiera anteriore', 'nessuno'),
  (5, 'Cofano', 'nessuno'),
  (6, 'Paraurti posteriore', 'nessuno')
ON DUPLICATE KEY UPDATE nome = VALUES(nome), tipo_codice = VALUES(tipo_codice);

INSERT INTO pezzi
  (id, codice, codice_oem, sigla_motore, matricola_motore, veicolo_id, tipologia_id, anno, colore, lato, posizione, condizione, stato, prezzo, note, data_vendita)
VALUES
  (1, 'LY-PA-0184', NULL, NULL, NULL, 1, 1, 2018, 'Nero metallizzato', 'nessuno', 'anteriore', 'usato', 'disponibile', 145.00, NULL, NULL),
  (2, 'FP-FA-0321', NULL, NULL, NULL, 2, 2, 2020, 'Trasparente', 'dx', 'anteriore', 'usato', 'disponibile', 78.00, NULL, NULL),
  (3, 'FF-SP-0089', NULL, NULL, NULL, 3, 3, 2017, 'Grigio metallizzato', 'sx', 'laterale', 'usato', 'disponibile', 55.00, NULL, NULL),
  (4, 'RC-PO-0140', NULL, NULL, NULL, 4, 4, 2019, 'Bianco', 'dx', 'laterale', 'usato', 'venduto', 210.00, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (5, 'F5-CO-0044', NULL, NULL, NULL, 5, 5, 2016, 'Rosso', 'nessuno', 'anteriore', 'usato', 'disponibile', 185.00, NULL, NULL),
  (6, 'LY-PP-0037', NULL, NULL, NULL, 1, 6, 2015, 'Blu', 'nessuno', 'posteriore', 'usato', 'disponibile', 120.00, NULL, NULL)
ON DUPLICATE KEY UPDATE
  codice = VALUES(codice), codice_oem = VALUES(codice_oem), sigla_motore = VALUES(sigla_motore),
  matricola_motore = VALUES(matricola_motore), veicolo_id = VALUES(veicolo_id), tipologia_id = VALUES(tipologia_id),
  anno = VALUES(anno), colore = VALUES(colore), lato = VALUES(lato), posizione = VALUES(posizione),
  condizione = VALUES(condizione), stato = VALUES(stato), prezzo = VALUES(prezzo),
  note = VALUES(note), data_vendita = VALUES(data_vendita);
