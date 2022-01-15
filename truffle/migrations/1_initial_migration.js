const Migrations = artifacts.require("Migrations");

module.exports = function(deployer, network, accounts) {
  console.log(accounts[0]);
  deployer.deploy(Migrations,{from: accounts[0]});
};
