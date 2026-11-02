# Guida: mettere online il gestionale su AWS Lightsail

Server consigliato: **Ubuntu 24.04 LTS**, 2 GB di RAM (circa 12 $/mese, controlla il prezzo aggiornato sul sito AWS).
Tutto gira su un solo server: Caddy (HTTPS) → Node/Express (API + interfaccia) → MySQL (chiuso a internet).

> I comandi dei punti 4-10 si eseguono **sul server** (collegato via SSH). I punti 1-3 e 5 si fanno dal browser o dal tuo Mac.
> Sostituisci sempre `gestionale.tuodominio.it` con il tuo dominio vero e le `PASSWORD_...` con password lunghe e diverse.

## 1. Dominio
Registra un dominio (es. Aruba, Register.it, Namecheap, Cloudflare). Un `.it` costa circa 10 €/anno.
Useremo un sottodominio, ad esempio `gestionale.tuodominio.it`.

## 2. Crea il server su Lightsail
1. Crea l'account su aws.amazon.com e, in **Billing → Budgets**, imposta un avviso di spesa (es. 20 $/mese).
2. Apri **Lightsail → Create instance**.
3. Regione: **Milano** se disponibile, altrimenti **Francoforte**.
4. Piattaforma **Linux/Unix**, blueprint **OS Only → Ubuntu 24.04 LTS**.
5. Piano da **2 GB RAM**. Abilita **Automatic snapshots** (copia giornaliera dell'intero server).
6. Dopo la creazione: **Networking → Create static IP** e collegalo all'istanza (così l'IP non cambia mai).
7. Nel **Firewall** dell'istanza lascia solo le porte **22 (SSH), 80 e 443**.
8. Dal tuo provider di dominio crea un record **A**: `gestionale` → IP statico. Aspetta qualche minuto.

## 3. Collegarsi al server
Da Lightsail clicca l'icona **SSH** (terminale nel browser), oppure scarica la chiave dall'area *Account → SSH keys* e usa
`ssh -i chiave.pem ubuntu@IP-STATICO`.

## 4. Installare i programmi
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y mysql-server git curl debian-keyring debian-archive-keyring apt-transport-https gpg

# Node.js LTS
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Caddy (HTTPS automatico)
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

## 5. Esportare i dati dal tuo Mac (dati attuali)
Dalla cartella principale del progetto sul Mac:
```bash
/usr/local/mysql/bin/mysqldump -u root -p --single-transaction gestionale_ricambi > gestionale_dump.sql
tar czf foto.tar.gz -C backend uploads
```
Se nel tuo `.env` `UPLOAD_DIR` punta a un'altra cartella, comprimi quella (il contenuto deve finire in una cartella chiamata `uploads`).
Poi copia i due file sul server (con la chiave scaricata da Lightsail):
```bash
scp -i chiave.pem gestionale_dump.sql foto.tar.gz ubuntu@IP-STATICO:~
```
Il dump contiene gli hash delle password: dopo l'import **cancellalo** dal server e dal Mac se non serve più.

## 6. Database sul server
```bash
sudo mysql
```
Dentro MySQL (cambia le password):
```sql
CREATE DATABASE gestionale_ricambi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ricambi_app'@'localhost' IDENTIFIED BY 'PASSWORD_APP';
GRANT SELECT, INSERT, UPDATE, DELETE ON gestionale_ricambi.* TO 'ricambi_app'@'localhost';
CREATE USER 'ricambi_backup'@'localhost' IDENTIFIED BY 'PASSWORD_BACKUP';
GRANT SELECT, LOCK TABLES, SHOW VIEW, TRIGGER ON gestionale_ricambi.* TO 'ricambi_backup'@'localhost';
EXIT;
```
Importa i dati e controlla che ci siano:
```bash
sudo mysql gestionale_ricambi < ~/gestionale_dump.sql
sudo mysql gestionale_ricambi -e "SELECT COUNT(*) AS pezzi FROM pezzi; SELECT COUNT(*) AS utenti FROM utenti;"
```
Facoltativo ma consigliato: `sudo mysql gestionale_ricambi < /opt/gestionale/database/migrations/003_indici_ricerca.sql` (dopo il punto 7).

