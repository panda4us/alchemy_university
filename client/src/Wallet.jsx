import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import {toHex} from "ethereum-cryptography/utils";
function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey, publicKey, setPublicKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    //console.log(secp.secp256k1.getPublicKey);
    const address = toHex(secp.secp256k1.getPublicKey(privateKey));//secp.getPublicKey(privateKey);//scep256k1.getPublicKey(privateKey);
    setAddress((address));
    const publicKey = toHex(secp.secp256k1.getPublicKey(privateKey));
    console.log(publicKey);
    setPublicKey(publicKey);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      console.log(address);
      console.log(publicKey);
      console.log(balance);
      setBalance(balance);
    } else {
      setBalance(0);
    }

  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type the PrivateKey, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Public Key:{publicKey}
      </div>

      <div>
        Address:{address.slice(-20)}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
