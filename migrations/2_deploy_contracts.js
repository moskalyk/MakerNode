const Tub = artifacts.require("./SaiTub.sol");

module.exports = function(deployer) {
  deployer.deploy(Tub);
};
