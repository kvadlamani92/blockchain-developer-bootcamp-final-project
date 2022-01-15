# NFT Marketplace dApp
![Jaslist homepage](jaslist_homepage.png)

## Overview
NFT marketplace created with Moralis and react-js framework. It is a place where one can create NFT, list it on marketplace and buy the available NFTs.

### Live dApp Deployed on Polygon Mumbai network: [Jaslist](https://jaslist.netlify.app/)

Requirements: Metamask browser extension installed and connected to the Polygon Mumbai Test Network

### dApp Walkthrough: [Jaslist Demo](https://www.loom.com/share/58bff5149fe349f0a0458167f144755d)

### Directory Structure
- `contracts/` directory of smart contracts
- `migrations/` directory of migration files
- `public/` front end files
- `reference_docs/` markdown files required for project submission
- `src/` directory of abis and frontend react files
- `test/` directory of unit tests for smart contract

## Installing dApp Locally
### Development Environment Set Up to Run Project Locally (macOS or Linux System)
1. Download a Code Editor (Visual Studio Code, Sublime, etc)
2. Install Homebrew
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
3. Install [Node](https://nodejs.org/en/)
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
git clone https://github.com/jasminesabio/blockchain-developer-bootcamp-final-project
```

In the terminal in the root directory of the project, install the dependecies
```
npm install
```

Set up a local blockchain by opening up Ganache GUI and quickstart a blockchain or run Ganache CLI with
```
ganache-cli
```

In the terminal of the root directory of the project, run
```
truffle compile
```

Migrate the project to the local Ganache GUI blockchain by running 
```
truffle migrate
```
If running the Ganache CLI, run
```
truffle migrate --network ganachecli
```

To run the javascript tests, run
```
truffle test
```

To run the frontend locally, run
```
npm run start
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


## Next Steps
- Implement tickets listed as ERC-721 tokens
- Add functionality for sellers (update ticket price, remove ticket from tickets available to be sold)
- Integrate off-chain ticket transfer
- Fetch list of tickets owned by user
- Sort listed ticket items and add filtering functionality
- Add dynamic images for each ticket

## Public Ethereum Account
0xc90Cc5C9cae5084b7d1337C22747E1cE896CDce5


💿 Install all dependencies:
```sh
cd blockchain-developer-bootcamp-final-project
yarn install 
```
✏ Provide your `appId` and `serverUrl` from Moralis ([How to start Moralis Server](https://docs.moralis.io/moralis-server/getting-started/create-a-moralis-server)) 
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

🔃 Sync the `MarketItemCreated` event `/src/contracts/NFTMarketplace.sol` contract with your Moralis Server, making the tableName `MarketItems`
```jsx
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


🚴‍♂️ Run your App:
```
yarn start
```
Public ETH address: 0xc90Cc5C9cae5084b7d1337C22747E1cE896CDce5


