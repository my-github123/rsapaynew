const axios = require('axios');
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require("crypto");




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
  const keyBuffer = Buffer.from(key, "hex");
  const encryptedBuffer = Buffer.from(encrypted, "base64");
  const ivBuffer = encryptedBuffer.slice(0, 16);
  const ciphertextBuffer = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv("aes-128-cbc", keyBuffer, ivBuffer);
  let decrypted = decipher.update(ciphertextBuffer, null, "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

const getStatus = async (req, res) => {
  const { SubHeader, GetStatusRequestBody } = req.body.GetStatusRequest || {};

  if (!SubHeader || !GetStatusRequestBody) {
    return res.status(400).json({
      message: "Invalid request body",
      error: "SubHeader and GetStatusRequestBody are required",
    });
  }

  const keyAsHexString = 'D8ABA26A5EA3126758F4F9A593BC573B';
  const keyBuffer = Buffer.from(keyAsHexString, 'hex');

  // Ensure all required fields are present
  const { channelId, corpCode, crn } = GetStatusRequestBody;
  if (!channelId || !corpCode || !crn) {
    return res.status(400).json({
      message: "Invalid GetStatusRequestBody",
      error: "channelId, corpCode, and crn are required",
    });
  }

  const concatenatedString = channelId + corpCode + crn;
  const md5Hash = crypto
    .createHash("md5")
    .update(concatenatedString)
    .digest("hex");

  GetStatusRequestBody.checksum = md5Hash;

  let encryptedBody;
  try {
    encryptedBody = encrypt(keyBuffer, GetStatusRequestBody);
    if (!encryptedBody) throw new Error("Encryption failed.");
  } catch (error) {
    console.error("Encryption error:", error);
    return res.status(500).json({ message: "Encryption failed", error: error.message });
  }

  const apiUrl = "https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/get-status";
  const pfxPath = path.resolve(__dirname, "../certificate/mytvs_in.p12");
  const passphrase = "rsapayapps@123";

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

    const {
      SubHeader: responseSubHeader,
      GetStatusRequestBodyEncrypted,
    } = GetStatusResponse;

    let decryptedResponseBody;
    try {
      decryptedResponseBody = decrypt(keyBuffer, GetStatusRequestBodyEncrypted);
      if (!decryptedResponseBody) throw new Error("Decryption failed.");
    } catch (error) {
      console.error("Decryption error:", error);
      return res.status(500).json({ message: "Decryption failed", error: error.message });
    }

    res.status(200).json({
      GetStatusResponse: {
        SubHeader: responseSubHeader,
        GetStatusResponseBody: {
          data: decryptedResponseBody,
          message: "Success",
          status: "S"
        }
      }
    });

  } catch (error) {
    console.error("Error making API call:", error);
    res.status(500).json({
      message: "Error making API call from all",
      error: error.message,
    });
  }
};


  

module.exports = {
  getStatus,
};

