require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

const CLIENT_ID = process.env.FIC_CLIENT_ID;
const CLIENT_SECRET = process.env.FIC_CLIENT_SECRET;
const REDIRECT_URI = `http://localhost:${PORT}/callback`;

console.log('\n🔐 Setup OAuth2 per Fatture in Cloud (Debug Mode)\n');
console.log('='.repeat(70));

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌ Errore: CLIENT_ID o CLIENT_SECRET mancanti nel file .env\n');
  process.exit(1);
}

console.log('\n📋 VERIFICA CONFIGURAZIONE:\n');
console.log(`✓ Client ID: ${CLIENT_ID}`);
console.log(`✓ Client Secret: ${CLIENT_SECRET.substring(0, 20)}...`);
console.log(`✓ Redirect URI: ${REDIRECT_URI}`);
console.log('\n' + '='.repeat(70));

// Scope necessari per creare fatture
const SCOPES = [
  'entity.clients:r',           // Leggere clienti
  'entity.clients:a',           // Aggiungere clienti
  'issued_documents.invoices:r', // Leggere fatture
  'issued_documents.invoices:a', // Creare fatture
  'issued_documents.receipts:r', // Leggere ricevute
  'issued_documents.receipts:a'  // Creare ricevute
].join(' ');

// Step 1: Mostra l'URL di autorizzazione
const authUrl = `https://api-v2.fattureincloud.it/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n📝 ISTRUZIONI PASSO PASSO:\n');
console.log('1️⃣  Apri Fatture in Cloud e verifica il Redirect URI:\n');
console.log('    → Vai su: https://fattureincloud.it/app/settings/api-apps');
console.log('    → Trova la tua applicazione');
console.log('    → Verifica che il Redirect URI sia ESATTAMENTE:\n');
console.log(`    ${REDIRECT_URI}\n`);
console.log('    ⚠️  ATTENZIONE: Deve essere identico, incluso http:// e /callback\n');
console.log('2️⃣  Copia questo URL e aprilo in una NUOVA FINESTRA del browser:\n');
console.log(`    ${authUrl}\n`);
console.log('3️⃣  Nel browser:');
console.log('    → Effettua il login se richiesto');
console.log('    → Clicca su "Autorizza" o "Consenti"');
console.log('    → Verrai reindirizzato automaticamente\n');
console.log('='.repeat(70));
console.log('\n⏳ Server in ascolto su http://localhost:3001');
console.log('⏳ In attesa di autorizzazione...\n');

// Endpoint per debug
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Setup OAuth2 - Fatture in Cloud</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        .step {
          background: #e3f2fd;
          padding: 15px;
          margin: 15px 0;
          border-left: 4px solid #2196f3;
          border-radius: 4px;
        }
        .url-box {
          background: #f5f5f5;
          padding: 15px;
          border-radius: 5px;
          font-family: monospace;
          word-break: break-all;
          margin: 10px 0;
        }
        .btn {
          display: inline-block;
          background: #4caf50;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 15px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 15px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🔐 Setup OAuth2 - Fatture in Cloud</h1>

        <div class="warning">
          <strong>⚠️ IMPORTANTE:</strong> Prima di procedere, verifica che il Redirect URI sia configurato su Fatture in Cloud
        </div>

        <div class="step">
          <strong>1. Verifica Redirect URI su Fatture in Cloud:</strong><br>
          Vai su Impostazioni → API & Apps → La tua applicazione<br>
          Il Redirect URI deve essere ESATTAMENTE:<br>
          <div class="url-box">${REDIRECT_URI}</div>
        </div>

        <div class="step">
          <strong>2. Autorizza l'applicazione:</strong><br>
          Clicca sul pulsante qui sotto per autorizzare l'applicazione
        </div>

        <a href="${authUrl}" class="btn">🔑 Autorizza Applicazione</a>

        <div class="step" style="margin-top: 30px;">
          <strong>3. Dopo l'autorizzazione:</strong><br>
          Verrai reindirizzato automaticamente e il token verrà salvato nel file .env
        </div>
      </div>
    </body>
    </html>
  `);
});

