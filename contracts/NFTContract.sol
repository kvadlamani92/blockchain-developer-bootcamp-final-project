// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @title NFT token contract
/// @author kvadlamani92
/// @notice Contract class to create NFT token
/// @dev Functional calls are implemented without side effects. This contract inherits Open Zeppelin's Ownable, Upgradable and Burnable.
contract NFTContract is ERC721Upgradeable, ERC721URIStorageUpgradeable, ERC721BurnableUpgradeable, OwnableUpgradeable {

    using CountersUpgradeable for CountersUpgradeable.Counter;

    /// @dev Counter object to count number of NFT tokens created
    CountersUpgradeable.Counter private _tokenIdCounter;
    
    function initialize() initializer public {
        __ERC721_init("MyToken", "MTK");
        __ERC721URIStorage_init();
        __ERC721Burnable_init();
        __Ownable_init();
    }

    /// @notice Mint a new token
    /// @param _to address of the user minting the token
    /// @param _uri token uri of the NFT token
    function safeMint(address _to, string memory _uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    // The following functions are overrides required by Solidity.
    
    /// @dev overriden internal function to burn one's NFT
    /// @param _tokenId tokenId of the NFT to burn
    function _burn(uint256 _tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(_tokenId);
    }

    /// @dev Returns the Uniform Resource Identifier (URI) for the tokenId.
    /// @param _tokenId tokenId of the NFT to get the URI for
    /// @return the URI string
    function tokenURI(uint256 _tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(_tokenId);
    }
}
