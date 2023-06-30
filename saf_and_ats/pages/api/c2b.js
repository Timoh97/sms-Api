import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { amount, phoneNumber } = req.body;
      const consumerKey = process.env.MPESA_CONSUMER_KEY;
      const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
      const shortcode = process.env.MPESA_SHORTCODE;
      const confirmationURL = process.env.MPESA_CONFIRMATION_URL;
      const validationURL = process.env.MPESA_VALIDATION_URL;

      // Generate the access token
      const { data: { access_token } } = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        headers: {
          Authorization: `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`,
        },
      });

      try {

        // Prepare the c2b url register request payload
        const payloadr = {
          ShortCode: shortcode,
          ResponseType: 'Completed',
          ConfirmationURL: confirmationURL,
          ValidationURL: validationURL,
        };

        // Register the URLs
        const { data } = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl', payloadr, {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('URLs registered successfully', data)
      } catch (error) {
        console.error('Failed to register URLs:', error);
      }


      // Prepare the c2b request payload
      const payload = {
        ShortCode: shortcode,
        CommandID: 'CustomerBuyGoodsOnline',
        Amount: amount,
        Msisdn: phoneNumber,
        BillRefNumber: 'C2B Payment',
      };

      // Make the C2B request
      const { data } = await axios.post('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate', payload, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('C2B payment simulated successfully', data)
      res.status(200).json({ success: true, message: 'C2B payment simulated successfully' });
    } catch (error) {
      console.error('Failed to simulate C2B payment:', error);
      res.status(500).json({ success: false, message: 'Failed to simulate C2B payment' });
    }
  } else {
    res.status(404).end();
  }
}