require('dotenv').config();

console.log('\n🔍 Verifica Configurazione\n');
console.log('='.repeat(50));

const checks = [
  {
    name: 'Client ID',
    value: process.env.FIC_CLIENT_ID,
    required: true
  },
  {
    name: 'Client Secret',
    value: process.env.FIC_CLIENT_SECRET,
    required: true,
    mask: true
  },
  {
    name: 'Company ID',
    value: process.env.FIC_COMPANY_ID,
    required: true
  },
  {
    name: 'Access Token',
    value: process.env.FIC_ACCESS_TOKEN,
    required: true,
    mask: true
  },
  {
    name: 'Refresh Token',
    value: process.env.FIC_REFRESH_TOKEN,
    required: false,
    mask: true
  },
  {
    name: 'Port',
    value: process.env.PORT || '3000',
    required: false
  },
  {
    name: 'Service Name',
    value: process.env.SERVICE_NAME,
    required: false
  },
  {
    name: 'Service Price',
    value: process.env.SERVICE_PRICE,
    required: false
  }
];

let hasErrors = false;

checks.forEach(check => {
  const status = check.value ? '✅' : (check.required ? '❌' : '⚠️');
  let displayValue = check.value || 'NON CONFIGURATO';

  if (check.value && check.mask) {
    displayValue = check.value.substring(0, 10) + '...' + check.value.substring(check.value.length - 5);
  }

  console.log(`${status} ${check.name}: ${displayValue}`);

  if (check.required && !check.value) {
    hasErrors = true;
  }
});

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('\n❌ ERRORE: Alcune configurazioni obbligatorie mancano!\n');
  console.log('Esegui: npm run setup\n');
  process.exit(1);
} else {
  console.log('\n✅ Configurazione completa!\n');
  console.log('Il sistema è pronto per essere avviato con: npm start\n');
  process.exit(0);
}