## 7. Scaricare il codice e configurarlo
```bash
sudo useradd --system --create-home --shell /usr/sbin/nologin gestionale
sudo mkdir -p /opt/gestionale && sudo chown gestionale:gestionale /opt/gestionale
sudo -u gestionale -H git clone https://github.com/Ajimimahdi16/GestionaleAutodemolizione.git /opt/gestionale
sudo -u gestionale -H tar xzf ~/foto.tar.gz -C /opt/gestionale/backend
```
Crea il file di configurazione (`sudo -u gestionale nano /opt/gestionale/.env`):
```
APP_HOST=127.0.0.1
APP_PORT=3000
DB_HOST=localhost
DB_USER=ricambi_app
DB_PASSWORD="PASSWORD_APP"
DB_NAME=gestionale_ricambi
JWT_SECRET=<incolla l'output di:  openssl rand -hex 48>
JWT_DURATA=8h
COOKIE_SECURE=true
TRUST_PROXY=true
UPLOAD_DIR=./backend/uploads
```
```bash
sudo chmod 600 /opt/gestionale/.env
```
Costruisci l'interfaccia e installa le dipendenze:
```bash
cd /opt/gestionale/frontend && sudo -u gestionale -H npm ci && sudo -u gestionale -H npm run build
cd /opt/gestionale/backend  && sudo -u gestionale -H npm ci --omit=dev
```

## 8. Avvio automatico e HTTPS
```bash
sudo cp /opt/gestionale/deploy/gestionale.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now gestionale
sudo systemctl status gestionale      # deve risultare "active (running)"
curl http://127.0.0.1:3000/health/database

sudo cp /opt/gestionale/deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile        # sostituisci il dominio
sudo systemctl reload caddy
```
Apri `https://gestionale.tuodominio.it`: deve comparire la pagina di login con il lucchetto.

## 9. Sicurezza: da fare subito
- **Nuovo amministratore con password nuova** e disattivazione del vecchio:
  ```bash
  cd /opt/gestionale/backend && sudo -u gestionale -H npm run crea-admin
  ```
  Poi, dopo aver verificato il login col nuovo account:
  `sudo mysql gestionale_ricambi -e "UPDATE utenti SET attivo=0 WHERE username='VECCHIO_USERNAME';"`
- Cancella i file di esportazione: `rm ~/gestionale_dump.sql ~/foto.tar.gz`.
- Non aprire mai la porta 3306 (MySQL) nel firewall.

## 10. Backup
```bash
sudo -u gestionale tee /opt/gestionale/.backup.cnf >/dev/null <<'CNF'
[client]
user=ricambi_backup
password=PASSWORD_BACKUP
CNF
sudo chmod 600 /opt/gestionale/.backup.cnf
sudo -u gestionale /opt/gestionale/deploy/backup.sh      # prova subito
echo "30 2 * * * gestionale /opt/gestionale/deploy/backup.sh >> /opt/gestionale/backups/backup.log 2>&1" | sudo tee /etc/cron.d/gestionale-backup
sudo chmod 644 /etc/cron.d/gestionale-backup
```
I backup restano 14 giorni in `/opt/gestionale/backups`. In più gli snapshot automatici di Lightsail salvano l'intero server.
**Prova un ripristino** su un server di prova prima di fidarti: un backup mai provato non è un backup.

## 11. Aggiornare in futuro
```bash
cd /opt/gestionale && sudo -u gestionale -H git pull
cd frontend && sudo -u gestionale -H npm ci && sudo -u gestionale -H npm run build
cd ../backend && sudo -u gestionale -H npm ci --omit=dev
sudo systemctl restart gestionale
```
Per vedere gli errori: `sudo journalctl -u gestionale -n 100 --no-pager`.

## 12. Prova finale
Da telefono con dati mobili (non Wi-Fi) e dal PC del lavoro: login, ricerca, aggiunta ricambio con foto, cambio stato, logout.

