const web3 = require('./utils/web3');

// ABIs
const tubAbi = require('./build/contracts/SaiTub.json');
const wethAbi = require('./build/contracts/WETH9_.json');
const pethAbi = require('./build/contracts/DSToken.json');
const daiAbi = require('./build/contracts/Dai.json');
const mkrAbi = require('./build/contracts/Mkr.json');


//TODO: Reference address from the network

module.exports.connectToContracts = function connectToContracts() {

	const Tub = new web3.eth.Contract(tubAbi.abi, '0xa71937147b55deb8a530c7229c442fd3f31b7db2');
	const Weth = new web3.eth.Contract(wethAbi.abi, '0xd0a1e359811322d97991e03f863a0c30c2cf029c');
	const Peth = new web3.eth.Contract(pethAbi.abi, '0xf4d791139ce033ad35db2b2201435fad668b1b64');
	const Dai = new web3.eth.Contract(pethAbi.abi, '0xc4375b7de8af5a38a93548eb8453a498222c4ff2');
	const Mkr = new web3.eth.Contract(pethAbi.abi, '0xc4375b7de8af5a38a93548eb8453a498222c4ff2');

	return { Tub , Weth , Peth , Dai , Mkr }

}

module.exports.address = {
	Tub: '0xa71937147b55deb8a530c7229c442fd3f31b7db2',
	Weth: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
	Peth: '0xf4d791139ce033ad35db2b2201435fad668b1b64',
	Dai: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
	Mkr: '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd'

}

module.exports.contract = {
	'0xa71937147b55deb8a530c7229c442fd3f31b7db2': new web3.eth.Contract(tubAbi.abi, '0xa71937147b55deb8a530c7229c442fd3f31b7db2'),
	'0xd0a1e359811322d97991e03f863a0c30c2cf029c': new web3.eth.Contract(wethAbi.abi, '0xd0a1e359811322d97991e03f863a0c30c2cf029c'),
	'0xf4d791139ce033ad35db2b2201435fad668b1b64': new web3.eth.Contract(pethAbi.abi, '0xf4d791139ce033ad35db2b2201435fad668b1b64'),
	'0xc4375b7de8af5a38a93548eb8453a498222c4ff2': new web3.eth.Contract(daiAbi.abi, '0xc4375b7de8af5a38a93548eb8453a498222c4ff2'),
	'0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd': new web3.eth.Contract(mkrAbi.abi, '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd')
}
