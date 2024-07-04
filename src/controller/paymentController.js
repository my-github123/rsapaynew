
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require("crypto");


function encrypt(key, text) {
  const keyBuffer = Buffer.from(key, 'hex');
   const ivBuffer = Buffer.from([0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A, 0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A]);
  

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer);
  let encrypted = Buffer.concat([cipher.update(JSON.stringify(text), 'utf8'), cipher.final()]);
  return Buffer.concat([ivBuffer, encrypted]).toString('base64');
}

function decrypt(key, encrypted) {
  const keyBuffer = Buffer.from(key, 'hex');
  const encryptedBuffer = Buffer.from(encrypted, 'base64');
  const ivBuffer = encryptedBuffer.slice(0, 16);
  const ciphertextBuffer = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, ivBuffer);
  let decrypted = decipher.update(ciphertextBuffer, null, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const transferPayment = async (req, res) => {
    const { SubHeader, TransferPaymentRequestBody } = req.body.TransferPaymentRequest || {};
  
    if (!SubHeader || !TransferPaymentRequestBody) {
      return res.status(400).json({
        message: "Invalid request body",
        error: "SubHeader and TransferPaymentRequestBody are required",
      });
    }

    const keyAsHexString = 'D8ABA26A5EA3126758F4F9A593BC573B';

    // Convert hexadecimal string to Buffer
    const keyBuffer = Buffer.from(keyAsHexString, 'hex');
  
  
    
    console.log(keyBuffer,"KEY BUFFER IS THERE..."); // Output the Buffer
  
  
    // Encrypt the TransferPaymentRequestBody parameter
    const encryptedBody = encrypt(keyBuffer,TransferPaymentRequestBody);
  
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

      const body=JSON.parse(apiBody);
  
      // Make the POST request to the external API with headers and host configuration
      const response = await axios.post(apiUrl, body, {
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
      const decryptedResponseBody = decrypt(keyBuffer,TransferPaymentResponseBodyEncrypted);
  
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








