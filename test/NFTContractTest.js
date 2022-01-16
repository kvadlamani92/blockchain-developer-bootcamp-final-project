const { expectRevert, expectEvent } = require("@openzeppelin/test-helpers");
const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const { web3 } = require("@openzeppelin/test-helpers/src/setup");

const Token = artifacts.require("NFTContract.sol");
const NOT_OWNER_OR_APPROVED_MESSAGE = "ERC721: transfer caller is not owner nor approved -- Reason given: ERC721: transfer caller is not owner nor approved.";

contract("NFTContract", ([deployer, seller, buyer]) => {

  let token;

  beforeEach(async () => {
    token = await deployProxy(Token);
  });

  it("should confirm that owner is the deployer", async () => {
    expect(await token.owner()).to.equal(deployer);
  });

  it("should mint if admin", async () => {
    const balanceBefore = await token.balanceOf(deployer);
    const receipt = await token.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
    const balanceAfter = await token.balanceOf(deployer);
    console.log(balanceAfter);
    const owner = await token.ownerOf(0);
    assert(balanceAfter.sub(balanceBefore).toNumber() === 1);
    assert(owner === deployer);
    expectEvent(receipt, "Transfer", {
      from: "0x0000000000000000000000000000000000000000",
      to: deployer,
      tokenId: web3.utils.toBN(0),
    });
  });

  it("should mint if token seller", async () => {
    const balanceBefore = await token.balanceOf(seller);
    const receipt = await token.safeMint(seller, "ipfs://uniqueCID", {
      from: seller,
    });
    const balanceAfter = await token.balanceOf(seller);
    console.log(balanceAfter);
    const owner = await token.ownerOf(0);
    assert(balanceAfter.sub(balanceBefore).toNumber() === 1);
    console.log(owner);
    assert(owner === seller);
    expectEvent(receipt, "Transfer", {
      from: "0x0000000000000000000000000000000000000000",
      to: seller,
      tokenId: web3.utils.toBN(0),
    });
  });

 // Deployer is the owner of tokenId 0. So the transaction should revert.
  it("should NOT transfer if not token owner", async () => {  
    await token.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
    await expectRevert(
      token.transferFrom(seller, buyer, 0, { from: seller }), 
      NOT_OWNER_OR_APPROVED_MESSAGE
    );
    await expectRevert(
      token.safeTransferFrom(seller, buyer, 0, { from: seller }),
      NOT_OWNER_OR_APPROVED_MESSAGE
    );
  });

  // Seller is the owner of tokenId 0. So the transaction should succeed.
  it("should transfer if token owner", async () => {  
    await token.safeMint(seller, "ipfs://uniqueCID", {from: seller});
    const receipt = await token.transferFrom(seller, buyer, 0, {from: seller}); 
    expectEvent(receipt, "Transfer", {
      from: seller,
      to: buyer,
      tokenId: web3.utils.toBN(0),
    });
  });

  // Deployer has not approved seller for the token transfer. So transaction should revert.
  it("should NOT transfer token when NOT approved", async () => {  
    await token.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
    await expectRevert(
      token.transferFrom(deployer, seller, 0, {from: seller}),
      NOT_OWNER_OR_APPROVED_MESSAGE
    );
  });

// Deployer has approved seller for the token transfer. So transaction should succeed.
  it("should transfer token when approved", async () => {
    await token.safeMint(deployer, "ipfs://uniqueCID", {from: deployer});
    const tokenId = 0;
    const receipt1 = await token.approve(seller, tokenId);
    const receipt2 = await token.transferFrom(deployer, seller, tokenId, {from: seller});
    const [balanceDeployer, balanceSeller, owner] = await Promise.all([
      token.balanceOf(deployer),
      token.balanceOf(seller),
      token.ownerOf(tokenId),
    ]);
    assert(balanceDeployer.toNumber() === 0);
    assert(balanceSeller.toNumber() === 1);
    assert(owner === seller);
    expectEvent(receipt2, "Transfer", {
      from: deployer,
      to: seller,
      tokenId: web3.utils.toBN(tokenId),
    });
    expectEvent(receipt1, "Approval", {
      owner: deployer,
      approved: seller,
      tokenId: web3.utils.toBN(tokenId),
    });
  });
});