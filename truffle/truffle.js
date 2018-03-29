const INFURA_KEY = 'HEXAufFeaVzkqSn35q8t';
require('dotenv').config();

const Web3 = require("web3");
const web3 = new Web3();
const WalletProvider = require("truffle-wallet-provider");
const Wallet = require('ethereumjs-wallet');
console.log(`Private Key: ${process.env["pkey"]}`);

var privateKey = new Buffer(process.env["pkey"], "hex")
var wallet = Wallet.fromPrivateKey(privateKey);
var kovanProvider = new WalletProvider(wallet, "https://kovan.infura.io/");

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      // provider: "https://kovan.infura.io/"+INFURA_KEY,
      provider: kovanProvider,
      // provider: "https://kovan.infura.io/"+INFURA_KEY,
      gas: 4600000,
      gasPrice: web3.utils.toWei("20", "gwei"),
      port: 8545,
      network_id: 42
    }
  }
};
