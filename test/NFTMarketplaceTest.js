const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { web3 } = require("@openzeppelin/test-helpers/src/setup");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NFT = artifacts.require("NFTContract.sol");
const Marketplace = artifacts.require("NFTMarketplace.sol");

contract("NFTMarketplace", ([deployer, seller, buyer]) => {

  let nft;
  let marketplace;
  let listPrice = web3.utils.toWei("0.1");
  let addressZero = "0x0000000000000000000000000000000000000000";
  
  beforeEach(async () => {
        nft = await deployProxy(NFT);
        marketplace = await deployProxy(Marketplace);
      });

  describe('Deployment', async => {
    it("should confirm that owner is the deployer", async () => {
      assert(deployer === await nft.owner());
      assert(deployer === await marketplace.owner());
    });
  });
  
  describe('MarketplaceInteractions', async => {
    let tokenId = 0;

    beforeEach(async () => {
      await nft.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
      await nft.approve(seller, tokenId);
      await nft.transferFrom(deployer, seller, tokenId, {from: seller});
      await nft.setApprovalForAll(marketplace.address, true, {from: seller});
    })

    it("should create item in the marketplace", async () => {
      let receipt = await marketplace.createMarketItem(nft.address,tokenId,listPrice, {from: seller}); 
      expectEvent(receipt, "MarketItemCreated", {
        itemId: web3.utils.toBN(1),
        nftContract: nft.address,
        tokenId: web3.utils.toBN(0),
        seller: seller,
        owner:addressZero,
        price: listPrice,
        sold: false
      });
    });

    it("should create a market sale from seller to buyer", async () => {
      let itemId = 1;
      await marketplace.createMarketItem(nft.address,tokenId,listPrice, {from: seller});
      let receipt = await marketplace.createMarketSale(nft.address, itemId, {from:buyer, value: listPrice});
      expectEvent(receipt, "MarketItemSold", {
        itemId: web3.utils.toBN(1),
        owner: buyer
      });
    });

    it("should fetch the correct quantity of market items", async () => {
      // The below item is listed on the marketplace and sold to the buyer.
      // It should not fetch the below sold item.
      let itemId = 1;
      await marketplace.createMarketItem(nft.address,0,listPrice, {from: seller});
      await marketplace.createMarketSale(nft.address, itemId, {from:buyer, value: listPrice});

      // Unsold marketplace items are created below.
      // It should fetch the below unsold items.
      tokenId = 1;
      await nft.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
      await nft.approve(seller, tokenId);
      await nft.transferFrom(deployer, seller, tokenId, {from: seller});
      await marketplace.createMarketItem(nft.address,tokenId,listPrice, {from: seller});

      tokenId = 2;
      await nft.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
      await nft.approve(seller, tokenId);
      await nft.transferFrom(deployer, seller, tokenId, {from: seller});
      await marketplace.createMarketItem(nft.address,tokenId,listPrice, {from: seller}); 

      let marketItems = await marketplace.fetchMarketItems();
      assert(marketItems.length === 2);
      
      assert(marketItems[0].tokenId === '1');
      assert(marketItems[1].tokenId === '2');

      assert(marketItems[0].itemId === '2');
      assert(marketItems[1].itemId === '3');

      for (let index = 0; index <= 1; index++){
        assert(marketItems[index].nftContract === nft.address);
        assert(marketItems[index].seller === seller);
        assert(marketItems[index].owner === addressZero);
        assert(marketItems[index].price === listPrice);
        assert(marketItems[index].sold === false);
      }
    });
  })
});