require('dotenv').config();
const axios = require('axios');

const FIC_API_URL = 'https://api-v2.fattureincloud.it';
const FIC_ACCESS_TOKEN = process.env.FIC_ACCESS_TOKEN;
const FIC_COMPANY_ID = process.env.FIC_COMPANY_ID;

async function testInvoiceCreation() {
  try {
    console.log('1. Creazione fattura...');
    
    const invoiceData = {
      data: {
        type: 'invoice',
        entity: {
          type: 'person',
          name: 'Marco Testoni',
          first_name: 'Marco',
          last_name: 'Testoni',
          email: 'marco.test@example.com',
          tax_code: 'TSTMRC90M01H501Z',
          country: 'Italia'
        },
        date: new Date().toISOString().split('T')[0],
        currency: { id: 'EUR' },
        language: { code: 'it', name: 'Italiano' },
        items_list: [{
          name: 'Visita test',
          qty: 1,
          net_price: 100.00,
          not_taxable: true
        }],
        payments_list: [{
          amount: 100.00,
          due_date: new Date().toISOString().split('T')[0],
          paid_date: new Date().toISOString().split('T')[0],
          status: 'paid',
          payment_account: { id: 1415813 }
        }],
        payment_method: { id: 2382116 },
        show_payment_method: true
      }
    };

    const createResponse = await axios.post(
      `${FIC_API_URL}/c/${FIC_COMPANY_ID}/issued_documents`,
      invoiceData,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const invoiceId = createResponse.data.data.id;
    const invoiceNumber = createResponse.data.data.number;
    console.log(`✅ Fattura creata: ID ${invoiceId}, Numero ${invoiceNumber} (già saldata)`);

    console.log('\n2. Invio email...');
    const emailData = {
      data: {
        sender_id: 0,
        sender_email: 'centrimanna2@gmail.com',
        recipient_email: 'marco.test@example.com',
        subject: `Fattura nr. ${invoiceNumber}`,
        body: `Gentile Marco Testoni,<br><br>In allegato troverà la fattura nr. ${invoiceNumber}.<br><br>Cordiali saluti`,
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
    console.log('✅ Email inviata');

    console.log('\n3. Verifica dati fattura...');
    const getResponse = await axios.get(
      `${FIC_API_URL}/c/${FIC_COMPANY_ID}/issued_documents/${invoiceId}`,
      {
        headers: {
          'Authorization': `Bearer ${FIC_ACCESS_TOKEN}`
        }
      }
    );

    const invoice = getResponse.data.data;
    console.log('\n📋 Dati fattura:');
    console.log(`   Nome: ${invoice.entity.name}`);
    console.log(`   Nome: ${invoice.entity.first_name} ${invoice.entity.last_name}`);
    console.log(`   Email: ${invoice.entity.email}`);
    console.log(`   Codice Fiscale: ${invoice.entity.tax_code}`);
    console.log(`   Stato pagamento: ${invoice.payments_list[0].status}`);
    console.log(`\n✅ Test completato con successo!`);

  } catch (error) {
    console.error('❌ Errore:', error.response?.data || error.message);
  }
}

testInvoiceCreation();
