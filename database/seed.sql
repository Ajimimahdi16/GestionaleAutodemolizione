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

INSERT INTO tipologie_pezzo (id, nome) VALUES
  (1, 'Paraurti anteriore'),
  (2, 'Fanale anteriore'),
  (3, 'Specchietto retrovisore'),
  (4, 'Portiera anteriore'),
  (5, 'Cofano'),
  (6, 'Paraurti posteriore')
ON DUPLICATE KEY UPDATE nome = VALUES(nome);

INSERT INTO pezzi
  (id, codice, veicolo_id, tipologia_id, anno, colore, lato, posizione, condizione, stato, prezzo, note, data_vendita)
VALUES
  (1, 'LY-PA-0184', 1, 1, 2018, 'Nero metallizzato', 'nessuno', 'anteriore', 'usato', 'disponibile', 145.00, NULL, NULL),
  (2, 'FP-FA-0321', 2, 2, 2020, 'Trasparente', 'dx', 'anteriore', 'usato', 'disponibile', 78.00, NULL, NULL),
  (3, 'FF-SP-0089', 3, 3, 2017, 'Grigio metallizzato', 'sx', 'laterale', 'usato', 'disponibile', 55.00, NULL, NULL),
  (4, 'RC-PO-0140', 4, 4, 2019, 'Bianco', 'dx', 'laterale', 'usato', 'venduto', 210.00, NULL, DATE_SUB(NOW(), INTERVAL 1 DAY)),
  (5, 'F5-CO-0044', 5, 5, 2016, 'Rosso', 'nessuno', 'anteriore', 'usato', 'disponibile', 185.00, NULL, NULL),
  (6, 'LY-PP-0037', 1, 6, 2015, 'Blu', 'nessuno', 'posteriore', 'usato', 'disponibile', 120.00, NULL, NULL)
ON DUPLICATE KEY UPDATE
  codice = VALUES(codice), veicolo_id = VALUES(veicolo_id), tipologia_id = VALUES(tipologia_id),
  anno = VALUES(anno), colore = VALUES(colore), lato = VALUES(lato), posizione = VALUES(posizione),
  condizione = VALUES(condizione), stato = VALUES(stato), prezzo = VALUES(prezzo),
  note = VALUES(note), data_vendita = VALUES(data_vendita);
