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
    const { firstName, lastName, email, codiceFiscale, causale, prezzo, metodoPagamentoId } = req.body;

    // Validazione input
    if (!firstName || !lastName || !email || !codiceFiscale || !causale || !prezzo || !metodoPagamentoId) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori'
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
    const grossAmount = netAmount + vatAmount;

    // Preparazione dati per Fatture in Cloud
    const invoiceData = {
      data: {
        type: 'invoice',
        entity: {
          type: 'person',
          name: `${firstName} ${lastName}`,
          first_name: firstName,
          last_name: lastName,
          email: email,
          tax_code: codiceFiscale.toUpperCase(),
          country: 'Italia'
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
            not_taxable: true
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
        payments_list: [
          {
            amount: grossAmount,
            due_date: new Date().toISOString().split('T')[0],
            paid_date: new Date().toISOString().split('T')[0],
            status: 'paid',
            payment_account: {
              id: 1415813  // Account "altro" per fatture saldate
            }
          }
        ],
        payment_method: {
          id: parseInt(metodoPagamentoId)
        },
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
