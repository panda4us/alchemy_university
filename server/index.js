const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const {secp256k1}  = require("ethereum-cryptography/secp256k1");
const {toHex, hexToBytes} = require("ethereum-cryptography/utils");
const { sha256 } =require ("ethereum-cryptography/sha256.js");
const { utf8ToBytes } =require("ethereum-cryptography/utils.js");

const reviver = (key, value) => (key === "big" ? BigInt(value) : value);


const { Buffer } =require('buffer');

// @ts-ignore
//window.Buffer = Buffer;


app.use(cors());
app.use(express.json());





const balances = {
  "0361dc5e8a5e87ff474d8649ebbc7c69686c63659ee3abc584e116f207322f5c47": 100,
  "036aa749533bb2716bce92a07c6ef368aee2d650083f5fd52be17f28876eca1e4f": 50,
  "03112fa270ad4b2fc0269dc7a9d4286dd3bc20d793b91e609feb47324ff8342622": 50,

};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  console.log(address, balances[address]);
  
  const balance = balances[address] || 0;
  res.send({ balance :balance});
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);
  console.log(((signature)));
  
  //verify signature 
  const isSigned = secp256k1.verify((signature), sha256(utf8ToBytes(amount + recipient)), sender)
  console.log(isSigned);
  //res.status(400).send({ message: isSigned });
  if (!(isSigned)){
    res.status(400).send({ message: "Wrong Signature!" });
  } else if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(sender) {
  if (!balances[sender]) {
    balances[sender] = 0;
  }
}