## 13. Sito pubblico per i clienti

Il sito vive nella cartella `sito-pubblico` e usa lo stesso server e lo stesso database del gestionale, ma è separato:
mostra solo se un pezzo è disponibile (mai prezzi, codici interni o note) e non può accedere alla parte riservata.

**DNS** (dal pannello del dominio):
- record `A` con nome `@` → IP del server (sostituisce la pagina predefinita del provider; non toccare i record `MX` della posta);
- record `A` con nome `www` → IP del server.

**Sul server:**
```bash
echo 'GESTIONALE_HOST=app.tuodominio.it' | sudo tee -a /opt/gestionale/.env
cd /opt/gestionale && sudo -u gestionale -H git pull
cd sito-pubblico && sudo -u gestionale -H npm ci && sudo -u gestionale -H npm run build
cd ../backend && sudo -u gestionale -H npm ci --omit=dev
cd ../frontend && sudo -u gestionale -H npm ci && sudo -u gestionale -H npm run build
sudo cp /opt/gestionale/deploy/Caddyfile /etc/caddy/Caddyfile
sudo nano /etc/caddy/Caddyfile        # sostituisci app.example.it e example.it con i domini veri
sudo systemctl reload caddy
sudo systemctl restart gestionale
```
Controlli: `https://tuodominio.it` mostra il sito pubblico; `https://app.tuodominio.it` mostra il login del gestionale.

**Contenuti da aggiornare nel codice** (poi build e riavvio come al punto 11):
- recensioni reali: `sito-pubblico/src/dati/recensioni.js` (copiate dalla scheda Google, mai inventate);
- orari, telefoni, indirizzo e link social: `sito-pubblico/src/dati/azienda.js`.

## 14. Recensioni di Google Maps nel sito (automatiche)

Il sito può mostrare la valutazione e le recensioni della scheda Google dell'attività. Si attiva da sola quando nel file
`.env` del server ci sono `GOOGLE_PLACES_API_KEY` e `GOOGLE_PLACE_ID`; senza, il sito mostra solo il link alle recensioni.

Limiti da conoscere:
- Google restituisce al massimo **5 recensioni**, scelte da lui (le "più pertinenti"), non tutte e non le ultime.
- Serve un account **Google Cloud con fatturazione attiva** (carta di credito). Per un uso così piccolo si resta di norma sotto
  le soglie gratuite, ma **controlla i prezzi attuali** e imposta un avviso di spesa.
- Le condizioni d'uso di Google limitano per quanto tempo si possono conservare i dati: il sito li tiene in memoria solo 6 ore.

**Passi**
1. **ID del luogo:** apri https://developers.google.com/maps/documentation/places/web-service/place-id , cerca
   "Autodemolizione Ricambi Torino, Corso Orbassano 368/23, Torino" e copia il **Place ID** (inizia con `ChIJ`).
2. **Google Cloud:** su https://console.cloud.google.com crea un progetto, attiva la fatturazione e imposta un **budget con avviso**.
3. **Abilita l'API:** "API e servizi" → "Libreria" → **Places API (New)** → Abilita.
4. **Chiave API:** "API e servizi" → "Credenziali" → "Crea credenziali" → "Chiave API". Poi **limitala**:
   - Restrizioni API: solo **Places API (New)**;
   - Restrizioni applicazione: **Indirizzi IP** → l'IP del server (`13.50.125.91`).
5. **Quota:** "Quote" → imposta un limite basso di richieste al giorno (es. 50) per evitare sorprese.
6. **Sul server:**
   ```bash
   sudo nano /opt/gestionale/.env      # aggiungi le due righe
   # GOOGLE_PLACES_API_KEY=la-chiave
   # GOOGLE_PLACE_ID=ChIJ...
   sudo systemctl restart gestionale
   ```
7. Controllo: `curl -s http://127.0.0.1:3000/api/pubblico/recensioni` deve mostrare `"attive":true`.

Non incollare mai la chiave in chat, nel codice o su GitHub: sta solo nel file `.env`.
