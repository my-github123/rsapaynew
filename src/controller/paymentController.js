const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");
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

const transferPayment = async (req, res) => {
  const { SubHeader, TransferPaymentRequestBody } =
    req.body.TransferPaymentRequest || {};



  if (!SubHeader || !TransferPaymentRequestBody) {
    return res.status(400).json({
      message: "Invalid request body",
      error: "SubHeader and TransferPaymentRequestBody are required",
    });
  }

  const keyAsHexString = "D8ABA26A5EA3126758F4F9A593BC573B";
  const keyBuffer = Buffer.from(keyAsHexString, "hex");

  const concatenatedString = 
  TransferPaymentRequestBody.channelId +
  TransferPaymentRequestBody.corpCode +
  TransferPaymentRequestBody.paymentDetails[0].txnPaymode +
  TransferPaymentRequestBody.paymentDetails[0].custUniqRef +
  TransferPaymentRequestBody.paymentDetails[0].corpAccNum +
  TransferPaymentRequestBody.paymentDetails[0].valueDate +
  TransferPaymentRequestBody.paymentDetails[0].txnAmount +
  TransferPaymentRequestBody.paymentDetails[0].beneLEI +
  TransferPaymentRequestBody.paymentDetails[0].beneName +
  TransferPaymentRequestBody.paymentDetails[0].beneCode +
  TransferPaymentRequestBody.paymentDetails[0].beneAccNum +
  TransferPaymentRequestBody.paymentDetails[0].beneAcType +
  TransferPaymentRequestBody.paymentDetails[0].beneAddr1 +
  TransferPaymentRequestBody.paymentDetails[0].beneAddr2 +
  TransferPaymentRequestBody.paymentDetails[0].beneAddr3 +
  TransferPaymentRequestBody.paymentDetails[0].beneCity +
  TransferPaymentRequestBody.paymentDetails[0].beneState +
  TransferPaymentRequestBody.paymentDetails[0].benePincode +
  TransferPaymentRequestBody.paymentDetails[0].beneIfscCode +
  TransferPaymentRequestBody.paymentDetails[0].beneBankName +
  TransferPaymentRequestBody.paymentDetails[0].baseCode +
  TransferPaymentRequestBody.paymentDetails[0].chequeNumber +
  TransferPaymentRequestBody.paymentDetails[0].chequeDate +
  TransferPaymentRequestBody.paymentDetails[0].payableLocation +
  TransferPaymentRequestBody.paymentDetails[0].printLocation +
  TransferPaymentRequestBody.paymentDetails[0].beneEmailAddr1 +
  TransferPaymentRequestBody.paymentDetails[0].beneMobileNo +
  TransferPaymentRequestBody.paymentDetails[0].productCode +
  TransferPaymentRequestBody.paymentDetails[0].txnType +
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceAmount+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceNumber+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceDate+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.cashDiscount+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.tax+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.netAmount+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceInfo1+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceInfo2+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceInfo3+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceInfo4+
  // TransferPaymentRequestBody.paymentDetails[0]?.invoiceDetails[0]?.invoiceInfo5+
  TransferPaymentRequestBody.paymentDetails[0].enrichment1 +
  TransferPaymentRequestBody.paymentDetails[0].enrichment2 +
  TransferPaymentRequestBody.paymentDetails[0].enrichment3 +
  TransferPaymentRequestBody.paymentDetails[0].enrichment4 +
  TransferPaymentRequestBody.paymentDetails[0].enrichment5 +
  TransferPaymentRequestBody.paymentDetails[0].senderToReceiverInfo;

  const md5Hash = crypto
    .createHash("md5")
    .update(concatenatedString)
    .digest("hex");

    console.log(md5Hash,"MD5 HASH");
    
  TransferPaymentRequestBody.checksum = md5Hash;

  // Encrypt the TransferPaymentRequestBody parameter
  const encryptedBody = encrypt(keyBuffer, TransferPaymentRequestBody);

  // Define the API endpoint
  const apiUrl ="https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/payments/transfer-payment";

  // Path to your PFX certificate and passphrase
  const pfxPath = path.resolve(__dirname, "../certificate/mytvs_in.p12");
  const passphrase = "rsapayapps@123"; // Replace with your actual passphrase

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
        TransferPaymentRequestBodyEncrypted:encryptedBody,
      },
    };

    console.log(JSON.stringify(apiBody), "BODY IS THERE.............................");

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
    const {
      SubHeader: responseSubHeader,
      TransferPaymentResponseBodyEncrypted,
    } = TransferPaymentResponse;

    // Decrypt the response body
    const decryptedResponseBody = decrypt(
      keyBuffer,
      TransferPaymentResponseBodyEncrypted
    );

    // Send the decrypted response to the client
    res.status(200).json({
      TransferPaymentResponse: {
        SubHeader: responseSubHeader,
        TransferPaymentResponseBody: decryptedResponseBody,
      },
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
