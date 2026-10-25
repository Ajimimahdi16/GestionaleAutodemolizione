-- Schema MySQL del gestionale ricambi.
-- Importare questo file una sola volta con un utente amministratore MySQL.
CREATE DATABASE IF NOT EXISTS gestionale_ricambi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE gestionale_ricambi;

CREATE TABLE IF NOT EXISTS utenti (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(80) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nome VARCHAR(120) NOT NULL,
  ruolo ENUM('admin', 'operatore') NOT NULL DEFAULT 'operatore',
  attivo BOOLEAN NOT NULL DEFAULT TRUE,
  creato_il TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_utenti_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS veicoli (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  marca VARCHAR(80) NOT NULL,
  modello VARCHAR(100) NOT NULL,
  anno_da SMALLINT UNSIGNED NOT NULL,
  anno_a SMALLINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_veicolo (marca, modello, anno_da, anno_a)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tipologie_pezzo (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(120) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tipologia_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS pezzi (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  codice VARCHAR(40) NOT NULL,
  veicolo_id INT UNSIGNED NOT NULL,
  tipologia_id INT UNSIGNED NOT NULL,
  anno SMALLINT UNSIGNED NOT NULL,
  colore VARCHAR(80) NOT NULL,
  lato ENUM('dx', 'sx', 'nessuno') NOT NULL DEFAULT 'nessuno',
  posizione ENUM('anteriore', 'posteriore', 'laterale', 'interno abitacolo', 'vano motore', 'sottoscocca', 'altro') NOT NULL DEFAULT 'altro',
  condizione ENUM('nuovo', 'usato') NOT NULL DEFAULT 'usato',
  stato ENUM('disponibile', 'venduto') NOT NULL DEFAULT 'disponibile',
  prezzo DECIMAL(10,2) NULL,
  note TEXT NULL,
  data_inserimento TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  data_vendita DATETIME NULL DEFAULT NULL,
  inserito_da INT UNSIGNED NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_pezzi_codice (codice),
  KEY idx_pezzi_veicolo (veicolo_id),
  KEY idx_pezzi_tipologia (tipologia_id),
  KEY idx_pezzi_stato (stato),
  KEY idx_pezzi_colore (colore),
  CONSTRAINT fk_pezzi_veicoli FOREIGN KEY (veicolo_id)
    REFERENCES veicoli (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pezzi_tipologie FOREIGN KEY (tipologia_id)
    REFERENCES tipologie_pezzo (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_pezzi_utenti FOREIGN KEY (inserito_da)
    REFERENCES utenti (id) ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT chk_pezzi_anno CHECK (anno BETWEEN 1950 AND 2100),
  CONSTRAINT chk_pezzi_prezzo CHECK (prezzo IS NULL OR prezzo >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS foto_pezzo (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  pezzo_id INT UNSIGNED NOT NULL,
  nome_file VARCHAR(255) NOT NULL,
  principale BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (id),
  KEY idx_foto_pezzo (pezzo_id),
  CONSTRAINT fk_foto_pezzi FOREIGN KEY (pezzo_id)
    REFERENCES pezzi (id) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
