-- Aggiunge i campi tecnici mancanti in modo ri-eseguibile su MySQL 8.4.
-- Non modifica né cancella il codice interno `pezzi.codice` o altri dati.
USE gestionale_ricambi;

-- Aggiunge tipo_codice solo se non esiste già.
SET @esiste_colonna = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tipologie_pezzo' AND COLUMN_NAME = 'tipo_codice'
);
SET @sql_migrazione = IF(
  @esiste_colonna = 0,
  'ALTER TABLE tipologie_pezzo ADD COLUMN tipo_codice ENUM(''nessuno'',''codice'',''motore'') NOT NULL DEFAULT ''nessuno''',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

-- Codice OEM del produttore: campo separato dal codice interno già esistente.
SET @esiste_colonna = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND COLUMN_NAME = 'codice_oem'
);
SET @sql_migrazione = IF(@esiste_colonna = 0,
  'ALTER TABLE pezzi ADD COLUMN codice_oem VARCHAR(60) NULL AFTER codice',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

SET @esiste_colonna = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND COLUMN_NAME = 'sigla_motore'
);
SET @sql_migrazione = IF(@esiste_colonna = 0,
  'ALTER TABLE pezzi ADD COLUMN sigla_motore VARCHAR(40) NULL AFTER codice_oem',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

SET @esiste_colonna = (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND COLUMN_NAME = 'matricola_motore'
);
SET @sql_migrazione = IF(@esiste_colonna = 0,
  'ALTER TABLE pezzi ADD COLUMN matricola_motore VARCHAR(60) NULL AFTER sigla_motore',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

-- Crea gli indici solo se non esistono già.
SET @esiste_indice = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND INDEX_NAME = 'idx_pezzi_codice_oem'
);
SET @sql_migrazione = IF(@esiste_indice = 0,
  'CREATE INDEX idx_pezzi_codice_oem ON pezzi (codice_oem)',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

SET @esiste_indice = (
  SELECT COUNT(*) FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND INDEX_NAME = 'idx_pezzi_sigla_motore'
);
SET @sql_migrazione = IF(@esiste_indice = 0,
  'CREATE INDEX idx_pezzi_sigla_motore ON pezzi (sigla_motore)',
  'SELECT 1'
);
PREPARE stmt_migrazione FROM @sql_migrazione;
EXECUTE stmt_migrazione;
DEALLOCATE PREPARE stmt_migrazione;

-- Classifica le tipologie già esistenti senza modificare il nome o i ricambi.
UPDATE tipologie_pezzo
SET tipo_codice = CASE
  WHEN LOWER(nome) IN ('motore', 'motore completo', 'motore usato') THEN 'motore'
  WHEN LOWER(nome) LIKE '%centralin%'
    OR LOWER(nome) LIKE '%abs%'
    OR LOWER(nome) LIKE '%autoradio%'
    OR LOWER(nome) LIKE '%radio%'
    OR LOWER(nome) LIKE '%navigatore%'
    OR LOWER(nome) LIKE '%quadro strumenti%'
    OR LOWER(nome) LIKE '%body computer%'
    OR LOWER(nome) LIKE '%ecu%'
    OR LOWER(nome) LIKE '%centralina airbag%'
    OR LOWER(nome) LIKE '%centralina cambio%'
  THEN 'codice'
  ELSE 'nessuno'
END;
