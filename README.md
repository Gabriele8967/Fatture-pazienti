# Sistema Fatturazione Semi-Automatica per Pazienti

Sistema semplice per permettere ai pazienti di un centro medico di generare le proprie fatture automaticamente tramite l'API di Fatture in Cloud.

## Caratteristiche

- ✅ **Interfaccia semplicissima** per i pazienti
- ✅ **Validazione automatica** dei dati (email e codice fiscale)
- ✅ **Integrazione diretta** con Fatture in Cloud
- ✅ **Configurazione flessibile** per servizi e prezzi
- ✅ **Nessun database richiesto** - tutto tramite API
- ✅ **Autenticazione OAuth2** automatizzata con script di setup

## 🚀 Quick Start

```bash
# 1. Installa dipendenze
cd "Fatturazione semi-automatica/backend"
npm install

# 2. Ottieni l'Access Token OAuth2
npm run setup
# Apri l'URL mostrato nel browser e autorizza l'app

# 3. Avvia il server
npm start

# 4. Apri frontend/index.html nel browser
```

✅ Il sistema è pronto! I pazienti possono ora creare le loro fatture.

## Prerequisiti

- Node.js (versione 14 o superiore)
- Un account su [Fatture in Cloud](https://fattureincloud.it)
- Un'applicazione OAuth2 creata su Fatture in Cloud

## Come ottenere le credenziali API

1. Accedi al tuo account **Fatture in Cloud**
2. Vai su **Impostazioni** → **API & Apps** → **Nuova App**
3. Compila il form:
   - Nome applicazione: "Fatturazione Pazienti"
   - Redirect URI: `http://localhost:3001/callback`
4. Salva **Client ID**, **Client Secret** e il tuo **Company ID**

📚 [Documentazione ufficiale API](https://developers.fattureincloud.it)

## Installazione

### 1. Entra nella directory del progetto

```bash
cd "Fatturazione semi-automatica/backend"
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Configura le credenziali

Il file `.env` è già stato creato con le tue credenziali. Verifica che contenga:

```env
FIC_CLIENT_ID=s6sHWJld4GNQOR35z5MHLYgFyWPOBUHI
FIC_CLIENT_SECRET=4A1k2joLMcTMC9U8da2qdsgcC1RGXdhOlzA1DV5cN3Sozu9Ewj7f375LUSWweqdI
FIC_COMPANY_ID=1467198
```

### 4. Ottieni l'Access Token (OAuth2)

Esegui lo script di setup che ti guiderà nel processo di autorizzazione:

```bash
npm run setup
```

Questo script:
1. Avvierà un server temporaneo
2. Ti mostrerà un URL da aprire nel browser
3. Ti chiederà di autorizzare l'applicazione
4. Salverà automaticamente l'Access Token nel file `.env`

### 5. Avvia il server backend

```bash
npm start
```

Il server sarà in esecuzione su `http://localhost:3000`

Per sviluppo con auto-reload:
```bash
npm run dev
```

### 6. Apri il frontend

Apri il file `frontend/index.html` nel browser oppure servilo con un web server.

Se vuoi usare un server locale semplice:

```bash
# Installa http-server globalmente (una volta sola)
npm install -g http-server

# Dalla directory principale del progetto
cd frontend
http-server -p 8080
```

Poi apri `http://localhost:8080` nel browser.

## Utilizzo

1. Il paziente apre la pagina web del frontend
2. Compila il form con:
   - Nome
   - Cognome
   - Email
   - Codice fiscale
3. Clicca su "Genera Fattura"
4. La fattura viene creata automaticamente su Fatture in Cloud
5. Il paziente riceve conferma con il numero di fattura

## Struttura del Progetto

```
Fatturazione semi-automatica/
├── backend/
│   ├── server.js          # Server Express con API
│   └── package.json       # Dipendenze backend
├── frontend/
│   └── index.html         # Form semplice per i pazienti
├── openapi-fattureincloud-master/  # Documentazione API
├── .env.example           # Template configurazione
└── README.md             # Questo file
```

## API Endpoints

### `POST /api/create-invoice`

Crea una nuova fattura per il paziente.

**Request Body:**
```json
{
  "firstName": "Mario",
  "lastName": "Rossi",
  "email": "mario.rossi@email.it",
  "codiceFiscale": "RSSMRA80A01H501U"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Fattura creata con successo",
  "invoice": {
    "id": 12345,
    "number": 42,
    "date": "2025-10-03",
    "amount": "61.00"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Descrizione errore"
}
```

### `GET /health`

Verifica lo stato del server.

**Response:**
```json
{
  "status": "ok",
  "message": "Server attivo"
}
```

## Personalizzazione

### Modificare il servizio/prestazione

Modifica il file `.env`:

```env
SERVICE_NAME=Consulenza specialistica
SERVICE_PRICE=100.00
VAT_RATE=22
```

### Modificare l'aspetto del frontend

Modifica il file `frontend/index.html` nella sezione `<style>`.

### Modificare l'URL del backend

Nel file `frontend/index.html`, cerca e modifica la costante:

```javascript
const API_URL = 'http://localhost:3000/api/create-invoice';
```

## Deploy in Produzione

### Backend

Puoi fare il deploy su servizi come:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**

Ricorda di:
1. Configurare le variabili d'ambiente sulla piattaforma
2. Modificare l'URL nel frontend per puntare al server di produzione

### Frontend

Il frontend è una semplice pagina HTML. Puoi:
- Metterla su **GitHub Pages**
- Hostarlo su **Netlify** o **Vercel**
- Includerla nel tuo sito web esistente

**IMPORTANTE:** Ricorda di aggiornare `API_URL` nel frontend con l'URL di produzione del backend.

## Manutenzione del Token

Gli Access Token di Fatture in Cloud hanno una scadenza (tipicamente alcune ore). Quando scadono:

### Rinnovo automatico

```bash
cd backend
npm run refresh-token
```

Questo comando:
- Usa il Refresh Token salvato per ottenere un nuovo Access Token
- Aggiorna automaticamente il file `.env`
- Non richiede interazione con il browser

### Token scaduto - Cosa fare

Se vedi errori tipo `401 Unauthorized` o `Invalid token`:

1. Prova a rinnovare il token: `npm run refresh-token`
2. Se il refresh non funziona, ri-esegui il setup completo: `npm run setup`

💡 **Suggerimento:** In produzione, considera l'implementazione di un sistema di rinnovo automatico del token.

## Sicurezza

⚠️ **Importante:**

- ✅ Non committare mai il file `.env` su Git (già incluso in `.gitignore`)
- ✅ Proteggi Client Secret e Access Token
- ✅ Considera l'aggiunta di CAPTCHA per prevenire spam
- ✅ Implementa rate limiting per evitare abusi
- ✅ Usa HTTPS in produzione
- ✅ Non condividere mai le credenziali OAuth2

## Troubleshooting

### "Configurazione server non completa"
- Verifica che `.env` contenga `FIC_ACCESS_TOKEN` e `FIC_COMPANY_ID`
- Se l'Access Token è vuoto, esegui `npm run setup`

### "401 Unauthorized" o "Invalid token"
- Il token è probabilmente scaduto
- Esegui `npm run refresh-token` per rinnovarlo
- Se il refresh fallisce, ri-esegui `npm run setup`

### "Errore di connessione al server"
- Verifica che il backend sia in esecuzione su `http://localhost:3000`
- Controlla i CORS se frontend e backend sono su domini diversi
- Verifica che il firewall non blocchi la porta 3000

### "Codice fiscale non valido"
- Verifica il formato: 16 caratteri alfanumerici
- Esempio valido: `RSSMRA80A01H501U`
- Usa solo lettere maiuscole e numeri

### Errori API Fatture in Cloud
- Verifica che l'Access Token sia valido (prova il refresh)
- Controlla i log del server nella console del backend
- Verifica che il Company ID sia corretto (1467198)
- Assicurati che l'applicazione OAuth2 sia attiva su Fatture in Cloud

### Lo script di setup non funziona
- Verifica che la porta 3001 non sia già in uso
- Controlla che il Redirect URI sia configurato correttamente su Fatture in Cloud: `http://localhost:3001/callback`
- Assicurati che Client ID e Client Secret siano corretti nel file `.env`

## Supporto

Per problemi con le API di Fatture in Cloud:
- 📧 [Supporto Fatture in Cloud](https://fattureincloud.it/supporto)
- 📚 [Documentazione API](https://developers.fattureincloud.it)

## Licenza

ISC