// Step 2: Callback per ricevere il codice
app.get('/callback', async (req, res) => {
  const { code, error, error_description } = req.query;

  console.log('\n📥 Callback ricevuto!');
  console.log('Query params:', req.query);

  if (error) {
    console.error('\n❌ Errore dall\'autorizzazione:', error_description || error);
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Errore Autorizzazione</title>
      <style>
        body { font-family: Arial; padding: 50px; text-align: center; background: #ffebee; }
        .error { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
      </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Errore durante l'autorizzazione</h1>
          <p><strong>Errore:</strong> ${error}</p>
          <p><strong>Descrizione:</strong> ${error_description || 'N/A'}</p>
          <p>Chiudi questa finestra e riprova eseguendo: <code>npm run setup</code></p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  if (!code) {
    console.error('\n❌ Codice di autorizzazione non ricevuto');
    console.error('Query string ricevuta:', JSON.stringify(req.query, null, 2));
    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Errore - Codice mancante</title>
      <style>
        body { font-family: Arial; padding: 50px; background: #fff3cd; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 700px; margin: 0 auto; }
        .checklist { background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 5px; }
        code { background: #e0e0e0; padding: 2px 6px; border-radius: 3px; }
      </style>
      </head>
      <body>
        <div class="container">
          <h1>❌ Codice di autorizzazione non ricevuto</h1>

          <p>Il callback non ha ricevuto il codice di autorizzazione. Possibili cause:</p>

          <div class="checklist">
            <h3>Verifica questi punti:</h3>
            <ol>
              <li><strong>Redirect URI non configurato correttamente</strong><br>
                  Su Fatture in Cloud deve essere ESATTAMENTE:<br>
                  <code>${REDIRECT_URI}</code>
              </li>
              <li><strong>Applicazione non autorizzata</strong><br>
                  Hai cliccato su "Autorizza" o "Consenti"?
              </li>
              <li><strong>URL non corretto</strong><br>
                  Hai usato l'URL fornito dallo script?
              </li>
            </ol>
          </div>

          <h3>🔧 Cosa fare:</h3>
          <ol>
            <li>Vai su <a href="https://fattureincloud.it/app/settings/api-apps" target="_blank">Fatture in Cloud → API & Apps</a></li>
            <li>Modifica la tua applicazione</li>
            <li>Aggiungi/Verifica il Redirect URI: <code>${REDIRECT_URI}</code></li>
            <li>Salva le modifiche</li>
            <li>Torna al terminale e riprova: <code>npm run setup</code></li>
          </ol>

          <p><strong>Query ricevuta:</strong> ${JSON.stringify(req.query)}</p>
        </div>
      </body>
      </html>
    `);
    return;
  }

  try {
    console.log('✅ Codice ricevuto:', code.substring(0, 20) + '...');
    console.log('⏳ Scambio codice per access token...\n');

    // Step 3: Scambia il codice per l'access token
    const response = await axios.post('https://api-v2.fattureincloud.it/oauth/token', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('✅ Token ottenuti con successo!\n');
    console.log('Access Token (primi 20 char):', access_token.substring(0, 20) + '...');
    console.log('Refresh Token (primi 20 char):', refresh_token.substring(0, 20) + '...');
    console.log('Scadenza (secondi):', expires_in);
    console.log('\n📝 Aggiornamento file .env...\n');

    // Step 4: Aggiorna il file .env
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Aggiorna i token
    envContent = envContent.replace(
      /FIC_ACCESS_TOKEN=.*/,
      `FIC_ACCESS_TOKEN=${access_token}`
    );
    envContent = envContent.replace(
      /FIC_REFRESH_TOKEN=.*/,
      `FIC_REFRESH_TOKEN=${refresh_token}`
    );

    fs.writeFileSync(envPath, envContent);

    console.log('✅ File .env aggiornato con successo!\n');
    console.log('='.repeat(70));
    console.log('\n🎉 SETUP COMPLETATO CON SUCCESSO!\n');
    console.log('Ora puoi:');
    console.log('  1. Verificare la config: npm run check');
    console.log('  2. Avviare il server: npm start\n');
    console.log(`Token scadrà tra ${(expires_in / 3600).toFixed(1)} ore\n`);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>✅ Autorizzazione Completata</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            text-align: center;
            max-width: 600px;
          }
          h1 { color: #28a745; margin-bottom: 20px; }
          p { color: #333; line-height: 1.8; margin: 15px 0; }
          code {
            background: #f4f4f4;
            padding: 4px 8px;
            border-radius: 3px;
            font-family: monospace;
            display: block;
            margin: 10px 0;
          }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
          .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Autorizzazione completata con successo!</h1>
          <p>Il file <code>.env</code> è stato aggiornato con l'Access Token.</p>

          <div class="info">
            <p><strong>Prossimi passi:</strong></p>
            <p>Torna al terminale e verifica la configurazione:</p>
            <code>npm run check</code>
            <p>Poi avvia il server:</p>
            <code>npm start</code>
          </div>

          <p style="margin-top: 20px; font-size: 14px; color: #666;">
            Il token scadrà tra ${(expires_in / 3600).toFixed(1)} ore.<br>
            Puoi rinnovarlo con: <code style="display: inline; padding: 2px 6px;">npm run refresh-token</code>
          </p>

          <p style="margin-top: 30px; color: #999; font-size: 12px;">
            Puoi chiudere questa finestra
          </p>
        </div>
      </body>
      </html>
    `);

    // Chiudi il server dopo 5 secondi
    setTimeout(() => {
      console.log('Chiusura server di setup...\n');
      process.exit(0);
    }, 5000);

  } catch (error) {
    console.error('\n❌ Errore durante lo scambio del token:\n');
    console.error('Dettagli:', error.response?.data || error.message);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head><title>Errore - Scambio Token</title>
      <style>
        body { font-family: Arial; padding: 50px; background: #ffebee; }
        .error { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
      </style>
      </head>
      <body>
        <div class="error">
          <h1>❌ Errore durante lo scambio del token</h1>
          <p><strong>Errore:</strong></p>
          <pre>${JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
          <p>Controlla i log nel terminale per maggiori dettagli.</p>
        </div>
      </body>
      </html>
    `);

    setTimeout(() => process.exit(1), 5000);
  }
});

// Avvia il server temporaneo
app.listen(PORT, () => {
  console.log('\n💡 TIP: Apri http://localhost:3001 nel browser per una guida visuale\n');
});
