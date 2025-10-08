const fs = require('fs');

// Leggi il file server.js.backup come base
let baseCode = fs.readFileSync('server.js.backup', 'utf8');

// Trova la sezione entity e modificala per il test
const oldEntity = `        entity: {
          type: 'person',
          name: \`\${firstName} \${lastName}\`,
          first_name: firstName,
          last_name: lastName,
          email: email,
          tax_code: codiceFiscale.toUpperCase(),
          address_street: indirizzo,
          address_postal_code: cap,
          address_city: citta,
          address_province: provincia.toUpperCase(),
          country: 'Italia'
        },`;

const newEntity = `        entity: {
          type: 'person',
          name: 'Marco Testoni',
          first_name: 'Marco',
          last_name: 'Testoni',
          email: 'marco.test@example.com',
          tax_code: 'TSTMRC90M01H501Z',
          address_street: 'Via Roma 123',
          address_postal_code: '00100',
          address_city: 'Roma',
          address_province: 'RM',
          country: 'Italia',
          // Dettagli aggiuntivi paziente
          phone: '+39 123 456 7890',
          birth_date: '1990-01-01',
          birth_place: 'Roma',
          job_title: 'Ingegnere',
          // Note aggiuntive
          notes: 'Documento: AB1234567, Scadenza: 2030-01-01, Note: Test completo paziente'
        },`;

// Trova la sezione items_list e aggiungi l'imposta di bollo
const oldItemsList = `        items_list: vatRate === 0 ? [
          {
            name: causale,
            qty: 1,
            net_price: netAmount,
            not_taxable: true
          }
        ] : [`;

const newItemsList = `        items_list: vatRate === 0 ? [
          {
            name: 'Visita test',
            qty: 1,
            net_price: 100.00,
            // IMPORTANTE: usa vat con ID esente invece di not_taxable per mostrare importo corretto
            vat: {
              id: 6, // ID aliquota esente
              value: 0,
              description: 'Esente art.10'
            }
          },
          {
            name: 'Imposta di Bollo',
            qty: 1,
            net_price: 0,
            vat: {
              id: 6,
              value: 0,
              description: 'Esente art.10'
            }
          }
        ] : [`;

// Applica le modifiche
baseCode = baseCode.replace(oldEntity, newEntity);
baseCode = baseCode.replace(oldItemsList, newItemsList);

// Cambia il nome della funzione e rimuovi la parte di richiesta
const functionStart = baseCode.indexOf('app.post');
const functionEnd = baseCode.indexOf('try {', functionStart) + 6;
const afterFunction = baseCode.indexOf('});', functionStart) + 3;

const beforeFunction = baseCode.slice(0, functionStart - 8); // Rimuovi 'const express...'
const functionBody = baseCode.slice(functionEnd, afterFunction - 3);

const newTestFunction = `async function testInvoiceCreation() {
  try {${functionBody}

testInvoiceCreation();`;

const finalCode = beforeFunction + '\n' + newTestFunction;

// Scrivi il file test pulito
fs.writeFileSync('test-invoice.js', finalCode);

console.log('✅ Creato test-invoice.js pulito con imposta di bollo!');
