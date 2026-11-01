-- Aggiunge riferimenti OEM e dati identificativi dei motori senza cancellare record.
-- Eseguire una sola volta da MySQL Workbench con un account amministratore DB.
USE gestionale_ricambi;

SET @tabella = 'pezzi';

SET @colonna = 'codice_oem';
SET @esiste = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @tabella AND COLUMN_NAME = @colonna);
SET @sql = IF(@esiste = 0, 'ALTER TABLE pezzi ADD COLUMN codice_oem VARCHAR(80) NULL AFTER codice', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;

SET @colonna = 'sigla_motore';
SET @esiste = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @tabella AND COLUMN_NAME = @colonna);
SET @sql = IF(@esiste = 0, 'ALTER TABLE pezzi ADD COLUMN sigla_motore VARCHAR(40) NULL AFTER codice_oem', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;

SET @colonna = 'matricola_motore';
SET @esiste = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @tabella AND COLUMN_NAME = @colonna);
SET @sql = IF(@esiste = 0, 'ALTER TABLE pezzi ADD COLUMN matricola_motore VARCHAR(80) NULL AFTER sigla_motore', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;

SET @indice = 'idx_pezzi_codice_oem';
SET @esiste = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @tabella AND INDEX_NAME = @indice);
SET @sql = IF(@esiste = 0, 'CREATE INDEX idx_pezzi_codice_oem ON pezzi (codice_oem)', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;
