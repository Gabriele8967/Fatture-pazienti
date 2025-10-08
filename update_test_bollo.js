const fs = require('fs');

// Leggi il file test-invoice.js
let testCode = fs.readFileSync('backend/test-invoice.js', 'utf8');

// Aggiungi la dicitura dell'imposta di bollo
const bolloText = "Imposta di bollo assolta in modo virtuale - autorizzazione dell'Ag. delle Entrate, Dir. Prov. II. di Roma Aut. n. 28/2025 del 29/5/2025 ai sensi art.15 del D.P.R. n° 642/72 e succ. modif. e integraz.";

// Trova la sezione items_list e aggiungi la riga per l'imposta di bollo
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

// Aggiungi la dicitura nelle note
const oldNotes = `notes: 'Documento: AB1234567, Scadenza: 2030-01-01, Note: Test completo paziente'`;

const newNotes = `notes: 'Documento: AB1234567, Scadenza: 2030-01-01, Note: Test completo paziente\n\n${bolloText}'`;

testCode = testCode.replace(oldNotes, newNotes);

// Scrivi il file aggiornato
fs.writeFileSync('backend/test-invoice.js', testCode);

console.log('✅ test-invoice.js aggiornato con dicitura imposta di bollo!');
console.log('   - Aggiunta riga separata per imposta di bollo');
console.log('   - Aggiunta dicitura completa nelle note');
