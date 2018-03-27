const web3 = require('./web3');
const Tx = require('ethereumjs-tx');

const BN = web3.utils.BN;
const gasBuffer = 1e5;
const chainId = 42;
const gasPrice = 16e9 ; // In Gwei

//TODO: Create env variables
const address = '';
const pkey = '';

const getBalance = async (address) => {
	const wei = await web3.eth.getBalance(address);
    return web3.utils.fromWei(wei, 'ether');
}

const testConnection = async (address, pkey) => {
	const account = await web3.eth.accounts.privateKeyToAccount(address, pkey);
    return account;
}

const tx = async(txData, pkey) => {
	const bufferedPrivateKey = new Buffer(pkey, 'hex');
	const transaction = new Tx(txData);
	transaction.sign(bufferedPrivateKey);
	const serializedTx = transaction.serialize().toString('hex');
	return await web3.eth.sendSignedTransaction('0x' + serializedTx);
}

const getGasPrice = async () => {
	return await web3.eth.getGasPrice();
	// return gasPrice;
}

const sendTx = async (address, to, pkey, gas, encodeABI) => {
	try{
	const txCount = await web3.eth.getTransactionCount(address);

	const txData = {
		nonce: txCount,
	    from: address,
	    gasLimit: web3.utils.toHex(gas),
		gasPrice: web3.utils.toHex(await getGasPrice()),
	    data: encodeABI,
	    chainId: chainId,
	    value: '0x',
	    to: to
	};

	console.log(txData);

		return await tx(txData, pkey);
	}catch(e){
		console.log('Error sending transaction.')
		console.log(e)
	}
}

const sendTxWithValue = async (address, to, pkey, value, gas, encodeABI) => {
	try{
	const txCount = await web3.eth.getTransactionCount(address);

	const txData = {
		nonce: txCount,
	    from: address,
	    gasLimit: web3.utils.toHex(gas),
		gasPrice: web3.utils.toHex(await getGasPrice()),
	    data: encodeABI,
	    chainId: chainId,
	    value: web3.utils.toHex(value),
	    to: to
	};

	console.log(txData);

		return await tx(txData, pkey);
	}catch(e){
		console.log('Error sending transaction.')
		console.log(e)
	}
}

module.exports = {
	testConnection,
	getBalance,
	tx,
	sendTx,
	sendTxWithValue,
	gasBuffer,
	chainId,
	address,
	pkey,
	getGasPrice
}
