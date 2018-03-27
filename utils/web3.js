const Web3 = require('web3');
const log = require('./logger');

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));
log.info(`Running using the RPC URL: ${process.env.RPC_URL}`);

module.exports = web3;