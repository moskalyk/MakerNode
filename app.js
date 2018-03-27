require('dotenv').config();

const NodeMaker = require('./index');
const maker = require('./maker');
const web3 = require('./utils/web3');

const nodeMaker = new NodeMaker({
	pkey: process.env.pkey,
	address: process.env.address,
	chain: 'kovan'
});

(async () => {
	try{
		const ethToCollateralize = new web3.utils.BN(0.5);
		const dai = await nodeMaker.collateralize(ethToCollateralize, 10);
	}catch(e){
		throw new Error(e);
	}
})();