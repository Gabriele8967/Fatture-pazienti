# 🚀 Istruzioni Rapide - Setup Immediato

## Passi da seguire ADESSO:

### 1️⃣ Installa le dipendenze (1 minuto)

```bash
cd backend
npm install
```

### 2️⃣ Configura il Redirect URI su Fatture in Cloud (2 minuti)

1. Vai su https://fattureincloud.it
2. Impostazioni → API & Apps → Trova la tua app "Fatturazione Pazienti"
3. **IMPORTANTE:** Aggiungi questo Redirect URI esatto:
   ```
   http://localhost:3001/callback
   ```
4. Salva le modifiche

### 3️⃣ Ottieni l'Access Token (30 secondi)

```bash
npm run setup
```

- Si aprirà un URL nel terminale
- Copialo e aprilo nel browser
- Clicca "Autorizza"
- Il token verrà salvato automaticamente

### 4️⃣ Avvia il server (5 secondi)

```bash
npm start
```

### 5️⃣ Testa il sistema (1 minuto)

1. Apri `frontend/index.html` nel browser
2. Compila il form con dati di test:
   - Nome: Mario
   - Cognome: Rossi
   - Email: test@example.it
   - Codice Fiscale: RSSMRA80A01H501U
3. Clicca "Genera Fattura"

✅ Se vedi "Fattura creata con successo" - IL SISTEMA FUNZIONA!

---

## ⚙️ Personalizzazione (opzionale)

Modifica `backend/.env`:

```env
SERVICE_NAME=Visita specialistica
SERVICE_PRICE=80.00
VAT_RATE=22
PAYMENT_METHOD=Bonifico bancario
```

---

## 🔄 Quando il token scade

Dopo alcune ore potresti vedere errori "401 Unauthorized". Esegui:

```bash
npm run refresh-token
```

---

## ❓ Problemi?

### Server non si avvia
```bash
# Controlla se la porta 3000 è libera
lsof -i :3000
# Se occupata, cambia PORT nel .env
```

### Setup non funziona
- Verifica il Redirect URI su Fatture in Cloud
- Deve essere ESATTAMENTE: `http://localhost:3001/callback`

### Fattura non viene creata
- Controlla i log nel terminale del backend
- Verifica che il token non sia scaduto
- Prova a rinnovarlo: `npm run refresh-token`

---

## 📞 Hai bisogno di aiuto?

Leggi la guida completa in `README.md`
