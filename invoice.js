import CryptoBotAPI from 'crypto-bot-api';

const client = new CryptoBotAPI('19152:AA26mMlredKBuAKbTb4YUGdlsgSNebr4SRY', 'https://testnet-pay.crypt.bot/api');

export function getInvoice(amount, asset) {
    return client.createInvoice({
        amount: amount,
        asset: asset,
    });
}

export async function checkInvoiceStatus(invoiceId) {
    try {
        const invoice = await client.getInvoices({ invoice_ids: [invoiceId] });  
        if (invoice && invoice[0]) {
            return invoice[0].status;  
        } else {
            throw new Error('Invoice not found');
        }
    } catch (error) {
        console.error('Error fetching invoice status:', error);
        throw error;
    }
}
