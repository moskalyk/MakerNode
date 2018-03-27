const colors = require('colors');
const log = require('./utils/logger');
const web3 = require('./utils/web3');
const utils = require('./utils/utils');
const maker = require('./maker');

const { Tub, Weth, Peth, Dai, Mkr } = maker.connectToContracts();
// const makerAddresses = maker.maker;
// const makerAddresses = maker.makerAddresses;
const BN = web3.utils.BN;

// async function approveAll(TubContract, allowance){
// 	await WethContract.approve(TubContract, allowance);
// 	await PethContract.approve(TubContract, allowance);
// 	await DaiContract.approve(TubContract, allowance);
// 	await MKRContract.approve(TubContract, allowance);
// }

// async function sendWeth(address, pkey, value) {
// 	const to = maker.address.Weth;

// }

//TODO: Refactor to Estimate Gas and include the method
function addGasBuffer(gas) {
	return gas += utils.gasBuffer;
}

function padIndexToHex(i) {
	return web3.utils.padLeft(web3.utils.toHex(i),64)
}


class NodeMaker {

	constructor(config){
		this._address = config.address;
		this._pkey = config.pkey;
		this._chain = config.chain;
		this.PRICE_DECIMALS = 10e26;
	}

	getConfig() {
		return { address: this._address, pkey: this._pkey, chain: this._chain }
	}

	async getEthPrice() {
		const gemPrice = await Tub.methods.tag().call();
		log.info(JSON.stringify(gemPrice) / this.PRICE_DECIMALS);
		return gemPrice / this.PRICE_DECIMALS;
	}

	async wrapEthToWeth(value) {

		const bnValue = web3.utils.toWei(new BN(value), 'ether');

		log.info(colors.grey(`Wrapping ${bnValue} Eth to Weth`));		

		//TODO: Kovan address
		const to = maker.address.Weth;

		const encodeWethDepositABI = await Weth.methods.deposit().encodeABI();
		const estimatedGas = await Weth.methods.deposit().estimateGas();
		const gas = addGasBuffer(estimatedGas);

		log.info(colors.grey(`Estimated Gas Limit: ${gas}`));


		return await utils.sendTxWithValue(this._address, to, this._pkey, bnValue, gas, encodeWethDepositABI);
	}

	async openCDP() {

		//TODO: Kovan address
		const to = maker.address.Tub;

		const encodeABI = await Tub.methods.open().encodeABI();

		const estimatedGas = await Tub.methods.open().estimateGas({from: this._address});
		const gas = addGasBuffer(estimatedGas);

		const tx = await utils.sendTx(
			this._address, 
			to, 
			this._pkey, 
			gas, 
			encodeABI
			);

		return true;
	}

	async getCDPByIndex(index) {
		return await Tub.methods.cups(padIndexToHex(index)).call();
	}

	// Returns CDP Object
	async getCDP() {
		const cdpIndex = new BN(await Tub.methods.cupi().call());
		const cdpList = [];

		for (var i = 0; i < cdpIndex; i++) 
			cdpList.push(await this.getCDPByIndex(i));
		
		for (var i = 0; i < cdpList.length; i++) {
			if (cdpList[i].lad.toLowerCase() === this._address.toLowerCase()){
				const cup = cdpList[i];
				cup.index = i;
				log.info(`Found the Cup ${cup} with the owner ${cup.lad.toLowerCase()}`);
	            return cup;
	        }
		}
		return {};
	}

	// Send a transaction to grant allowance from a contract that has access to funds, 
	// for another onctract to act upon its behalf

	async approveAllowance(allowerAddress, spenderAddress, allowance) {

		log.info(`Approving allowance ${allowance}`);

		const allower = maker.contract[allowerAddress];
		const spender = maker.contract[spenderAddress];

		const estimatedGas = await allower.methods.approve(spenderAddress, allowance).estimateGas();
		const gas = addGasBuffer(estimatedGas);

		log.info(colors.grey(`Estimated Gas Limit: ${gas}`));

		const encodeABI = await allower.methods.approve(spenderAddress, allowance).encodeABI();

		const res = await utils.sendTx(
			this._address, 
			allowerAddress, 
			this._pkey, 
			gas, 
			encodeABI
			);

		log.info('The address: ' + this._address + ' is granting the allowance via the contract ' + allowerAddress + ' for the spender ' + spenderAddress + ' to act upon the behalf of their funds.')
		
		return true;
	}

	async approveAll(allowance){
		const resWethAllowance = await this.approveAllowance(maker.address.Weth, maker.address.Tub, allowance);
		log.info(resWethAllowance);

		const resPethAllowance = await this.approveAllowance(maker.address.Peth, maker.address.Tub, allowance);
		log.info(resPethAllowance);

		const resDaiAllowance = await this.approveAllowance(maker.address.Dai, maker.address.Tub, allowance);
		log.info(resDaiAllowance);

		const resMkrAllowance = await this.approveAllowance(maker.address.Mkr, maker.address.Tub, allowance);
		log.info(resMkrAllowance);

		return true;
	}

