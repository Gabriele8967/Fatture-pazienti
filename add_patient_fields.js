const fs = require('fs');

// Leggi il file HTML
let htmlContent = fs.readFileSync('frontend/index.html', 'utf8');

// Trova la posizione dopo il campo provincia
const provinciaEnd = htmlContent.indexOf('</div>', htmlContent.indexOf('id="provincia"')) + 6;

// Campi da aggiungere
const newFields = `
            <div class="form-group">
                <label for="telefono">Telefono *</label>
                <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="+39 123 456 7890"
                    required
                >
            </div>

            <div class="form-group">
                <label for="dataNascita">Data di Nascita *</label>
                <input
                    type="date"
                    id="dataNascita"
                    name="dataNascita"
                    required
                >
            </div>

            <div class="form-group">
                <label for="luogoNascita">Luogo di Nascita *</label>
                <input
                    type="text"
                    id="luogoNascita"
                    name="luogoNascita"
                    placeholder="Roma"
                    required
                >
            </div>

            <div class="form-group">
                <label for="professione">Professione</label>
                <input
                    type="text"
                    id="professione"
                    name="professione"
                    placeholder="Ingegnere, Medico, etc."
                >
            </div>

            <div class="form-group">
                <label for="numeroDocumento">Numero Documento</label>
                <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    placeholder="AB1234567"
                >
            </div>

            <div class="form-group">
                <label for="scadenzaDocumento">Scadenza Documento</label>
                <input
                    type="date"
                    id="scadenzaDocumento"
                    name="scadenzaDocumento"
                >
            </div>

            <div class="form-group">
                <label for="emailComunicazioni">Email per Comunicazioni</label>
                <input
                    type="email"
                    id="emailComunicazioni"
                    name="emailComunicazioni"
                    placeholder="comunicazioni@email.it"
                >
            </div>

            <div class="form-group">
                <label for="note">Note Aggiuntive</label>
                <textarea
                    id="note"
                    name="note"
                    rows="3"
                    placeholder="Note particolari, allergie, etc."
                ></textarea>
            </div>
`;

// Inserisci i nuovi campi
htmlContent = htmlContent.slice(0, provinciaEnd) + newFields + htmlContent.slice(provinciaEnd);

// Aggiorna anche la parte JavaScript per raccogliere i nuovi dati
const formDataStart = htmlContent.indexOf('const formData = {');
const formDataEnd = htmlContent.indexOf('};', formDataStart) + 2;

const oldFormData = htmlContent.slice(formDataStart, formDataEnd);

const newFormData = `const formData = {
                firstName: document.getElementById('firstName').value.trim(),
                lastName: document.getElementById('lastName').value.trim(),
                email: document.getElementById('email').value.trim(),
                codiceFiscale: document.getElementById('codiceFiscale').value.trim().toUpperCase(),
                indirizzo: document.getElementById('indirizzo').value.trim(),
                cap: document.getElementById('cap').value.trim(),
                citta: document.getElementById('citta').value.trim(),
                provincia: document.getElementById('provincia').value.trim().toUpperCase(),
                telefono: document.getElementById('telefono').value.trim(),
                dataNascita: document.getElementById('dataNascita').value,
                luogoNascita: document.getElementById('luogoNascita').value.trim(),
                professione: document.getElementById('professione').value.trim(),
                numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
                scadenzaDocumento: document.getElementById('scadenzaDocumento').value,
                emailComunicazioni: document.getElementById('emailComunicazioni').value.trim(),
                note: document.getElementById('note').value.trim(),
                causale: document.getElementById('causale').value.trim(),
                prezzo: parseFloat(document.getElementById('prezzo').value),
                metodoPagamentoId: document.getElementById('metodoPagamento').value
            };`;

htmlContent = htmlContent.replace(oldFormData, newFormData);

// Scrivi il file aggiornato
fs.writeFileSync('frontend/index.html', htmlContent);

console.log('✅ Frontend aggiornato con nuovi campi paziente!');
console.log('   - Aggiunti: telefono, dataNascita, luogoNascita, professione');
console.log('   - Aggiunti: numeroDocumento, scadenzaDocumento, emailComunicazioni, note');
console.log('   - Aggiornato JavaScript per raccogliere i nuovi dati');
