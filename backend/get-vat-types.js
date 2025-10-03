require('dotenv').config();
const axios = require('axios');

const FIC_ACCESS_TOKEN = process.env.FIC_ACCESS_TOKEN;
const FIC_COMPANY_ID = process.env.FIC_COMPANY_ID;

console.log('\n📋 Tipi IVA configurati su Fatture in Cloud\n');
console.log('='.repeat(70));

async function getVatTypes() {
  try {
    const response = await axios.get(
      `https://api-v2.fattureincloud.it/c/${FIC_COMPANY_ID}/info/vat_types`,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Tipi IVA disponibili:\n');

    response.data.data.forEach(vat => {
      console.log(`ID: ${vat.id}`);
      console.log(`  Aliquota: ${vat.value}%`);
      console.log(`  Descrizione: ${vat.description}`);
      console.log(`  Esente: ${vat.is_disabled ? 'Sì' : 'No'}`);
      console.log(`  Non imponibile: ${vat.notes || 'N/A'}`);
      console.log('---');
    });

    console.log('\n💡 Cerca un tipo IVA con:');
    console.log('   - Aliquota: 0%');
    console.log('   - Descrizione: "Esente" o "Art.10" o simili\n');
    console.log('Usa quell\'ID nel codice per prestazioni sanitarie esenti.\n');

  } catch (error) {
    console.error('❌ Errore:', error.response?.data || error.message);
  }
}

getVatTypes();
