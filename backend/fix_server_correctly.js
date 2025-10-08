const fs = require('fs');

// Leggi il file server.js
let serverCode = fs.readFileSync('server.js', 'utf8');

// 1. Aggiorna la destructuring per includere tutti i nuovi campi
const oldDestructuring = 'const { firstName, lastName, email, codiceFiscale, indirizzo, cap, citta, provincia, causale, prezzo, metodoPagamentoId } = req.body;';

const newDestructuring = `const { 
    firstName, lastName, email, codiceFiscale, indirizzo, cap, citta, provincia, 
    telefono, dataNascita, luogoNascita, professione, numeroDocumento, scadenzaDocumento, 
    emailComunicazioni, note, causale, prezzo, metodoPagamentoId 
} = req.body;`;

serverCode = serverCode.replace(oldDestructuring, newDestructuring);

// 2. Aggiorna la validazione per includere i nuovi campi obbligatori
const oldValidation = `if (!firstName || !lastName || !email || !codiceFiscale || !indirizzo || !cap || !citta || !provincia || !causale || !prezzo || !metodoPagamentoId) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori'
      });
    }`;

const newValidation = `if (!firstName || !lastName || !email || !codiceFiscale || !indirizzo || !cap || !citta || !provincia || !causale || !prezzo || !metodoPagamentoId) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori'
      });
    }

    // Validazione campi aggiuntivi obbligatori
    if (!telefono || !dataNascita || !luogoNascita) {
      return res.status(400).json({
        success: false,
        message: 'Telefono, data di nascita e luogo di nascita sono obbligatori'
      });
    }`;

serverCode = serverCode.replace(oldValidation, newValidation);

// 3. Aggiorna la sezione entity per includere tutti i dettagli
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

// Scrivi il file aggiornato
fs.writeFileSync('server.js', serverCode);

console.log('✅ Server.js aggiornato correttamente!');
console.log('   - Aggiunti tutti i campi paziente');
console.log('   - Aggiornata validazione');
console.log('   - Aggiornata sezione entity con dettagli completi');
