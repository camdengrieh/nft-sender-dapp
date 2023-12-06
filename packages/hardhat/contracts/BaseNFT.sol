// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseNFT is ERC1155, Ownable {

    string public name;

    event Mint(address indexed account, uint256 id, uint256 amount);
    constructor(address initialOwner, string memory _name, string memory _uri ) ERC1155(_uri) Ownable(initialOwner) {
        name = _name;
        _mint(initialOwner, 1, 1, "");
        emit Mint(initialOwner, 1, 1);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mintMultipleToAddresses(address[] memory addresses) public onlyOwner {
        for (uint256 i; i < addresses.length; ++i) {
            _mint(addresses[i], 1, 1, "");
            emit Mint(addresses[i], 1, 1);
        }
    }
}
