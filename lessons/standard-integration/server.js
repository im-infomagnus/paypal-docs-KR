import "dotenv/config"; // loads variables from .env file
import express from "express";
import * as paypal from "./paypal-api.js";
import { readFile, writeFile } from "fs";
const { PORT = 8889 } = process.env;

const app = express();

app.use(express.static("public"));

// parse post params sent in body in json format
app.use(express.json());

app.post("/my-server/create-paypal-order", async (req, res) => {
  try {
    readFile('./public/index.html', 'utf-8', function (err, contents) {
      if (err) {
        console.log(err);
        return;
      }
      const replaced = contents.replace(/test/g, process.env.CLIENT_ID).replace(/undefined/g, process.env.CLIENT_ID);

      writeFile('./public/index.html', replaced, 'utf-8', function (err) {
        console.log(err);
      });
    });
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/my-server/capture-paypal-order", async (req, res) => {
  const { orderID } = req.body;
  try {
    const captureData = await paypal.capturePayment(orderID);
    res.json(captureData);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}/`);
});


