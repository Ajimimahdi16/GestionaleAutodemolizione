-- Aggiunge indici utili alla ricerca e all'ordinamento. Non modifica né cancella dati.
-- Eseguire una sola volta da MySQL Workbench con un account amministratore DB (sicuro anche se rieseguito).
USE gestionale_ricambi;

SET @esiste = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND INDEX_NAME = 'idx_pezzi_matricola_motore');
SET @sql = IF(@esiste = 0, 'CREATE INDEX idx_pezzi_matricola_motore ON pezzi (matricola_motore)', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;

SET @esiste = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'pezzi' AND INDEX_NAME = 'idx_pezzi_inserimento');
SET @sql = IF(@esiste = 0, 'CREATE INDEX idx_pezzi_inserimento ON pezzi (data_inserimento, id)', 'SELECT 1');
PREPARE migrazione FROM @sql; EXECUTE migrazione; DEALLOCATE PREPARE migrazione;
