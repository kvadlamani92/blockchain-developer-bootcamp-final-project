var fs = require("fs");

fs.copyFile("build/contracts/NFTContract.json", "src/contracts/nftContractInfo.json", (err) => {
  if (err) throw err;
  console.log("✅ Your NFT contract's ABI was copied to the frontend");
});

fs.copyFile("build/contracts/NFTMarketplace.json", "src/contracts/contractInfo.json", (err) => {
  if (err) throw err;
  console.log("✅ Your NFT Marketplace contract's ABI was copied to the frontend");
});
