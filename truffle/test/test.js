const TxManager = artifacts.require("./TxManager.sol");
const Weth = artifacts.require("./WETH9_.sol");
const Tub = artifacts.require("SaiTub.sol");
const Peth = artifacts.require("DSToken.sol");
const Dai = artifacts.require("Dai.sol");

let owner;
let wethContract;

	// Tub: '0xa71937147b55deb8a530c7229c442fd3f31b7db2',
	// Weth: '0xd0a1e359811322d97991e03f863a0c30c2cf029c',
	// Peth: '0xf4d791139ce033ad35db2b2201435fad668b1b64',
	// Dai: '0xc4375b7de8af5a38a93548eb8453a498222c4ff2',
	// Mkr: '0xaaf64bfcc32d0f15873a02163e7e500671a4ffcd'

contract('Test', (accounts) => {

	before(async () => {
		owner = accounts[0];
		// wethContract = await Weth.deployed();
		// console.log(wethContract);
	});

	it("should test the length of the deployed contract", async () => {
		// const tubAddress = "0x4ff3956272e9be7062571138f93d5c668f998ce8";
		// const wethAddress = "0xa1bf75c06faf15382d3246a54be065cf6546f485";
		// const pethAddress = "0x16f581f485d96b497d72382af5b32a2633e19366";

		// contractInstance = await TxManager.new(Tub.address, Weth.address, Peth.address, Dai.address, {from: owner});
		// console.log(await contractInstance.openCdp(1, 20, Tub.address));
		// assert.equal(contractInstance.address.length == 42, true);
	});

	it('should have a balance', async () => {
		const wethInstance = await Weth.deployed();
		console.log(wethInstance);
		// return Weth.deployed().then(function(instance){
  //    	token = instance;
  //    	return token.balanceOf.call({from: owner});
  //   }).then(function(result){
  //    assert.equal(result.toNumber(), 1000000, 'total supply is wrong');
  //   })

	});

	// it('should have an allowance', async () => {
		// console.log(`Tub Address ${Tub.address}`);
		// wethContract.allowance(owner, Tub.address)

	// });
});

