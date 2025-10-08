const fs = require('fs');

// Leggi il file test-invoice.js
let testCode = fs.readFileSync('test-invoice.js', 'utf8');

// Trova la sezione items_list e aggiungi solo la riga per l'imposta di bollo
const oldItemsList = `        items_list: [{
          name: 'Visita test',
          qty: 1,
          net_price: 100.00,
          // IMPORTANTE: usa vat con ID esente invece di not_taxable per mostrare importo corretto
          vat: {
            id: 6, // ID aliquota esente
            value: 0,
            description: 'Esente art.10'
          }
        }],`;

const newItemsList = `        items_list: [{
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
        }],`;

testCode = testCode.replace(oldItemsList, newItemsList);

// Scrivi il file aggiornato
fs.writeFileSync('test-invoice.js', testCode);

console.log('✅ test-invoice.js aggiornato con riga imposta di bollo!');
console.log('   - Aggiunta riga separata per imposta di bollo');
console.log('   - Mantenuta sintassi corretta');
