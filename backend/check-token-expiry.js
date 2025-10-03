require('dotenv').config();
const axios = require('axios');

console.log('\n🔍 Verifica Stato Token\n');
console.log('='.repeat(50));

const FIC_ACCESS_TOKEN = process.env.FIC_ACCESS_TOKEN;
const FIC_COMPANY_ID = process.env.FIC_COMPANY_ID;

if (!FIC_ACCESS_TOKEN || !FIC_COMPANY_ID) {
  console.error('❌ Token o Company ID mancanti nel .env');
  process.exit(1);
}

async function checkToken() {
  try {
    console.log('⏳ Verifica validità token...\n');

    // Prova a fare una chiamata API semplice
    const response = await axios.get(
      `https://api-v2.fattureincloud.it/c/${FIC_COMPANY_ID}/info/user`,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ TOKEN VALIDO!\n');
    console.log('Informazioni account:');
    console.log('  Nome:', response.data.data.name);
    console.log('  Email:', response.data.data.email);
    console.log('  Company ID:', response.data.data.company_id);
    console.log('\n✅ Il sistema può creare fatture normalmente\n');

  } catch (error) {
    if (error.response?.status === 401) {
      console.error('❌ TOKEN SCADUTO O NON VALIDO!\n');
      console.error('Azione richiesta:');
      console.error('  1. Rinnova il token: npm run refresh-token');
      console.error('  2. Se in produzione, aggiorna la variabile su Railway\n');
      process.exit(1);
    } else {
      console.error('❌ Errore nella verifica:', error.message);
      console.error('\nDettagli:', error.response?.data || 'Nessun dettaglio');
      process.exit(1);
    }
  }
}

checkToken();
