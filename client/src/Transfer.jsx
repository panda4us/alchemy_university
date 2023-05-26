import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { utf8ToBytes } from "ethereum-cryptography/utils.js";

import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

/*BigInt.prototype.toJSON = function () {
  return this.toString();
};
*/


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
//  const [signature, setSignature] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    
    const signature =(secp.secp256k1.sign(sha256(utf8ToBytes(sendAmount + recipient)), privateKey)).toCompactHex();
    
    console.log(address,parseInt(sendAmount),recipient,signature);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        recipient,
        amount: parseInt(sendAmount),
        signature,


      });

      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>


      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
