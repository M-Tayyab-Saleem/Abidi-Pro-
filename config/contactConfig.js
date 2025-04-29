const axios = require('axios');

const sendOtpOnWhatsApp = async (contact, otp, name = "User") => {
    const url = process.env.SENSY_API_URL;

 try {
    const payload = {
      apiKey: process.env.SENSY_API_KEY,
      campaignName: "Rydme",
      destination: contact,
      userName: name,
      templateParams: [
        otp.toString()
      ],
      buttons: [
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: "TESTCODE20"
            }
          ]
        }
      ]
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, payload, { headers });
    return response.data;
  } catch (err) {
    console.error("Error sending OTP via WhatsApp:", err.response?.data || err.message);
    throw new Error("Failed to send OTP via WhatsApp");
  }
};

module.exports = sendOtpOnWhatsApp;