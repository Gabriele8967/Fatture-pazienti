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

console.log('\n🔐 Setup OAuth2 per Fatture in Cloud\n');
console.log('='.repeat(50));

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Errore: CLIENT_ID o CLIENT_SECRET mancanti nel file .env');
  process.exit(1);
}

// Scope necessari per creare fatture
const SCOPES = [
  'entity.clients:r',
  'entity.clients:a',
  'issued_documents.invoices:r',
  'issued_documents.invoices:a',
  'issued_documents.receipts:r',
  'issued_documents.receipts:a'
].join(' ');

// Step 1: Mostra l'URL di autorizzazione
const authUrl = `https://api-v2.fattureincloud.it/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log('\n📋 ISTRUZIONI:\n');
console.log('1. Apri questo URL nel browser:\n');
console.log(`   ${authUrl}\n`);
console.log('2. Autorizza l\'applicazione');
console.log('3. Verrai reindirizzato automaticamente\n');
console.log('='.repeat(50));
console.log('\n⏳ In attesa di autorizzazione...\n');

// Step 2: Callback per ricevere il codice
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    res.send('❌ Errore: Codice di autorizzazione non ricevuto');
    return;
  }

  try {
    console.log('✅ Codice ricevuto, scambio per access token...\n');

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
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
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
    console.log('='.repeat(50));
    console.log('\n🎉 Setup completato!\n');
    console.log('Puoi ora avviare il server con: npm start\n');
    console.log('Nota: L\'access token scade dopo', expires_in / 3600, 'ore');
    console.log('Usa lo script refresh-token.js per rinnovarlo\n');

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Autorizzazione completata</title>
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
          }
          h1 { color: #28a745; margin-bottom: 20px; }
          p { color: #333; line-height: 1.6; }
          code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Autorizzazione completata!</h1>
          <p>Il file <code>.env</code> è stato aggiornato con l'Access Token.</p>
          <p>Puoi chiudere questa finestra e tornare al terminale.</p>
          <p><strong>Prossimo step:</strong> Avvia il server con <code>npm start</code></p>
        </div>
      </body>
      </html>
    `);

    // Chiudi il server dopo 3 secondi
    setTimeout(() => {
      console.log('Chiusura server di setup...\n');
      process.exit(0);
    }, 3000);

  } catch (error) {
    console.error('❌ Errore durante lo scambio del token:', error.response?.data || error.message);
    res.send(`❌ Errore: ${error.response?.data?.error_description || error.message}`);
    process.exit(1);
  }
});

// Avvia il server temporaneo
app.listen(PORT, () => {
  console.log(`\n🌐 Server temporaneo in ascolto su http://localhost:${PORT}`);
  console.log(`\n💡 Copia e incolla l'URL sopra nel browser per iniziare!\n`);
});
