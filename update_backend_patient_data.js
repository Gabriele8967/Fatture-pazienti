const fs = require('fs');

// Leggi il file server.js
let serverCode = fs.readFileSync('backend/server.js', 'utf8');

// 1. Aggiorna la destructuring per includere tutti i nuovi campi
const oldDestructuring = 'const { firstName, lastName, email, codiceFiscale, indirizzo, cap, citta, provincia, causale, prezzo, metodoPagamentoId } = req.body;';

const newDestructuring = `const { 
    firstName, lastName, email, codiceFiscale, indirizzo, cap, citta, provincia, 
    telefono, dataNascita, luogoNascita, professione, numeroDocumento, scadenzaDocumento, 
    emailComunicazioni, note, causale, prezzo, metodoPagamentoId 
} = req.body;`;

serverCode = serverCode.replace(oldDestructuring, newDestructuring);

// 2. Aggiorna la sezione entity per includere tutti i dettagli
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
          name: \`\${firstName} \${lastName}\`,
          first_name: firstName,
          last_name: lastName,
          email: email || emailComunicazioni,
          tax_code: codiceFiscale.toUpperCase(),
          address_street: indirizzo,
          address_postal_code: cap,
          address_city: citta,
          address_province: provincia.toUpperCase(),
          country: 'Italia',
          // Dettagli aggiuntivi paziente
          phone: telefono,
          birth_date: dataNascita,
          birth_place: luogoNascita,
          job_title: professione,
          // Note aggiuntive nel campo notes
          notes: \`Documento: \${numeroDocumento || 'N/A'}, Scadenza: \${scadenzaDocumento || 'N/A'}\${note ? ', Note: ' + note : ''}\`
        },`;

serverCode = serverCode.replace(oldEntity, newEntity);

// 3. Aggiungi validazione per i campi obbligatori
const validationStart = serverCode.indexOf('// Validazione dati');
const validationEnd = serverCode.indexOf('if (!causale', validationStart);

const oldValidation = serverCode.slice(validationStart, validationEnd);

const newValidation = `// Validazione dati
    if (!firstName || !lastName || !email || !codiceFiscale || !indirizzo || !cap || !citta || !provincia) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tutti i campi obbligatori devono essere compilati' 
      });
    }

    if (!telefono || !dataNascita || !luogoNascita) {
      return res.status(400).json({ 
        success: false, 
        message: 'Telefono, data di nascita e luogo di nascita sono obbligatori' 
      });
    }

    `;

serverCode = serverCode.replace(oldValidation, newValidation);

// Scrivi il file aggiornato
fs.writeFileSync('backend/server.js', serverCode);

console.log('✅ Backend aggiornato con tutti i dettagli paziente!');
console.log('   - Aggiunti campi: telefono, dataNascita, luogoNascita, professione');
console.log('   - Aggiunti campi: numeroDocumento, scadenzaDocumento, emailComunicazioni, note');
console.log('   - Aggiornata sezione entity con tutti i dettagli');
console.log('   - Aggiunta validazione per campi obbligatori');
