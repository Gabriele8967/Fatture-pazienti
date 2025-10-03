# ⚡ Vercel - Quick Start (3 minuti)

## 1️⃣ GitHub (1 minuto)

```bash
cd ~/Fatturazione\ semi-automatica
git init
git add .
git commit -m "Sistema fatturazione pazienti"
```

Vai su **github.com/new**:
- Nome: `fatturazione-pazienti`
- Tipo: **Privato**
- Clicca "Create repository"

```bash
# Sostituisci TUO_USERNAME
git remote add origin https://github.com/TUO_USERNAME/fatturazione-pazienti.git
git branch -M main
git push -u origin main
```

---

## 2️⃣ Vercel Deploy (2 minuti)

1. Vai su **vercel.com** → Login con GitHub
2. **"Add New Project"** → Seleziona `fatturazione-pazienti`
3. **Espandi "Environment Variables"**
4. Aggiungi una per una:

```
FIC_CLIENT_ID = s6sHWJld4GNQOR35z5MHLYgFyWPOBUHI
FIC_CLIENT_SECRET = 4A1k2joLMcTMC9U8da2qdsgcC1RGXdhOlzA1DV5cN3Sozu9Ewj7f375LUSWweqdI
FIC_COMPANY_ID = 1467198
FIC_ACCESS_TOKEN = a/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJ6ODRvWlp5RkVUZ1JLTDlBNjR5ZG1ydVdtbkZWR0VYbiIsImV4cCI6MTc1OTU5NDk4M30.lEf68aXs7Zqu0wd3gEYNwr43BQ2o8MiUauwz2b_8nWk
FIC_REFRESH_TOKEN = r/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJOWTJ6REszcVRaZUY4eVF4VTdBbDZ2TUFSYnU2MVNuQyJ9.Il1RXf-lZbxEPsNjvZqhucP1kDdGRRNUlr-Co5OcTv0
VAT_RATE = 0
PAYMENT_METHOD = Contanti
NODE_ENV = production
```

5. **"Deploy"**

---

## 3️⃣ Testa ✅

Aspetta 1-2 minuti, poi clicca sul link del tuo sito.

Compila il form e crea una fattura di test!

**URL del tuo sistema:** `https://xxx.vercel.app`

---

## 🔄 Aggiornamenti

```bash
# Modifica il codice, poi:
git add .
git commit -m "Modifiche"
git push
```

Vercel fa deploy automatico in 30 secondi! ⚡

---

## ⚠️ Quando il token scade

1. Locale: `cd backend && npm run refresh-token`
2. Copia nuovo `FIC_ACCESS_TOKEN` dal `.env`
3. Vercel: Settings → Environment Variables → Edit `FIC_ACCESS_TOKEN`
4. Deployments → Redeploy

---

## 📚 Guida Completa

Leggi `GUIDA_VERCEL.md` per dettagli, troubleshooting e personalizzazioni.

---

✅ **Fatto! Sistema online in 3 minuti!** 🚀
