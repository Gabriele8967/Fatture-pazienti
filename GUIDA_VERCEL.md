# 🚀 Deploy su Vercel - Guida Completa

Questa guida ti porta online in **5 minuti** con frontend e backend insieme su Vercel.

---

## ✨ Vantaggi Vercel

- ✅ **Completamente GRATUITO** per questo progetto
- ✅ **Frontend + Backend insieme** (stesso dominio, no CORS)
- ✅ **HTTPS automatico**
- ✅ **Deploy automatico** da GitHub
- ✅ **CDN globale** super veloce
- ✅ **Zero configurazione server**

---

## 📋 Requisiti

- Account GitHub (gratuito)
- Account Vercel (gratuito - puoi usare login GitHub)
- 5 minuti

---

# 🚀 DEPLOY - 3 Step

## STEP 1: Crea Repository GitHub

```bash
# Vai nella directory principale del progetto
cd ~/Fatturazione\ semi-automatica

# Inizializza git
git init

# Aggiungi tutti i file
git add .

# Crea il primo commit
git commit -m "Sistema fatturazione pazienti"

# Vai su github.com/new e crea un nuovo repository
# Nome: fatturazione-pazienti
# Tipo: Privato (consigliato)
# NON aggiungere README o .gitignore

# Collega il repository (sostituisci TUO_USERNAME)
git remote add origin https://github.com/TUO_USERNAME/fatturazione-pazienti.git

# Push del codice
git branch -M main
git push -u origin main
```

---

## STEP 2: Deploy su Vercel

### A. Crea Account Vercel

1. Vai su **https://vercel.com**
2. Clicca **"Sign Up"**
3. Scegli **"Continue with GitHub"**
4. Autorizza Vercel

### B. Importa il Progetto

1. Nella dashboard Vercel, clicca **"Add New Project"**
2. Clicca **"Import Git Repository"**
3. Trova il tuo repo `fatturazione-pazienti` e clicca **"Import"**

### C. Configura il Progetto

**Framework Preset:** Other (lascia così)

**Root Directory:** `./` (lascia così)

**Build Command:** (lascia vuoto)

**Output Directory:** (lascia vuoto)

**Install Command:** (lascia vuoto)

### D. Configura Variabili d'Ambiente

⚠️ **IMPORTANTE**: Prima di cliccare "Deploy"!

1. Espandi **"Environment Variables"**
2. Aggiungi TUTTE queste variabili (una per una):

```
Nome: FIC_CLIENT_ID
Valore: s6sHWJld4GNQOR35z5MHLYgFyWPOBUHI

Nome: FIC_CLIENT_SECRET
Valore: 4A1k2joLMcTMC9U8da2qdsgcC1RGXdhOlzA1DV5cN3Sozu9Ewj7f375LUSWweqdI

Nome: FIC_COMPANY_ID
Valore: 1467198

Nome: FIC_ACCESS_TOKEN
Valore: a/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJ6ODRvWlp5RkVUZ1JLTDlBNjR5ZG1ydVdtbkZWR0VYbiIsImV4cCI6MTc1OTU5NDk4M30.lEf68aXs7Zqu0wd3gEYNwr43BQ2o8MiUauwz2b_8nWk

Nome: FIC_REFRESH_TOKEN
Valore: r/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyZWYiOiJOWTJ6REszcVRaZUY4eVF4VTdBbDZ2TUFSYnU2MVNuQyJ9.Il1RXf-lZbxEPsNjvZqhucP1kDdGRRNUlr-Co5OcTv0

Nome: VAT_RATE
Valore: 0

Nome: PAYMENT_METHOD
Valore: Contanti

Nome: NODE_ENV
Valore: production
```

3. Clicca **"Deploy"**

### E. Attendi il Deploy

Vercel compilerà e deployerà il progetto. Ci vogliono circa 1-2 minuti.

Quando vedi **"Congratulations!"**, il sito è online! 🎉

---

## STEP 3: Testa il Sistema

1. Clicca sul link del dominio (es: `https://fatturazione-pazienti.vercel.app`)
2. Si aprirà il form per i pazienti
3. Compila con dati di test:
   - Nome: Mario
   - Cognome: Rossi
   - Email: test@example.it
   - Codice Fiscale: RSSMRA80A01H501U
   - Causale: Visita medica
   - Prezzo: 50
4. Clicca **"Genera Fattura"**
5. Verifica che la fattura venga creata su Fatture in Cloud

✅ **Sistema Online!**

---

## 🎨 Personalizza il Dominio

### Dominio Vercel Gratuito

1. Vai su **Settings** → **Domains**
2. Puoi cambiare da `fatturazione-pazienti.vercel.app` a `studio-medico-tuonome.vercel.app`

