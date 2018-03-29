require('dotenv').config();

const NodeMaker = require('./index');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_URL));

const nodeMaker = new NodeMaker({
	chain: 'kovan',
	address: process.env.address,
	web3: web3
});

(async () => {
	try{
		console.log(`Current Price of Eth: ${await nodeMaker.getEthPrice()}`);
		console.log('--------------------------------');

		const ethToCollateralize = new web3.utils.BN(1);

		const wethWrapped = await nodeMaker.wrapEthToWeth(ethToCollateralize);
		console.log('--------------------------------');
		console.log('wethWrapped');
		console.log(wethWrapped);

		const joinWethToPeth = await nodeMaker.joinWethToPeth(ethToCollateralize);
		console.log('--------------------------------');
		console.log('joinWethToPeth');
		console.log(joinWethToPeth);

		const openCDP = await nodeMaker.openCDP();
		console.log('--------------------------------');
		console.log('openCDP');
		console.log(openCDP);
		
		const pethLocked = await nodeMaker.lockPeth(ethToCollateralize);
		console.log('--------------------------------');
		console.log('pethLocked');
		console.log(pethLocked);

		const dai = await nodeMaker.drawDai(10);
		console.log('--------------------------------');
		console.log('dai');
		console.log(dai);


	}catch(e){
		throw new Error(e);
	}
})();