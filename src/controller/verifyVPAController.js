const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const fetch = require("node-fetch");

function encrypt(key, text) {
 
  const keyBuffer = Buffer.from(key, "hex");
  const ivBuffer = Buffer.from([
    0x8e, 0x12, 0x39, 0x9c, 0x07, 0x72, 0x6f, 0x5a, 0x8e, 0x12, 0x39, 0x9c,
    0x07, 0x72, 0x6f, 0x5a,
  ]);

  const cipher = crypto.createCipheriv("aes-128-cbc", keyBuffer, ivBuffer);
  let encrypted = Buffer.concat([
    cipher.update(JSON.stringify(text), "utf8"),
    cipher.final(),
  ]);
  return Buffer.concat([ivBuffer, encrypted]).toString("base64");
}

function decrypt(key, encrypted) {
  if (!key || !encrypted) {
    throw new Error(
      "Both key and encrypted arguments must be provided and be of type string."
    );
  }

  const keyBuffer = Buffer.from(key, "hex");
  const encryptedBuffer = Buffer.from(encrypted, "base64");
  const ivBuffer = encryptedBuffer.slice(0, 16);
  const ciphertextBuffer = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, ivBuffer);

  let decrypted = decipher.update(ciphertextBuffer, null, "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

const verifyVPA = async (req, res) => {
  

  const { SubHeader, VerifyVPARequestBody } = req.body.VerifyVPARequest || {};

  if (!SubHeader || !VerifyVPARequestBody) {
    return res.status(400).json({
      message: "Invalid request body",
      error: "SubHeader and VerifyVPARequestBody are required",
    });
  }

  const keyAsHexString = "D8ABA26A5EA3126758F4F9A593BC573B";

  // Convert hexadecimal string to Buffer
  const keyBuffer = Buffer.from(keyAsHexString, "hex");
  const concatenatedString = `${VerifyVPARequestBody.merchId}${VerifyVPARequestBody.merchChanId}${VerifyVPARequestBody.customerVpa}${VerifyVPARequestBody.corpCode}${VerifyVPARequestBody.channelId}`;
  const md5Hash = crypto
    .createHash("md5")
    .update(concatenatedString)
    .digest("hex");



  VerifyVPARequestBody.checksum = md5Hash;

  // Encrypt the VerifyVPARequestBody parameter
  const encryptedBody = encrypt(keyBuffer, VerifyVPARequestBody);

  // Define the API endpoint
  //const apiUrl ="https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/verifyVPA";

  const apiUrl ="https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/verifyVPA";

  

  
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

    const apiBody = {
      VerifyVPARequest: {
        SubHeader,
        VerifyVPARequestBodyEncrypted: encryptedBody,
      },
    };

    const body = JSON.stringify(apiBody);

    var pure=JSON.stringify(apiBody);

    
   
    console.log(body,"before API HIT.............");
    // Make the POST request to the external API with headers and host configuration
    const response = await axios.post(apiUrl, body, {
      // headers: {
      //   'Content-Type': 'application/json',
      //   'X-IBM-Client-Id': 'bf21e9bd4ad7ba83c4f04b31c2833302',
      //   'X-IBM-Client-Secret': 'd58a28965d3640ffb470dcad05d12395',
      // },
      httpsAgent: httpsAgent, // Pass the HTTPS agent
    });

    console.log(body,"AFTER API HIT.............");
    

    const responseBody = await response.json();
  

    // Decrypt the VerifyVPAResponseBodyEncrypted field in the response
    const encryptedResponseBody =
      responseBody.VerifyVPAResponse.VerifyVPAResponseBodyEncrypted;

    const decryptedResponseBody = decrypt(keyBuffer, encryptedResponseBody);

    // Replace the encrypted value with the decrypted value in the response
    const finalResponse = {
      VerifyVPAResponse: {
        SubHeader: responseBody.VerifyVPAResponse.SubHeader,
        VerifyVPAResponseBody: decryptedResponseBody,
      },
    };

    console.log(body,"MIDDLE ...");
    

    // Send the response from the external API back to the client
    res.status(200).json(finalResponse);
  } catch (error) {
   
    console.log(pure,"CATCH INSIDE ...");
    // Send an error response if the API call fails
    return res.status(500).json({
      message: "Error occurred from axis bank API",
      error: error.message,
      status: error.response?.status || 500,
    });
  }
};

module.exports = {
  verifyVPA,
};