### Dominio Personalizzato (es: fatture.tuosito.it)

1. Acquista un dominio (su Namecheap, GoDaddy, ecc.)
2. In Vercel: **Settings** → **Domains** → **Add**
3. Inserisci il tuo dominio
4. Segui le istruzioni per configurare i DNS
5. Vercel configura automaticamente HTTPS

---

## 🔄 Aggiornamenti Futuri

Ogni volta che fai modifiche:

```bash
git add .
git commit -m "Descrizione modifiche"
git push
```

Vercel farà il **deploy automatico** in ~30 secondi!

---

## ⚙️ Gestione Token

### Quando il Token Scade

Se vedi errori 401:

1. In **locale**, rinnova il token:
   ```bash
   cd backend
   npm run refresh-token
   ```

2. Copia il nuovo `FIC_ACCESS_TOKEN` dal file `.env`

3. Su **Vercel**:
   - Vai su **Settings** → **Environment Variables**
   - Trova `FIC_ACCESS_TOKEN`
   - Clicca **Edit** → Incolla nuovo valore → **Save**
   - Vai su **Deployments** → Clicca sui 3 puntini dell'ultimo deploy → **Redeploy**

---

## 📊 Monitoraggio

### Analytics

- Vai su **Analytics** per vedere visite e richieste
- Vercel ti mostra quante fatture vengono create

### Logs

- Vai su **Deployments** → Clicca sul deployment → **Functions**
- Clicca su `/api/create-invoice` per vedere i log

### Limiti Piano Gratuito

Il piano gratuito include:
- ✅ 100GB bandwidth/mese (più che sufficiente)
- ✅ 100 GB-hours serverless execution/mese
- ✅ Deploy illimitati
- ✅ HTTPS illimitato

Per un centro medico con 50-100 pazienti/giorno è più che sufficiente!

---

## 🔒 Sicurezza

### Cosa è già protetto

- ✅ HTTPS automatico
- ✅ Variabili d'ambiente criptate
- ✅ Repository GitHub privato
- ✅ Vercel firewall integrato

### Raccomandazioni Opzionali

1. **Rate Limiting**: Aggiungi Vercel Firewall (a pagamento) o implementa rate limiting nel codice
2. **CAPTCHA**: Aggiungi Google reCAPTCHA per prevenire spam
3. **IP Whitelist**: Limita accesso backend a IP specifici (avanzato)
4. **Monitoring**: Configura alert per comportamenti anomali

---

## ❓ Troubleshooting

### "Function Execution Timeout"

Se le richieste vanno in timeout:
- Il piano gratuito ha timeout di 10 secondi
- Le API Fatture in Cloud dovrebbero rispondere in <2 secondi
- Se persiste, verifica i log

### "CORS Error"

Non dovresti avere problemi CORS perché frontend e backend sono sullo stesso dominio.

Se appare:
- Verifica che `window.location.hostname` nel frontend funzioni correttamente
- Controlla i log del browser (F12)

### "502 Bad Gateway"

- Controlla che tutte le variabili d'ambiente siano configurate
- Vai su **Deployments** → **Functions** e controlla i log
- Verifica che `FIC_ACCESS_TOKEN` sia valido

### Frontend mostra pagina bianca

- Apri console browser (F12)
- Verifica errori JavaScript
- Controlla che `frontend/index.html` sia nel repository

---

## 💰 Costi

**Piano Gratuito (Hobby):**
- ✅ **€0/mese**
- Perfetto per questo progetto

**Se superi i limiti o vuoi funzionalità extra:**
- **Pro**: $20/mese (molto difficile aver bisogno)
  - 1TB bandwidth
  - Analytics avanzate
  - Protezioni DDoS

Per un centro medico, il piano gratuito è più che sufficiente.

---

## 🎯 Checklist Finale

Prima di condividere il link ai pazienti:

- [ ] Deploy completato su Vercel
- [ ] Tutte le variabili d'ambiente configurate
- [ ] URL del sito copiato (es: `https://xxx.vercel.app`)
- [ ] Testato creando una fattura di prova
- [ ] Verificato che la fattura appaia su Fatture in Cloud
- [ ] (Opzionale) Dominio personalizzato configurato

---

## 📞 Link Utili

- **Dashboard Vercel**: https://vercel.com/dashboard
- **Documentazione**: https://vercel.com/docs
- **Supporto Vercel**: https://vercel.com/support

---

## 🎉 Congratulazioni!

Il tuo sistema di fatturazione è online, sicuro e pronto per i pazienti!

**URL da condividere:** `https://tuo-progetto.vercel.app`

I pazienti possono compilare il form e generare le loro fatture in autonomia! 🚀
