const fs = require('fs');

// Leggi il file server.js
let serverCode = fs.readFileSync('backend/server.js', 'utf8');

// Aggiungi la dicitura dell'imposta di bollo alla descrizione
const bolloText = "Imposta di bollo assolta in modo virtuale - autorizzazione dell'Ag. delle Entrate, Dir. Prov. II. di Roma Aut. n. 28/2025 del 29/5/2025 ai sensi art.15 del D.P.R. n° 642/72 e succ. modif. e integraz.";

// Trova la sezione items_list e aggiungi la dicitura
const oldItemsList = `        items_list: vatRate === 0 ? [
          {
            name: causale,
            qty: 1,
            net_price: netAmount,
            // IMPORTANTE: usa vat con ID esente invece di not_taxable per mostrare importo corretto
            vat: {
              id: parseInt(process.env.FIC_EXEMPT_VAT_ID) || 6, // ID aliquota esente
              value: 0,
              description: 'Esente art.10'
            }
          }
        ] : [`;

const newItemsList = `        items_list: vatRate === 0 ? [
          {
            name: causale,
            qty: 1,
            net_price: netAmount,
            // IMPORTANTE: usa vat con ID esente invece di not_taxable per mostrare importo corretto
            vat: {
              id: parseInt(process.env.FIC_EXEMPT_VAT_ID) || 6, // ID aliquota esente
              value: 0,
              description: 'Esente art.10'
            }
          },
          {
            name: 'Imposta di Bollo',
            qty: 1,
            net_price: 0,
            vat: {
              id: parseInt(process.env.FIC_EXEMPT_VAT_ID) || 6,
              value: 0,
              description: 'Esente art.10'
            }
          }
        ] : [`;

serverCode = serverCode.replace(oldItemsList, newItemsList);

// Aggiungi anche la dicitura nella sezione notes dell'entity
const oldNotes = `notes: \`Documento: \${numeroDocumento || 'N/A'}, Scadenza: \${scadenzaDocumento || 'N/A'}\${note ? ', Note: ' + note : ''}\``;

const newNotes = `notes: \`Documento: \${numeroDocumento || 'N/A'}, Scadenza: \${scadenzaDocumento || 'N/A'}\${note ? ', Note: ' + note : ''}\n\n\${bolloText}\``;

serverCode = serverCode.replace(oldNotes, newNotes);

// Aggiungi la variabile bolloText all'inizio della funzione
const functionStart = serverCode.indexOf('app.post(\'/api/create-invoice\', async (req, res) => {');
const afterTry = serverCode.indexOf('try {', functionStart) + 6;

const bolloVariable = `
    // Dicitura imposta di bollo
    const bolloText = "${bolloText}";
    
    `;

serverCode = serverCode.slice(0, afterTry) + bolloVariable + serverCode.slice(afterTry);

// Scrivi il file aggiornato
fs.writeFileSync('backend/server.js', serverCode);

console.log('✅ Aggiunta dicitura imposta di bollo!');
console.log('   - Aggiunto riga separata per imposta di bollo');
console.log('   - Aggiunta dicitura completa nelle note');
console.log('   - Testo: "Imposta di bollo assolta in modo virtuale..."');
