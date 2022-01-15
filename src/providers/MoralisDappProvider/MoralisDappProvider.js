import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import MoralisDappContext from "./context";
import nftMarketplaceContractABI from "../../contracts/contractInfo.json";
import nftContractABI from "../../contracts/nftContractInfo.json";

function MoralisDappProvider({ children }) {
  const nftMarketplaceContractAddress = Object.values(nftMarketplaceContractABI.networks)[1].address;
  console.log('marketplace contract address:',nftMarketplaceContractAddress);

  const nftContractAddress = Object.values(nftContractABI.networks)[0].address;
  console.log('nft contract address:',nftContractAddress);

  const { web3, Moralis, user } = useMoralis();
  const [walletAddress, setWalletAddress] = useState();
  const [chainId, setChainId] = useState();       
  const [contractABI, setContractABI] = useState(nftMarketplaceContractABI.abi);
  const [tokenABI, setTokenABI] = useState(nftContractABI.abi);
  const [marketAddress, setMarketAddress] = useState(nftMarketplaceContractAddress);
  const [tokenAddress, setTokenAddress] = useState(nftContractAddress);

  useEffect(() => {
    Moralis.onChainChanged(function (chain) {
      setChainId(chain);
    });

    Moralis.onAccountsChanged(function (address) {
      setWalletAddress(address[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setChainId(web3.givenProvider?.chainId));
  useEffect(
    () => setWalletAddress(web3.givenProvider?.selectedAddress || user?.get("ethAddress")),
    [web3, user]
  );
  console.log('updated chainId:',chainId);
  return (
    <MoralisDappContext.Provider value={{ walletAddress, chainId, marketAddress, setMarketAddress, contractABI, setContractABI, tokenAddress, setTokenAddress, tokenABI, setTokenABI}}>
      {children}
    </MoralisDappContext.Provider>
  );
}

function useMoralisDapp() {
  const context = React.useContext(MoralisDappContext);
  if (context === undefined) {
    throw new Error("useMoralisDapp must be used within a MoralisDappProvider");
  }
  return context;
}

export { MoralisDappProvider, useMoralisDapp };
