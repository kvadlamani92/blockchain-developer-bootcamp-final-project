# Design Pattern Decisions

### Inheritance and Interfaces

-   Inherited ERC721Upgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable and Counters contracts to maximize use of safe and audited code.

### Inter-Contract Execution
- 	Using the safeMint function in ERC721Upgradeable.sol to safely mint the NFT tokens
-   Using the safeTransferFrom function in IERC721.sol to transfer tokens from the seller to the marketplace, and from the marketplace to the buyer.
-   Using functions in Counters.sol to increment and get current value of itemId variable.

### Access Control Design Patterns

-   Inheriting OwnableUpgradeable.sol to access the owner of the marketplace and NFT contracts, and set the necessary approvals for the Marketplace when deploying the NFT contract.

### Upgradable Contracts

-   Inheriting upgradeable versions of the components wherever possible like ERC721Upgradeable, ERC721URIStorageUpgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable for flexibility in upgrading the contracts.