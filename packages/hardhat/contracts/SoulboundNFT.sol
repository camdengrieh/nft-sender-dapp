//SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract HamburgerOnly is AccessControl {

    address public destinationWallet;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR");
    bytes32 public constant MINTERCONTRACT_ROLE = keccak256("MINTERCONTRACT");

    event TokenPurchased(uint256 indexed amountSpent, address indexed buyer);

    constructor(address _destinationWallet) payable {
        _grantRole(OPERATOR_ROLE, 0x13503B622abC0bD30A7e9687057DF6E8c42Fb928);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        destinationWallet = _destinationWallet;
    }

    function changeDestinationWallet (address _destinationWallet) external onlyRole(DEFAULT_ADMIN_ROLE) {
        destinationWallet = _destinationWallet;
    }

    function addAdmin(address _admin) public {
        grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function removeAdmin(address _admin) public {
        revokeRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function buy() external payable {
        payable(destinationWallet).transfer(msg.value);
        emit TokenPurchased(msg.value, msg.sender);
    }

}