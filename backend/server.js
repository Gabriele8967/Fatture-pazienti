require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Configurazione Fatture in Cloud
const FIC_API_URL = 'https://api-v2.fattureincloud.it';
const FIC_ACCESS_TOKEN = process.env.FIC_ACCESS_TOKEN;
const FIC_COMPANY_ID = process.env.FIC_COMPANY_ID;

// Configurazione prestazione standard
const DEFAULT_SERVICE = {
  name: process.env.SERVICE_NAME || 'Visita medica',
  price: parseFloat(process.env.SERVICE_PRICE) || 50.00,
  vat_rate: parseFloat(process.env.VAT_RATE) || 22
};

// Validazione codice fiscale italiano (base)
function isValidCodiceFiscale(cf) {
  const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  return regex.test(cf);
}

// Validazione email
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validazione CAP italiano
function isValidCAP(cap) {
  const regex = /^[0-9]{5}$/;
  return regex.test(cap);
}

// Validazione provincia italiana
function isValidProvincia(provincia) {
  const regex = /^[A-Z]{2}$/i;
  return regex.test(provincia);
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server attivo' });
});

// Endpoint per recuperare i metodi di pagamento disponibili
app.get('/api/payment-methods', async (req, res) => {
  try {
    if (!FIC_ACCESS_TOKEN || !FIC_COMPANY_ID) {
      return res.status(500).json({
        success: false,
        message: 'Configurazione server non completa'
      });
    }

    const response = await axios.get(
      `${FIC_API_URL}/c/${FIC_COMPANY_ID}/info/payment_methods`,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      success: true,
      paymentMethods: response.data.data
    });

  } catch (error) {
    console.error('Errore nel recupero metodi di pagamento:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero dei metodi di pagamento',
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Endpoint per creare la fattura
app.post('/api/create-invoice', async (req, res) => {
  try {

    // Dicitura imposta di bollo
    const bolloText = "Imposta di bollo assolta in modo virtuale - autorizzazione dell'Ag. delle Entrate, Dir. Prov. II. di Roma Aut. n. 28/2025 del 29/5/2025 ai sensi art.15 del D.P.R. n° 642/72 e succ. modif. e integraz.";
    
        const { 
    firstName, lastName, email, codiceFiscale, indirizzo, cap, citta, provincia, 
    telefono, dataNascita, luogoNascita, professione, numeroDocumento, scadenzaDocumento, 
    emailComunicazioni, causale, prezzo, metodoPagamentoId 
} = req.body;

    // Validazione input
    if (!firstName || !lastName || !email || !codiceFiscale || !indirizzo || !cap || !citta || !provincia || !causale || !prezzo || !metodoPagamentoId) {
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
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email non valida'
      });
    }

    if (!isValidCodiceFiscale(codiceFiscale)) {
      return res.status(400).json({
        success: false,
        message: 'Codice fiscale non valido'
      });
    }

    if (!isValidCAP(cap)) {
      return res.status(400).json({
        success: false,
        message: 'CAP non valido (deve essere di 5 cifre)'
      });
    }

    if (!isValidProvincia(provincia)) {
      return res.status(400).json({
        success: false,
        message: 'Provincia non valida (deve essere di 2 lettere)'
      });
    }

    if (indirizzo.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'L\'indirizzo deve contenere almeno 3 caratteri'
      });
    }

    if (citta.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'La città deve contenere almeno 2 caratteri'
      });
    }

    // Validazione causale
    if (causale.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'La causale deve contenere almeno 3 caratteri'
      });
    }

    // Validazione prezzo
    const prezzoNumerico = parseFloat(prezzo);
    if (isNaN(prezzoNumerico) || prezzoNumerico <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Il prezzo deve essere un numero maggiore di zero'
      });
    }

    // Verifica configurazione API
    if (!FIC_ACCESS_TOKEN || !FIC_COMPANY_ID) {
      console.error('Configurazione API mancante');
      return res.status(500).json({
        success: false,
        message: 'Configurazione server non completa'
      });
    }

    // Calcolo importi usando il prezzo fornito dal paziente
    const netAmount = prezzoNumerico;
    const vatRate = parseFloat(process.env.VAT_RATE) || 0; // Prestazioni sanitarie esenti IVA
    const vatAmount = (netAmount * vatRate) / 100;

    // Calcolo marca da bollo (€2,00 se fattura esente IVA > €77,47)
    const stampDuty = (vatRate === 0 && netAmount > 77.47) ? 2.00 : 0;
    const grossAmount = netAmount + vatAmount + stampDuty;

    // Preparazione dati per Fatture in Cloud
    const invoiceData = {
      data: {
        type: 'invoice',
        entity: {
          type: 'person',
          name: `${firstName} ${lastName}`,
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
          // Configurazione fattura elettronica
          e_invoice: true,
          ei_code: '0000000', // Codice per privati/consumatori finali
          // Note aggiuntive nel campo notes
          notes: `Documento: ${numeroDocumento || 'N/A'}, Scadenza: ${scadenzaDocumento || 'N/A'}

${bolloText}`
        },
        e_invoice: true,
        ei_data: {
          payment_method: 'MP05' // Bonifico bancario come codice standard
        },
        date: new Date().toISOString().split('T')[0],
        currency: {
          id: 'EUR'
        },
        language: {
          code: 'it',
          name: 'Italiano'
        },
        items_list: vatRate === 0 ? [
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
            name: 'Marca da Bollo',
            qty: 1,
            net_price: stampDuty,
            vat: {
              id: parseInt(process.env.FIC_EXEMPT_VAT_ID) || 6,
              value: 0,
              description: 'Esente art.10'
            }
          }
        ] : [
          {
            name: causale,
            qty: 1,
            net_price: netAmount,
            vat: {
              id: 0,
              value: vatRate,
              description: `Iva al ${vatRate}%`
            }
          }
        ],
        payment_method: {
          id: parseInt(metodoPagamentoId)
        },
        payments_list: [
          {
            amount: grossAmount,
            due_date: new Date().toISOString().split('T')[0],
            status: 'not_paid'
          }
        ],
        show_payment_method: true
      }
    };

    // Chiamata API Fatture in Cloud
    const response = await axios.post(
      `${FIC_API_URL}/c/${FIC_COMPANY_ID}/issued_documents`,
      invoiceData,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const invoiceId = response.data.data.id;
    const invoiceNumber = response.data.data.number;

    // Invia automaticamente la fattura via email al paziente
    try {
      const emailData = {
        data: {
          sender_id: 0,  // ID del sender email predefinito
          sender_email: 'centrimanna2@gmail.com',  // Email del sender
          recipient_email: email,  // Email del paziente che ha compilato il form
          subject: `Fattura nr. ${invoiceNumber}`,
          body: `Gentile ${firstName} ${lastName},<br><br>In allegato troverà la fattura nr. ${invoiceNumber}.<br><br>Cordiali saluti`,
          include: {
            document: true,
            delivery_note: false,
            attachment: false,
            accompanying_invoice: false
          },
          attach_pdf: true,
          send_copy: false
        }
      };

      await axios.post(
        `${FIC_API_URL}/c/${FIC_COMPANY_ID}/issued_documents/${invoiceId}/email`,
        emailData,
        {
          headers: {
            'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(`Email inviata con successo a ${email} per fattura ${invoiceNumber}`);
    } catch (emailError) {
      // Log dell'errore ma non bloccare la risposta - la fattura è stata creata comunque
      console.error('Errore nell\'invio dell\'email:', emailError.response?.data || emailError.message);
    }

    // Risposta di successo
    res.json({
      success: true,
      message: 'Fattura creata con successo e inviata via email',
      invoice: {
        id: invoiceId,
        number: invoiceNumber,
        date: response.data.data.date,
        amount: grossAmount.toFixed(2)
      }
    });

  } catch (error) {
    console.error('Errore nella creazione della fattura:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: 'Errore nella creazione della fattura',
      error: error.response?.data?.error?.message || error.message
    });
  }
});

// Avvio server (solo in sviluppo locale, non su Vercel)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server avviato sulla porta ${PORT}`);
    console.log(`Configurato per azienda ID: ${FIC_COMPANY_ID || 'NON CONFIGURATO'}`);
    console.log(`Servizio: ${DEFAULT_SERVICE.name} - €${DEFAULT_SERVICE.price}`);
  });
}

// Esporta l'app per Vercel (serverless)
module.exports = app;
