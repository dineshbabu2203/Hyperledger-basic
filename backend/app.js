const express = require("express");
const cors = require("cors");
const { Gateway, Wallets } = require("fabric-network");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const ccpPath = path.resolve(
  __dirname,
  "..",
  "fabric-samples",
  "test-network",
  "organizations",
  "peerOrganizations",
  "org1.example.com",
  "connection-org1.json"
);

async function getContract() {
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
  const walletPath = path.join(__dirname, "wallet");
  console.log(walletPath)
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "appUser",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  return network.getContract("basic");
}

// app.post("/api/save", async (req, res) => {
//   const { id, name, age } = req.body;
 
//   try {
//     const contract = await getContract();
//     await contract.submitTransaction("SaveUser", id, name, age);
//     res.send("User saved");
//   } catch (e) {
//     res.status(500).send(e.message);
//   }
// });

app.post("/api/save", async (req, res) => {
  const { id, name, age } = req.body;
  try {
    const contract = await getContract();
    await contract.submitTransaction("SaveUser", id, name, age);
    res.send("User saved");
  } catch (e) {
    console.error("Error in /api/save:", e);
    res.status(500).send(e.message);
  }
});


app.get("/api/read/:id", async (req, res) => {
  try {
    const contract = await getContract();
    const result = await contract.evaluateTransaction("ReadUser", req.params.id);
    res.json(JSON.parse(result.toString()));
  } catch (e) {
    res.status(500).send(e.message);
  }
});

app.listen(4000, () => console.log("Backend running on port 4000"));
