const express = require('express');
const router = express.Router();
const { transferPayment } = require('../controller/paymentController');
const { getStatus } = require('../controller/statusController');
const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function encrypt(key, text) {
    console.log(text, "TEXT IS THERE.................................");
    const keyBuffer = Buffer.from(key, 'hex');
    const ivBuffer = Buffer.from([0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A, 0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A]);

    const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer);
    let encrypted = Buffer.concat([cipher.update(JSON.stringify(text), 'utf8'), cipher.final()]);
    return Buffer.concat([ivBuffer, encrypted]).toString('base64');
}

function decrypt(key, encrypted) {
    if (!key || !encrypted) {
        throw new Error("Both key and encrypted arguments must be provided and be of type string.");
    }

    const keyBuffer = Buffer.from(key, 'hex');
    const encryptedBuffer = Buffer.from(encrypted, 'base64');
    const ivBuffer = encryptedBuffer.slice(0, 16);
    const ciphertextBuffer = encryptedBuffer.slice(16);
    const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, ivBuffer);

    let decrypted = decipher.update(ciphertextBuffer, null, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

router.post('/verifyVPA', async (req, res) => {
 try {
       const { SubHeader, VerifyVPARequestBody } = req.body.VerifyVPARequest || {};

        if (!SubHeader || !VerifyVPARequestBody) {
            return res.status(400).json({
                message: "Invalid request body",
                error: "SubHeader and VerifyVPARequestBody are required",
            });
        }

        const keyAsHexString = 'D8ABA26A5EA3126758F4F9A593BC573B';
        const keyBuffer = Buffer.from(keyAsHexString, 'hex');

        const concatenatedString = VerifyVPARequestBody.merchId +
                                   VerifyVPARequestBody.merchChanId +
                                   VerifyVPARequestBody.customerVpa +
                                   VerifyVPARequestBody.corpCode +
                                   VerifyVPARequestBody.channelId;

        const md5Hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
        VerifyVPARequestBody.checksum = md5Hash;

        const encryptedBody = encrypt(keyBuffer, VerifyVPARequestBody);

         const pfxPath = path.resolve(__dirname, "../certificate/client.p12");
       

         const passphrase = "Year@2024"; // Replace with your actual passphrase

        const pfx = fs.readFileSync(pfxPath);
        const httpsAgent = new https.Agent({
            pfx: pfx,
            passphrase: passphrase,
        });

       const apiUrl="https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/verifyVPA"
     

        const apiBody = {
            VerifyVPARequest: {
                SubHeader,
                VerifyVPARequestBodyEncrypted: encryptedBody,
            }
        };

        console.log(JSON.stringify(apiBody), "API body");
        const response = await axios.get(apiUrl,JSON.stringify(apiBody), {
            headers: {
                'Content-Type': 'application/json',
                "X-IBM-Client-Id": "bf21e9bd4ad7ba83c4f04b31c2833302",
                 "X-IBM-Client-Secret": "d58a28965d3640ffb470dcad05d12395",
            },
           httpsAgent: httpsAgent
        });

        console.log(response, "response.......");

        res.json(response.data);
    } catch (error) {
      
        
        res.status(500).json({ message: 'Internal Server Error', error:error.messege });
    }
});

router.post('/transfer-payment', transferPayment);
router.post('/get-status', getStatus);

module.exports = router;
