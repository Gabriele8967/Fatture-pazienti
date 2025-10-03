# 🚀 Deploy Veloce - 5 Minuti

Se vuoi il metodo più rapido possibile:

---

## STEP 1: Railway (Backend)

1. Vai su **https://railway.app**
2. Login con GitHub
3. **"New Project"** → **"Deploy from GitHub repo"**
4. Autorizza Railway a accedere ai tuoi repo
5. Crea prima un repo su GitHub:

```bash
cd ~/Fatturazione\ semi-automatica/backend
git init
git add .
git commit -m "Backend fatturazione"
# Vai su github.com/new e crea "fatturazione-backend" (privato)
git remote add origin https://github.com/TUO_USERNAME/fatturazione-backend.git
git branch -M main
git push -u origin main
```

6. Torna su Railway, seleziona il repo `fatturazione-backend`
7. Vai su **Variables** → **Raw Editor** e incolla:

```env
FIC_CLIENT_ID=s6sHWJld4GNQOR35z5MHLYgFyWPOBUHI
FIC_CLIENT_SECRET=4A1k2joLMcTMC9U8da2qdsgcC1RGXdhOlzA1DV5cN3Sozu9Ewj7f375LUSWweqdI
FIC_COMPANY_ID=1467198
FIC_ACCESS_TOKEN=a/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJ6ODRvWlp5RkVUZ1JLTDlBNjR5ZG1ydVdtbkZWR0VYbiIsImV4cCI6MTc1OTU5NDk4M30.lEf68aXs7Zqu0wd3gEYNwr43BQ2o8MiUauwz2b_8nWk
FIC_REFRESH_TOKEN=r/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJOWTJ6REszcVRaZUY4eVF4VTdBbDZ2TUFSYnU2MVNuQyJ9.Il1RXf-lZbxEPsNjvZqhucP1kDdGRRNUlr-Co5OcTv0
VAT_RATE=0
PAYMENT_METHOD=Contanti
```

8. **Settings** → **Networking** → **Generate Domain**
9. Copia l'URL (tipo `https://xxx.railway.app`)

---

## STEP 2: Aggiorna Frontend

Apri `frontend/index.html`, cerca (riga ~253):

```javascript
const API_URL = 'http://localhost:3000/api/create-invoice';
```

Cambia con:

```javascript
const API_URL = 'https://IL-TUO-URL.railway.app/api/create-invoice';
```

Salva!

---

## STEP 3: Netlify (Frontend)

1. Vai su **https://app.netlify.com**
2. Login con GitHub (o email)
3. **Trascina la cartella `frontend`** nell'area di drop
4. Aspetta che finisca (30 secondi)
5. Copia l'URL (tipo `https://xxx.netlify.app`)

---

## ✅ FATTO!

Condividi l'URL Netlify con i pazienti:
```
https://tuo-sito.netlify.app
```

---

## 🧪 Testa Subito

1. Apri l'URL Netlify nel browser
2. Compila il form
3. Clicca "Genera Fattura"
4. Controlla su Fatture in Cloud che sia stata creata

✅ **Sistema Online!**

---

## ⚠️ Quando il token scade

Vedrai errori 401. Fai:

```bash
cd ~/Fatturazione\ semi-automatica/backend
npm run refresh-token
# Copia il nuovo FIC_ACCESS_TOKEN
# Vai su Railway → Variables → Aggiorna FIC_ACCESS_TOKEN
```

---

## 📞 Problemi?

Leggi la guida completa in `GUIDA_DEPLOY.md`
