# 🚀 Guida Deploy - Metti Online il Sistema

Questa guida ti accompagna passo passo nel mettere online il sistema di fatturazione.

---

## 📋 Cosa Serve

- [ ] Account GitHub (gratuito) - https://github.com
- [ ] Account Railway (gratuito) - https://railway.app
- [ ] Account Netlify (gratuito) - https://netlify.com
- [ ] 15 minuti di tempo

---

# PARTE 1: Deploy Backend su Railway

## Step 1: Crea un account Railway

1. Vai su https://railway.app
2. Clicca "Start a New Project"
3. Login con GitHub (ti verrà chiesto di autorizzare)

## Step 2: Crea un nuovo progetto

1. Nella dashboard Railway, clicca **"New Project"**
2. Seleziona **"Deploy from GitHub repo"**
3. Se non hai ancora un repo, segui prima la **PARTE 0** qui sotto per crearlo

---

# PARTE 0: Crea Repository GitHub (se non l'hai già)

## Opzione A: Da terminale (consigliato)

```bash
# 1. Vai nella directory backend
cd ~/Fatturazione\ semi-automatica/backend

# 2. Inizializza git
git init

# 3. Aggiungi i file
git add .

# 4. Crea il primo commit
git commit -m "Initial commit - backend fatturazione"

# 5. Vai su GitHub e crea un nuovo repository chiamato "fatturazione-backend"
# Non aggiungere README, .gitignore o licenza (li hai già)

# 6. Collega il repository remoto (sostituisci TUO_USERNAME)
git remote add origin https://github.com/TUO_USERNAME/fatturazione-backend.git

# 7. Push del codice
git branch -M main
git push -u origin main
```

## Opzione B: Da interfaccia GitHub

1. Vai su https://github.com/new
2. Nome repository: `fatturazione-backend`
3. **Privato** (raccomandato per sicurezza)
4. Non aggiungere README
5. Clicca "Create repository"
6. Segui le istruzioni mostrate per "push an existing repository"

---

# PARTE 1 (continua): Deploy su Railway

## Step 3: Configura il progetto

1. Dopo aver selezionato il repo, Railway inizierà il deploy automaticamente
2. **ATTENDI** che finisca il primo deploy (apparirà "Success")

## Step 4: Configura le Variabili d'Ambiente

⚠️ **IMPORTANTE**: Railway non ha accesso al tuo file `.env` locale!

1. Nel progetto Railway, clicca sulla tua applicazione
2. Vai su **"Variables"** tab
3. Clicca **"Raw Editor"**
4. Copia e incolla ESATTAMENTE questo (con i TUOI valori):

```env
FIC_CLIENT_ID=s6sHWJld4GNQOR35z5MHLYgFyWPOBUHI
FIC_CLIENT_SECRET=4A1k2joLMcTMC9U8da2qdsgcC1RGXdhOlzA1DV5cN3Sozu9Ewj7f375LUSWweqdI
FIC_COMPANY_ID=1467198
FIC_ACCESS_TOKEN=a/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJ6ODRvWlp5RkVUZ1JLTDlBNjR5ZG1ydVdtbkZWR0VYbiIsImV4cCI6MTc1OTU5NDk4M30.lEf68aXs7Zqu0wd3gEYNwr43BQ2o8MiUauwz2b_8nWk
FIC_REFRESH_TOKEN=r/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJOWTJ6REszcVRhZUY4eVF4VTdBbDZ2TUFSYnU2MVNuQyJ9.Il1RXf-lZbxEPsNjvZqhucP1kDdGRRNUlr-Co5OcTv0
PORT=3000
SERVICE_NAME=Visita medica
SERVICE_PRICE=50.00
VAT_RATE=0
PAYMENT_METHOD=Contanti
```

5. Clicca **"Update Variables"**
6. Il deploy si riavvierà automaticamente

## Step 5: Ottieni l'URL del Backend

1. Vai su **"Settings"** tab
2. Scorri fino a **"Domains"**
3. Clicca **"Generate Domain"**
4. Railway genererà un URL tipo: `https://fatturazione-backend-production-xxxx.up.railway.app`
5. **COPIA QUESTO URL** - ti servirà per il frontend!

## Step 6: Testa il Backend

Apri nel browser (sostituisci con il TUO URL):
```
https://fatturazione-backend-production-xxxx.up.railway.app/health
```

Dovresti vedere:
```json
{"status":"ok","message":"Server attivo"}
```

✅ **Backend online!**

---

# PARTE 2: Deploy Frontend su Netlify

## Step 1: Prepara il frontend

Prima di fare il deploy, devi aggiornare l'URL del backend nel file HTML.

```bash
cd ~/Fatturazione\ semi-automatica/frontend
```

Apri `index.html` e cerca questa riga (circa riga 253):
```javascript
const API_URL = 'http://localhost:3000/api/create-invoice';
```

Cambiala con il TUO URL di Railway:
```javascript
const API_URL = 'https://fatturazione-backend-production-xxxx.up.railway.app/api/create-invoice';
```

