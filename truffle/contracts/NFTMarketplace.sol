// SPDX-License-Identifier: MIT
pragma solidity 0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

/// @title NFT Marketplace
/// @author kvadlamani92
/// @notice Allows a user to create, buy and sell NFTs
/// @dev Functional calls are implemented without side effects. This contract inherits Open Zeppelin's Ownable, Upgradable and Burnable.
contract NFTMarketplace is Initializable, OwnableUpgradeable, ReentrancyGuardUpgradeable, IERC721Receiver {
    using Counters for Counters.Counter;

    /// @dev Counts the number of items in the marketplace
    Counters.Counter private _itemIds;

    /// @dev Counts the number of sold items in the marketplace
    Counters.Counter private _itemsSold;
    
  function initialize() initializer public {
        __Ownable_init();
        __ReentrancyGuard_init();
    } 
     
    /// @dev struct to hold a new market item object
    struct MarketItem {
         uint itemId;
         address nftContract;
         uint256 tokenId;
         address payable seller;
         address payable owner;
         uint256 price;
         bool sold;
    }
     
    /// @dev Maps itemId to marketItem struct
    mapping(uint256 => MarketItem) private idToMarketItem;
     
    /// @notice Event emitted when a new market item is created
    /// @param itemId item id of the token created. Increments when a new item is added to the marketplace.
    /// @param nftContract contract address of the token listed in the marketplace
    /// @param tokenId id of the token listed in the marketplace
    /// @param seller address of the seller
    /// @param owner address of the actual owner who minted the token
    /// @param price price in wei listed in the marketplace
    /// @param sold boolean describing if the token is sold
    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );
     
    /// @notice Event emitted when a token is bought by a buyer
    /// @param itemId itemId of the token bought
    /// @param owner address of the new owner
    event MarketItemSold (
        uint indexed itemId,
        address owner
    );
     
    /// @notice Creates a new item in the marketplace
    /// @dev safeguards re-entrancy using openzeppelin's nonReentrant modifier
    /// @param _nftContract contract address of the item listed in the marketplace
    /// @param _tokenId tokenId of the item
    /// @param _price price set by the seller for the item listed in the marketplace
    function createMarketItem(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
        ) 
        public
        payable
        nonReentrant 
    {
        require(_price > 0, "Price must be greater than 0");
        _itemIds.increment();
        uint256 itemId = _itemIds.current();
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            _nftContract,
            _tokenId,
            payable(msg.sender),
            payable(address(0)),
            _price,
            false
        );
        IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);
        emit MarketItemCreated(
            itemId,
            _nftContract,
            _tokenId,
            msg.sender,
            address(0),
            _price,
            false
        );
    }

     /// @notice Makes the sale between buyer and seller and transfers the amount to the seller
     /// @dev safeguards re-entrancy using openzeppelin's nonReentrant modifier
     /// @param _nftContract contract address of the item bought by the buyer
     /// @param _itemId Id of the item bought
    function createMarketSale(
        address _nftContract,
        uint256 _itemId
        ) 
        public 
        payable
        nonReentrant 
    {
        uint price = idToMarketItem[_itemId].price;
        uint tokenId = idToMarketItem[_itemId].tokenId;
        bool sold = idToMarketItem[_itemId].sold;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(sold != true, "This Sale has alredy finished");

        idToMarketItem[_itemId].seller.transfer(msg.value);
        IERC721(_nftContract).transferFrom(address(this), msg.sender, tokenId);
        idToMarketItem[_itemId].owner = payable(msg.sender);
        _itemsSold.increment();
        idToMarketItem[_itemId].sold = true;

        emit MarketItemSold(
            _itemId,
            msg.sender
        );
    }
        
     /// @notice Fetches all the items listed on the marketplace
     /// @return the list of marketItem structs
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(0)) {
                uint currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /// @dev Always returns `IERC721Receiver.onERC721Received.selector`
    function onERC721Received(address, address, uint256, bytes memory) public virtual override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}