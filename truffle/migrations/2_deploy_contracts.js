const NFTContract = artifacts.require("NFTContract");
const NFTMarketplace = artifacts.require("NFTMarketplace");

module.exports = function(deployer, network,accounts) {
  console.log('Deploying from: ',accounts[0]);
  deployer.deploy(NFTContract, {from: accounts[0]});
  deployer.deploy(NFTMarketplace, {from: accounts[0]});
};