Salva il file!

## Step 2: Deploy su Netlify

### Opzione A: Drag & Drop (più facile)

1. Vai su https://app.netlify.com
2. Login/Registrati (puoi usare GitHub)
3. Nella dashboard, trascina la cartella `frontend` nell'area "Drag and drop"
4. Netlify farà il deploy automaticamente
5. Ti darà un URL tipo: `https://random-name-12345.netlify.app`

### Opzione B: Da GitHub (per aggiornamenti futuri automatici)

1. Crea un repo GitHub per il frontend (come fatto per il backend)
2. Su Netlify, clicca "Add new site" → "Import an existing project"
3. Seleziona GitHub e il tuo repo
4. Build settings:
   - Build command: (lascia vuoto)
   - Publish directory: `.`
5. Clicca "Deploy"

## Step 3: Personalizza il dominio (opzionale)

Su Netlify, vai su "Domain settings" e puoi:
- Cambiare il nome del sito (es: `fatture-studio-medico.netlify.app`)
- Collegare un dominio personalizzato (es: `fatture.tuosito.it`)

---

# 🎉 SISTEMA ONLINE!

Ora puoi condividere l'URL Netlify con i tuoi pazienti:
```
https://tuo-sito.netlify.app
```

---

# ⚙️ Configurazione Post-Deploy

## 1. Aggiungi l'URL del frontend su Railway

Per maggiore sicurezza CORS:

1. Vai su Railway → Variables
2. Aggiungi questa variabile:
```
FRONTEND_URL=https://tuo-sito.netlify.app
```

## 2. Aggiorna il Redirect URI su Fatture in Cloud

Per poter rinnovare il token in futuro:

1. Vai su https://fattureincloud.it → Impostazioni → API & Apps
2. Modifica la tua applicazione
3. Aggiungi un nuovo Redirect URI:
```
https://fatturazione-backend-production-xxxx.up.railway.app/callback
```
4. Mantieni anche quello locale per test futuri

---

# 🔄 Gestione Token in Produzione

Gli Access Token scadono. Quando succede:

## Opzione 1: Rinnovo Manuale

```bash
# In locale, rinnova il token
cd ~/Fatturazione\ semi-automatica/backend
npm run refresh-token

# Copia il nuovo access token dal .env
cat .env | grep FIC_ACCESS_TOKEN

# Vai su Railway → Variables
# Aggiorna FIC_ACCESS_TOKEN con il nuovo valore
```

## Opzione 2: Rinnovo Automatico (avanzato)

Posso aiutarti a creare un sistema che rinnova automaticamente il token ogni giorno.

---

# 🔒 Sicurezza - Raccomandazioni

✅ **Fatto automaticamente:**
- HTTPS su Railway e Netlify
- Variables protette su Railway

⚠️ **Da fare (opzionale ma consigliato):**

1. **Rate Limiting**: Limita richieste per IP
2. **CAPTCHA**: Previeni spam (Google reCAPTCHA)
3. **Whitelist IP**: Accetta solo da Netlify
4. **Monitoring**: Tieni d'occhio le fatture create

---

# 📊 Monitoraggio

## Railway:
- Vai su "Deployments" per vedere i log
- Vai su "Metrics" per CPU/RAM

## Netlify:
- Vai su "Analytics" per vedere le visite

## Fatture in Cloud:
- Controlla regolarmente le fatture create
- Verifica che non ci siano fatture anomale

---

# ❓ Troubleshooting

### "CORS error" nel browser
- Verifica che l'URL del backend sia corretto nel frontend
- Controlla che FRONTEND_URL sia impostato su Railway

### "401 Unauthorized" dalle API
- Il token è scaduto, rinnovalo con `npm run refresh-token`
- Aggiorna FIC_ACCESS_TOKEN su Railway

### Backend non si avvia su Railway
- Controlla i logs: Railway → Deployments → Clicca sul deploy → View logs
- Verifica che tutte le variabili siano configurate

### Frontend mostra "Errore di connessione"
- Testa il backend: `https://tuo-backend.railway.app/health`
- Verifica l'URL nel codice frontend

---

# 🎯 Checklist Finale

Prima di condividere il link ai pazienti:

- [ ] Backend deployed su Railway e funzionante (`/health` risponde)
- [ ] Variabili d'ambiente configurate su Railway
- [ ] Frontend deployed su Netlify
- [ ] URL backend aggiornato nel frontend
- [ ] Testato creando una fattura di prova dal frontend online
- [ ] Verificato che la fattura appaia su Fatture in Cloud
- [ ] Redirect URI aggiornato su Fatture in Cloud (opzionale ma consigliato)

---

# 📞 Supporto

Se hai problemi:
1. Controlla i logs su Railway
2. Testa il backend con `/health`
3. Verifica le variabili d'ambiente
4. Controlla che il token non sia scaduto

**Tutto pronto per ricevere pazienti!** 🚀
