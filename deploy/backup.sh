#!/bin/bash
# Backup notturno: database + foto. Tiene gli ultimi 14 giorni.
# Richiede il file /opt/gestionale/.backup.cnf (permessi 600) con le credenziali MySQL:
#   [client]
#   user=ricambi_backup
#   password=LA_PASSWORD
set -euo pipefail
CARTELLA=/opt/gestionale/backups
DATA=$(date +%Y-%m-%d_%H%M)
mkdir -p "$CARTELLA"
mysqldump --defaults-extra-file=/opt/gestionale/.backup.cnf --no-tablespaces --single-transaction gestionale_ricambi | gzip > "$CARTELLA/db_$DATA.sql.gz"
tar -czf "$CARTELLA/foto_$DATA.tar.gz" -C /opt/gestionale/backend uploads
find "$CARTELLA" -type f \( -name 'db_*' -o -name 'foto_*' \) -mtime +14 -delete
echo "Backup completato: $DATA"
