import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { phoneNumber, amount, accountReference, transactionDescription } = req.body;
      const consumerKey = process.env.MPESA_CONSUMER_KEY;
      const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
      const shortcode = process.env.MPESA_SHORTCODE;
      const initiatorName = process.env.MPESA_INITIATOR_NAME;
      const securityCredential = process.env.MPESA_SECURITY_CREDENTIAL;
      const queueTimeOutURL = process.env.MPESA_QUEUE_TIME_URL;
      const resultURL = process.env.MPESA_RESULT_URL;

      // Generate the access token
      const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
        },
      });

      // Prepare the b2c request payload
      const payload = {
        InitiatorName: initiatorName,
        SecurityCredential: securityCredential,
        CommandID: 'BusinessPayment',
        Amount: amount,
        PartyA: shortcode,
        PartyB: phoneNumber,
        Remarks: transactionDescription,
        QueueTimeOutURL: queueTimeOutURL,
        ResultURL: resultURL,
        Occasion: accountReference,
      };

      // initiate the B2C request
      const { data } = await axios.post(
        'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest',
        payload,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('B2C payment request sent successfully', data)
      res.status(200).json({ success: true, message: 'B2C payment request sent successfully' });
    } catch (error) {
      console.error('Failed to send B2C payment request:', error);
      res.status(500).json({ success: false, message: 'Failed to send B2C payment request' });
    }
  } else {
    res.status(404).end();
  }
}