import fetch from "node-fetch";
import { readFile, writeFile } from "fs";


const { CLIENT_ID, APP_SECRET } = process.env;
const base = "https://api-m.sandbox.paypal.com";

export async function createOrder() {
  const accessToken = await generateAccessToken();
  UpdateClientId(function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });

  const url = `${base}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "100.00",
          },
        },
      ],
    }),
  });

  return handleResponse(response);
}

export async function capturePayment(orderId) {
  const accessToken = await generateAccessToken();
  UpdateClientId(function (err) {
    if (err) {
      console.log(err);
      return;
    }
  });
  const url = `${base}/v2/checkout/orders/${orderId}/capture`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse(response);
}

export async function generateAccessToken() {
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
  const response = await fetch(`${base}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });

  const jsonData = await handleResponse(response);
  return jsonData.access_token;
}

async function handleResponse(response) {
  if (response.status === 200 || response.status === 201) {
    return response.json();
  }

  const errorMessage = await response.text();
  throw new Error(errorMessage);
}

function UpdateClientId(callback) {
  const fs = require('fs');
  const path = require('path');

  const filePath = path.join(__dirname, 'public', 'index.html');
  const encoding = 'utf-8';

  fs.readFile(filePath, encoding, function (err, contents) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    const replaced = contents.replace(/test/g, process.env.CLIENT_ID).replace(/undefined/g, process.env.CLIENT_ID);

    fs.writeFile(filePath, replaced, encoding, function (err) {
      if (err) {
        console.log(err);
        return callback(err);
      }

      callback(null);
    });
  });
}