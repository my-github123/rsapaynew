
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require("crypto");


const algorithm = "aes-256-cbc"; // Encryption algorithm
const key = crypto.randomBytes(32); // Replace with your encryption key
const iv = crypto.randomBytes(16); // Initialization vector

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(Buffer.from(JSON.stringify(text), "utf-8"));
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  // return { VerifyVPARequestBodyEncrypted: encrypted.toString('hex') };
  return encrypted.toString("hex");
};




const decrypt = (text) => {
  let encryptedText = Buffer.from(text, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const transferPayment = async (req, res) => {
    const { SubHeader, TransferPaymentRequestBody } = req.body.TransferPaymentRequest || {};
  
    if (!SubHeader || !TransferPaymentRequestBody) {
      return res.status(400).json({
        message: "Invalid request body",
        error: "SubHeader and TransferPaymentRequestBody are required",
      });
    }
  
    // Encrypt the TransferPaymentRequestBody parameter
    const encryptedBody = encrypt(TransferPaymentRequestBody);
  
    // Define the API endpoint
    const apiUrl = "https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/payments/transfer-payment";
  
    // Path to your PFX certificate and passphrase
    const pfxPath = path.resolve(__dirname, "../certificate/client.p12");
    const passphrase = "Year@2024"; // Replace with your actual passphrase
  
    try {
      // Read the PFX file synchronously
      const pfx = fs.readFileSync(pfxPath);
  
      // Create an HTTPS agent with the PFX certificate
      const httpsAgent = new https.Agent({
        pfx: pfx,
        passphrase: passphrase,
      });
  
      // Define the request body with encrypted data
      const apiBody = {
        TransferPaymentRequest: {
          SubHeader,
          TransferPaymentRequestBody: encryptedBody,
        }
      };
  
      // Make the POST request to the external API with headers and host configuration
      const response = await axios.post(apiUrl, apiBody, {
        httpsAgent: httpsAgent,
        headers: {
          "Content-Type": "application/json",
          "X-IBM-Client-Id": "bf21e9bd4ad7ba83c4f04b31c2833302",
          "X-IBM-Client-Secret": "d58a28965d3640ffb470dcad05d12395",
        },
      });
  
      // Extract the encrypted response body
      const { TransferPaymentResponse } = response.data;
      const { SubHeader, TransferPaymentResponseBodyEncrypted } = TransferPaymentResponse;
  
      // Decrypt the response body
      const decryptedResponseBody = decrypt(TransferPaymentResponseBodyEncrypted);
  
      // Send the decrypted response to the client
      res.status(200).json({
        TransferPaymentResponse: {
          SubHeader,
          TransferPaymentResponseBody:decryptedResponseBody
        }
      });
    } catch (error) {
      console.error("Error:", error);
  
      // Send an error response if the API call fails
      res.status(500).json({
        message: "Error making API call",
        error: error.message,
      });
    }
  };
  
  module.exports = {
    transferPayment,
  };








