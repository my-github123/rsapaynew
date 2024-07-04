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

const getStatus = async (req, res) => {
    const { SubHeader, GetStatusRequestBody } = req.body.GetStatusRequest || {};
  
    if (!SubHeader || !GetStatusRequestBody) {
      return res.status(400).json({
        message: "Invalid request body",
        error: "SubHeader and GetStatusRequestBody are required",
      });
    }
  
    const encryptedBody = encrypt(JSON.stringify(GetStatusRequestBody));
    const apiUrl = "https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/get-status";
    const pfxPath = path.resolve(__dirname, "../certificate/client.p12");
    const passphrase = "Year@2024";
  
    try {
      const pfx = fs.readFileSync(pfxPath);
      const httpsAgent = new https.Agent({
        pfx: pfx,
        passphrase: passphrase,
      });
  
      const apiBody = {
        GetStatusRequest: {
          SubHeader,
          GetStatusRequestBodyEncrypted: encryptedBody,
        }
      };
  
      const response = await axios.post(apiUrl, apiBody, {
        httpsAgent: httpsAgent,
        headers: {
          "Content-Type": "application/json",
          "X-IBM-Client-Id": "bf21e9bd4ad7ba83c4f04b31c2833302",
          "X-IBM-Client-Secret": "d58a28965d3640ffb470dcad05d12395",
        },
      });
  
      const { GetStatusResponse } = response.data;
      const { SubHeader, GetStatusRequestBodyEncrypted } = GetStatusResponse;
      const decryptedResponseBody = decrypt(GetStatusRequestBodyEncrypted);
      const parsedResponseBody =decryptedResponseBody;
  
      res.status(200).json({
        GetStatusResponse: {
          SubHeader,
          GetStatusResponseBody: {
            data: parsedResponseBody,
            message: "Success",
            status: "S"
          }
        }
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: "Error making API call",
        error: error.message,
      });
    }
  };
  

module.exports = {
  getStatus,
};
