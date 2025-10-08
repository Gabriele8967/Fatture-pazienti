const fs = require('fs');

// Leggi il file test-invoice.js
let testCode = fs.readFileSync('backend/test-invoice.js', 'utf8');

// Aggiorna la sezione entity con tutti i dettagli
const oldEntity = `        entity: {
          type: 'person',
          name: 'Marco Testoni',
          first_name: 'Marco',
          last_name: 'Testoni',
          email: 'marco.test@example.com',
          tax_code: 'TSTMRC90M01H501Z',
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

testCode = testCode.replace(oldEntity, newEntity);

// Scrivi il file aggiornato
fs.writeFileSync('backend/test-invoice.js', testCode);

console.log('✅ test-invoice.js aggiornato con dettagli completi paziente!');
console.log('   - Aggiunti: indirizzo completo, telefono, data/luogo nascita');
console.log('   - Aggiunti: professione, documento, note');