	/*
	* Allower is the rightful owner of the funds
	* Spender is the one spending the funds
	* Proxy is the one that acts on behalf of the Allower
	*/
	async getAllowance(allower, spender, proxy){
		const proxyContract = maker.contract[proxy];
		return await proxyContract.methods.allowance(allower, spender).call();
	}

	async getBalance(erc20, address){
		erc20 = erc20.toUpperCase();
		switch(erc20){
			case "PETH":
				return await Peth.methods.balanceOf(address).call();
				break; 
			case "DAI":
				return await Dai.methods.balanceOf(address).call();
				break; 
			case "ETH":
				return await web3.eth.getBalance(address);
				break; 
			case "WETH":
				return await Weth.methods.balanceOf(address).call();
				break; 
			case "MKR":
				return await Mkr.methods.balanceOf(address).call();
				break; 
			default:
				throw new Error('Coin out of scope.');
				return;
		}
	}

	async cupIsSafe(){
		const cdp = await this.getCDP();
		const cupi = padIndexToHex(cdp.index);
		return await Tub.methods.safe(cupi).call();
	}

	// TODO: Return the Price of WETH per PETH
	async joinWethToPeth(weth, allowance) {

		if(web3.utils.isBN(weth) != true) {
			log.info({module: 'Allowance'}, `Not a Big number`);
			return false;
		}

		//Approval of the weth contract, to act upon behalf of the address

		// Grant approval to for the Tub.sol contract to use Weth
		if(typeof allowance == 'undefined'){
			console.log('weth');
			console.log(weth);
			log.info({module: 'Allowance'}, `No allowance set, therefore setting allowance to ${weth.toString()}.`)
			allowance = weth;
		}else{
			allowance = web3.utils.toWei(new BN(allowance));
			log.info({module: 'Allowance'}, `Allowance set, to ${allowance}.`)

		}

		// Check for the Allowance
		const existingAllowance = await this.getAllowance(utils.address, maker.address.Tub, maker.address.Weth);
		console.log("Existing Allowance:", existingAllowance);

		if(existingAllowance == 0 || existingAllowance < weth){
			log.info({module: 'Conversion'}, `Approving allowance to ${weth} WETH`);

			console.log('allowance');
			console.log(allowance);
			console.log(allowance.toString());

			// Approve Allowance
			const resAllowance = await this.approveAllowance(maker.address.Weth, maker.address.Tub, new BN(allowance));
			console.log(resAllowance);

			const existingAllowance = await this.getAllowance(utils.address, maker.address.Tub, maker.address.Weth);
			console.log("New Allowance:", existingAllowance);

		}else{

			log.info({module: 'Allowance'}, `Existing allowance is ${existingAllowance}`);
			console.log("Allowance of " + existingAllowance + " already allocated.")
		}

		log.info({module: 'Conversion'}, `Joining ${weth} WETH to PETH`);

		// Join WethToPeth

		// Get Gas
		let estimatedGas;

		try{
			estimatedGas = await Tub.methods.join(weth).estimateGas({from: utils.address});
		}catch(e){
			log.info({module: 'Getting Gas Failed'}, e);
			return false;
		}

		const gas = addGasBuffer(estimatedGas);
		console.log(colors.grey('Gas for Peth Join:'), gas);

		// Send Transaction
		const encodeABI = await Tub.methods.join(weth).encodeABI();

		const res = await utils.sendTx(
			utils.address, 
			maker.address.Tub, 
			utils.pkey, 
			gas, 
			encodeABI
			);

		log.info(JSON.stringify(res));
		return true;
	}

	async lockPeth(peth) {

		// Perform check so that it's greater than 0.005 ether
		// if(peth <  web3.utils.toWei(new BN(0.005)){
		// 	log.info(`Must lock funds > .005`);
		// 	return false;
		// }

		let cdp;

		//Get My CDP
		try{
			cdp = await this.getCDP();
		}catch(e){
			log.info(`Could not find CDP`);
			return false;
		}

		log.info({module: 'CDP'}, `Locking ${peth.toString()} worth of peth in the CDP with index ${cdp.index.toString()}`);

		// Get Cup index
		const cupi = padIndexToHex(cdp.index);
		
		// Estimate Gas
		const estimatedGas = await Tub.methods.lock(cupi, peth).estimateGas({from: utils.address});
		const gas = addGasBuffer(estimatedGas);
		log.info(colors.grey(`Estimated Gas Limit: ${gas}`));

		// Send to Tub Address
		const to = maker.address.Tub;
		
		// Encode ABI
		const encodeABI = await Tub.methods.lock(cupi, peth).encodeABI();

		// Lock Peth
		const lockedPeth = await utils.sendTx(
			this._address, 
			to, 
			this._pkey, 
			gas, 
			encodeABI
			);

		log.info(JSON.stringify(lockedPeth));

		return true;
	}

