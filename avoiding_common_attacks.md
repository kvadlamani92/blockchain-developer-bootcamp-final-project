# Avoiding Common Attacks

### Guarding Against Solidity Risks

-   (SWC-103) Using concrete pragma version 0.8.3 to ensure the solidity version and compiler version are in sync.

-   Use of Require to ensure:

    -   List price of an item is greater than zero
    -   Amount of Ether sent when purchasing an item is equal to the item's list price
    -   Checks the value of `sold` boolean variable to ensure that the item is for sale before allowing it to be purchased

-   (SWC-134) Using `.call{value: msg.value}("")` instead of `.transfer` to send Ether in the `createMarketSale` function
-   Implemented Checks-Effects-Interactions so that external calls or transfers of Ether happen at the end of each function and after any necessary state changes have been made, to prevent reentrancy attacks.

### Guarding Against Smart Contract Risks

-   (SWC-107) Reentrancy Guard: nonReentrant modifier used in the `createMarketItem` and `createMarketSale` functions to prevent multiple calls from external caller draining the smart contract when exposed to ether transfer methods
