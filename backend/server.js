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

// Endpoint per creare la fattura
app.post('/api/create-invoice', async (req, res) => {
  try {
    const { firstName, lastName, email, codiceFiscale, causale, prezzo } = req.body;

    // Validazione input
    if (!firstName || !lastName || !email || !codiceFiscale || !causale || !prezzo) {
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
            status: 'not_paid'
          }
        ],
        payment_method: {
          name: process.env.PAYMENT_METHOD || 'Contanti'
        }
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

    // Risposta di successo
    res.json({
      success: true,
      message: 'Fattura creata con successo',
      invoice: {
        id: response.data.data.id,
        number: response.data.data.number,
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
