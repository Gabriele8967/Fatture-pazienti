require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const CLIENT_ID = process.env.FIC_CLIENT_ID;
const CLIENT_SECRET = process.env.FIC_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.FIC_REFRESH_TOKEN;

console.log('\n🔄 Rinnovo Access Token\n');
console.log('='.repeat(50));

if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
  console.error('❌ Errore: Credenziali mancanti nel file .env');
  console.error('Assicurati di aver eseguito setup-oauth.js prima');
  process.exit(1);
}

async function refreshAccessToken() {
  try {
    console.log('⏳ Richiesta nuovo access token...\n');

    const response = await axios.post('https://api-v2.fattureincloud.it/oauth/token', {
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { access_token, refresh_token, expires_in } = response.data;

    console.log('✅ Nuovo token ottenuto!\n');
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);
    console.log('Scadenza (secondi):', expires_in);
    console.log('\n📝 Aggiornamento file .env...\n');

    // Aggiorna il file .env
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    envContent = envContent.replace(
      /FIC_ACCESS_TOKEN=.*/,
      `FIC_ACCESS_TOKEN=${access_token}`
    );
    envContent = envContent.replace(
      /FIC_REFRESH_TOKEN=.*/,
      `FIC_REFRESH_TOKEN=${refresh_token}`
    );

    fs.writeFileSync(envPath, envContent);

    console.log('✅ File .env aggiornato!\n');
    console.log('='.repeat(50));
    console.log('\n🎉 Access token rinnovato con successo!\n');
    console.log('Il token scadrà tra', expires_in / 3600, 'ore\n');

  } catch (error) {
    console.error('❌ Errore:', error.response?.data || error.message);
    process.exit(1);
  }
}

refreshAccessToken();
