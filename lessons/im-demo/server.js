import "dotenv/config";
import express from "express";
import * as paypal from "./paypal-api.js";
import fs from 'fs';
const { PORT = 8888 } = process.env;

// Read the devcontainer.json file
const devcontainerData = fs.readFileSync('.devcontainer/devcontainer.json');
const devcontainerConfig = JSON.parse(devcontainerData);

// Access the desired values from devcontainerConfig
const value1 = devcontainerConfig.name;
const value2 = devcontainerConfig.workspaceFolder;

console.log(value1);
console.log(value2);

// Read the devcontainer.json file
//const devcontainerData = fs.readFileSync('D:/GitHub_Projects/Paypal/paypal-docs-KR/.devcontainer/im-demo/devcontainer.json', 'utf8');

// Read the devcontainer.json file
//const devcontainerData = fs.readFileSync('./.devcontainer/im-demo/devcontainer.json', 'utf8');

// Parse the JSON data
const devcontainerJson = JSON.parse(devcontainerData);

// Access the desired value from devcontainerJson
const port = devcontainerJson['secrets']['CLIENT_ID'];

// Use the port value
console.log('Port:', port);



// Read variables from devcontainer.json file
// https://code.visualstudio.com/docs/remote/devcontainerjson-reference
// https://code.visualstudio.com/docs/remote/containers-advanced#_adding-environment-variables
// https://code.visualstudio.com/docs/remote/containers-advanced#_adding-environment-variables-to-a-container
// https://code.visualstudio.com/docs/remote/containers-advanced#_using-a-docker-compose-file


const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

// render checkout page with client id & unique client token
app.get("/", async (req, res) => {
  const clientId = process.env.CLIENT_ID;
  try {
    const clientToken = await paypal.generateClientToken();
    res.render("checkout", { clientId, clientToken });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// create order
app.post("/api/orders", async (req, res) => {
  try {
    const order = await paypal.createOrder();
    res.json(order);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// capture payment
app.post("/api/orders/:orderID/capture", async (req, res) => {
  const { orderID } = req.params;
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
