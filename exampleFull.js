const NodeMaker = require('./index');
const maker = require('./maker');
const utils = require('./utils/utils');
const web3 = require('./utils/web3');
const log = require('./utils/logger');
const colors = require('colors');

const BN = web3.utils.BN;

//These addresses will change based on the setting of the config
const tubAddress = maker.address['Tub'];
const pethAddress = maker.address['Peth'];
const wethAddress = maker.address['Weth'];
const mkrAddress = maker.address['Mkr'];
const daiAddress = maker.address['Dai'];

const nodeMaker = new NodeMaker({
	pkey: utils.pkey,
	address: utils.address,
	chain: 'kovan',
	end: 'frontend'
});

(async () => {
	try{
		console.log(`Current Price of Eth: ${await nodeMaker.getEthPrice()}`);
		console.log('--------------------------------');

		// const ethToCollateralize = new BN(1);

		// const wethWrapped = await nodeMaker.wrapEthToWeth(ethToCollateralize);

		// await nodeMaker.joinWethToPeth(ethToCollateralize);

		// await nodeMaker.openCDP();

		// const pethLocked = await nodeMaker.lockPeth(ethToCollateralize);

		// const dai = await nodeMaker.drawDai(10);

		// console.log(dai);


	}catch(e){
		console.log(e);
		throw new Error(e);
	}
})();