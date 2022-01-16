# NFT Marketplace dApp

## Overview
NFT marketplace created with Moralis and react-js framework. It is a place where one can create NFT, list it on marketplace and buy the available NFTs.

### Live dApp Deployed on Polygon Mumbai network: [NFTMarketplace](https://nft-marketplace-usemoralis.netlify.app/)

Requirements: Metamask browser extension installed and connected to the Polygon Mumbai Test Network

### dApp Walkthrough: [NFTMarketplace Demo](https://www.loom.com/share/58bff5149fe349f0a0458167f144755d)

### Directory Structure
- `public/` front end files
- `src/` directory of abis and frontend react files
- `contracts/` directory of contract files
- `migrations/` directory of migration files
- `scripts/` directory of script files to copy the smart contract abi to the front end location where the react components use it
- `test/` directory of unit tests for smart contract
## Installing dApp Locally
### Development Environment Set Up to Run Project Locally (macOS or Linux System)
1. Download a Code Editor (Visual Studio Code, Sublime, etc)
2. Install Homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
3. Install [Node](https://nodejs.org/en/). Make sure the installed version is >= 17.0.1
4. Install Git
```
brew install git
```
5. Install Truffle
```
npm install -g truffle`
```
6. Download or install Ganache\
Download [Ganache GUI](https://www.trufflesuite.com/ganache)\
or install Ganache CLI:
```
npm install -g ganache-cli
```

### Running the Project Locally
In the terminal, clone the project repository
```
git clone https://github.com/kvadlamani92/blockchain-developer-bootcamp-final-project.git
```

In the terminal in the root directory of the project, install the dependecies
```
yarn install
```

Set up a local blockchain by opening up Ganache GUI and quickstart a blockchain or run Ganache CLI with
```
ganache-cli 
```

In the terminal, run
```
truffle compile --all
```

To run the tests, run
```
truffle test
```

Create a .env file and add the following environment variable for the deployment to Polygon Mumbai testnet
```
MNEMONIC=<paste_mnemonic_here>
```

Migrate the project to the Polygon Mumbai testnet and copy the ABI json files to the location where the react components can pick it up using
```
node scripts/deployContract.js
```

✏ Provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server)) in the .env file created in the above step
Example:
```
REACT_APP_MORALIS_APPLICATION_ID = xxxxxxxxxxxx
REACT_APP_MORALIS_SERVER_URL = https://xxxxxx.usemoralis.com:2053/server
```

🔎 Locate the MoralisDappProvider in `src/providers/MoralisDappProvider/MoralisDappProvider.js` and contract address and ABI are automatically populated from the `src/contracts/contractInfo.json`
```
const [contractABI, setContractABI] = useState();
const [marketAddress, setMarketAddress] = useState();
```

🔃 Sync the `MarketItemCreated` event in `contracts/NFTMarketplace.sol` contract with your Moralis Server by specifying the contract address and with the tableName `MarketItems`. Please watch this short 4min video on syncing the event with moralis server: `https://www.youtube.com/watch?v=LMqqxkuo7b0`
```
event MarketItemCreated (
  uint indexed itemId,
  address indexed nftContract,
  uint256 indexed tokenId,
  address seller,
  address owner,
  uint256 price,
  bool sold
);
```
- Update the `addrs` field in the `New Collection` present in `src/helpers/collections.js` with the new contract address after the latest contract deployment of `contracts/NFTContract.sol` for the marketplace to fetch NFTs belonging to this contract.

🚴‍♂️ To run the frontend locally, go to the project root directory and run

```
yarn start
```

Follow the instructions on this [post](https://medium.com/@kacharlabhargav21/using-ganache-with-remix-and-metamask-446fe5748ccf) to connect Ganache with Metamask. Once connected, you'll be able to interact with the front-end of the dApp.

## Project Requirements
- [x] Following this naming format: https://github.com/YOUR_GITHUB_USERNAME_HERE/blockchain-developer-bootcamp-final-project \
- [x] Contain a README.md file which describes the project, describes the directory structure, and where the frontend project can be accessed\
- [x] Include public Ethereum account to receive certification as a NFT\
- [x] Smart contract is commented to the NatSpec format\
- [x] Uses two design patterns (inherits and restricts access)\
- [x] Protects against two attack vectors (no-reentrancy (SWC-107) and proper use of require (SWC-123))\
- [x] Inherits from one library (Open Zeppelin)\
- [x] Can be easily compiled and tested locally\
- [x] Contains markdown files named design_pattern_decisions.md and avoiding_common_attacks.md\
- [x] Have at least five unit tests for the smart contract\
- [x] Contain a deployed_address.txt file\
- [x] Have a front end interface that detects metamask, connect to the current account, displays infomration from the smart contract, allows a user to submit a transaction and update smart contract state, and updated frontend if transaction is successful or not\
- [x] Hosted on Netlify\
- [x] Clear instructions in README.md file to install dependencies, access and run project, and running smart contract unit tests\
- [x] Screencast of project walkthrough

## Public Ethereum Address 
0xc90Cc5C9cae5084b7d1337C22747E1cE896CDce5