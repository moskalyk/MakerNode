const Tub = artifacts.require("./SaiTub.sol");
const Peth = artifacts.require("./DSToken.sol");
const Weth = artifacts.require("./WETH9_.sol");
const Dai = artifacts.require("./DSToken.sol");

const TxManager = artifacts.require("./TxManager.sol");

const maker = {
	kovan:{
		Tub: '0xa71937147b55deb8a530c7229c442fd3f31b7db2',
		Weth: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
		Peth: '0xf4d791139ce033ad35db2b2201435fad668b1b64',
		Dai: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
		Mkr: '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd'
	}
}

module.exports = async function(deployer, network) {

	console.log(`Network: ${network}`);

	if(network == 'development'){
		deployer.deploy(Tub);
		deployer.deploy(Peth);
		deployer.deploy(Weth);
		deployer.deploy(Dai);

	  	deployer.deploy(TxManager, {tubAddress: Tub.address,  wethAddress: Weth.address, pethAddress: Peth.address, daiAddress: Dai.address});

	}else if(network == 'kovan'){
		
	  	deployer.deploy(TxManager, {tubAddress: maker.kovan.Tub,  wethAddress: maker.kovan.Weth, pethAddress: maker.kovan.Peth, daiAddress: maker.kovan.Dai});
	}
  	// deployer.deploy(TxManager, {tubAddress: '0xa71937147b55deb8a530c7229c442fd3f31b7db2',  wethAddress: '0xd0a1e359811322d97991e03f863a0c30c2cf029c', pethAddress: '0xf4d791139ce033ad35db2b2201435fad668b1b64'});
};