	async drawDai(dai){
		let cdp;
		dai = web3.utils.toWei(new BN(dai));

		//Get My CDP
		try{
			cdp = await this.getCDP();
		}catch(e){
			log.info(`Could not find CDP`);
			return false;
		}

		log.info({module: 'CDP'}, `Drawing ${dai.toString()} worth of Dai from the CDP ${cdp.index.toString()}`);

		// Get Cup index
		const cupi = padIndexToHex(cdp.index);
		log.info(`Drawing from the cup ${cupi}`);
		
		// Estimate Gas
		const estimatedGas = await Tub.methods.draw(cupi, dai).estimateGas({from: utils.address});
		const gas = addGasBuffer(estimatedGas);
		log.info(colors.grey(`Estimated Gas Limit: ${gas}`));

		// Send to Tub Address
		const to = maker.address.Tub;
		
		// Encode ABI
		const encodeABI = await Tub.methods.draw(cupi, dai).encodeABI();

		// Draw Dai
		const daTx = await utils.sendTx(
			this._address, 
			to, 
			this._pkey, 
			gas, 
			encodeABI
			);

		log.info(JSON.stringify(daTx));

		return true;
	}

	async getDesiredDai(targetCollateralRatio){

		log.info(`Looking to achieve ${targetCollateralRatio*100}%.`);

		// const price = await getEthPrice();
		const tag = await Tub.methods.tag().call();
		console.log(tag / this.PRICE_DECIMALS);
		const per = await Tub.methods.per().call();
		console.log(per / this.PRICE_DECIMALS);

		// const ask = await Tub.methods.ask().call();
		// console.log(ask);
		const pie = await Tub.methods.pie().call();
		console.log(pie / this.PRICE_DECIMALS);

		// const cup = await getCDPByIndex(cupIndex);

		// console.log(cup);

		// const dai = 0;


		// if(ratio > .5) return 

	}

	async collateralize(ethtoCollaterize, daiToDraw) {
		// const ethToCollateralize = new BN(ethtoCollaterize);

		// const wethWrapped = await this.wrapEthToWeth(ethToCollateralize);

		// await this.joinWethToPeth(ethToCollateralize);

		// TODO: check
		// await this.openCDP();

		const pethLocked = await this.lockPeth(ethToCollateralize);

		const dai = await this.drawDai(daiToDraw);
		return true;
	}
}


	// async function transferWeth(value) {

	// 	const bnValue = new BN(value);
	// 	log.info(colors.grey(`Transfering ${bnValue} Weth`));		

	// 	//TODO: Kovan address
	// 	const to = maker.address.Weth;

	// 	const encodeTransferABI = await Weth.methods.transfer(this._address, bnValue).encodeABI();
	// 	const estimatedGas = await Weth.methods.transfer(this._address, bnValue).estimateGas();
	// 	const gas = addGasBuffer(estimatedGas);
	// 	log.info(colors.grey(`Gas Limit: ${gas}`));		

	// 	return await utils.sendTx(this._address, to, this._pkey, gas, encodeTransferABI);
	// }

	// async function transferPeth(address, pkey, value) {
	// 	//TODO: Kovan address
	// 	const to = maker.address.Peth;
	// 	const bnValue = new BN(value);

	// 	const encodeTransferABI = await Peth.methods.transfer(address, bnValue).encodeABI();
	// 	const estimatedGas = await Peth.methods.transfer(address, bnValue).estimateGas({from: utils.address});
	// 	const gas = addGasBuffer(estimatedGas);

	// 	console.log(gas);

	// 	return await utils.sendTx(address, to, pkey, gas, encodeTransferABI);

	// }



// Untested


async function getPethBalance(address){
	return await Peth.methods.balanceOf(address).call();
}

async function getWethBalance(address){
	return await Weth.methods.balanceOf(address).call();
}

async function getDaiBalance(address){
	return await Dai.methods.balanceOf(address).call();
}

async function getMkrBalance(address){
	return await Mkr.methods.balanceOf(address).call();
}

//TODO
async function getDesiredDai(targetCollateralRatio){

	log.info(`Looking to achieve ${targetCollateralRatio*100}%.`);

	// const price = await getEthPrice();
	const tag = await Tub.methods.tag().call();
	console.log(tag / this.PRICE_DECIMALS);
	const per = await Tub.methods.per().call();
	console.log(per / this.PRICE_DECIMALS);

	// const ask = await Tub.methods.ask().call();
	// console.log(ask);
	const pie = await Tub.methods.pie().call();
	console.log(pie / this.PRICE_DECIMALS);

	// const cup = await getCDPByIndex(cupIndex);

	// console.log(cup);

	// const dai = 0;


	// if(ratio > .5) return 

}




async function askPrice(weth){
	const ask = await Tub.methods.ask(weth).call();
}

module.exports = NodeMaker;