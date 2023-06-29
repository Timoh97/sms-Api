import axios from 'axios';

const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const baseUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';

// Function to generate an access token
const generateAccessToken = async () => {
  try {
    const response = await axios.get(baseUrl, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });

    const { access_token } = response.data;
    return access_token;
  } catch (error) {
    console.error('Error generating access token:', error);
    throw error;
  }
};

// Function to make B2C payment request
const makeB2CPayment = async (accessToken, phoneNumber, amount, accountReference, transactionDesc) => {
  const url = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest';

  const payload = {
    InitiatorName: 'YOUR_INITIATOR_NAME',
    SecurityCredential: 'YOUR_SECURITY_CREDENTIAL',
    CommandID: 'SalaryPayment',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: 'YOUR_SHORTCODE',
    Remarks: transactionDesc,
    QueueTimeOutURL: 'YOUR_QUEUE_TIMEOUT_URL',
    ResultURL: 'YOUR_RESULT_URL',
    Occasion: accountReference,
    AccessToken: accessToken,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('B2C Payment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error making B2C payment request:', error);
    throw error;
  }
};

export { generateAccessToken, makeB2CPayment };
