//SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import "./BaseNFT.sol";
contract NFTFactory {

    uint256 public NFTCount;
    //map addresses for the deployers of the contracts created by this factory
    mapping(address => address[]) public deployedNFTs;


    constructor() payable {

    }

    function getDeployedNFTs(address _deployer) public view returns (address[] memory) {
        return deployedNFTs[_deployer];
    }

    function createNFT(string calldata  _name, string calldata uri) external returns (address) {

        //Use Create function to create a new ERC721 contract with the given parameters passed in...

        BaseNFT newNFT = new BaseNFT(msg.sender, _name, uri);
        ++NFTCount;
        deployedNFTs[msg.sender].push(address(newNFT));

        return address(newNFT);

    }

}

