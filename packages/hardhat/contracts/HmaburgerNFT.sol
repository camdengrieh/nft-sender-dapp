// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BaseNFT is ERC1155, Ownable {
	string public name;

	uint256 public constant PLATINUM = 8;
	uint256 public constant GOLD = 7;
	uint256 public constant SILVER = 6;
	uint256 public constant CERAMIC = 5;
	uint256 public constant PURPLE = 4;
	uint256 public constant BLUE = 3;
	uint256 public constant GREEN = 2;
	uint256 public constant RED = 1;

	address public relayer =
		address(0xB37A9D65B40d6CAfb1890f6b08c7A4931B624033);

	event Mint(address indexed account, uint256 id, uint256 amount);

	constructor(
		address initialOwner,
		string memory _name,
		string memory _uri
	) ERC1155(_uri) Ownable(initialOwner) {
		name = _name;
		_mint(initialOwner, 1, 1, "");
		emit Mint(initialOwner, 1, 1);
	}

	function setURI(string memory newuri) public onlyOwner {
		_setURI(newuri);
	}

	function setRelayer(address _relayer) public onlyOwner {
		relayer = _relayer;
	}

	function mintMultipleToAddresses(
		address[] memory addresses,
		uint256[] memory _ids
	) public onlyOwner {
		for (uint256 i; i < addresses.length; ++i) {
			_mint(addresses[i], _ids[i], 1, "");
			emit Mint(addresses[i], _ids[i], 1);
		}
	}

	function mintMultipleFromRelayer(
		address[] memory addresses,
		uint256[] memory _ids
	) public onlyOwner {
		for (uint256 i; i < addresses.length; ++i) {
			_mint(addresses[i], _ids[i], 1, "");
			emit Mint(addresses[i], _ids[i], 1);
		}
	}

	function mintFromRelayer(address account) public {
		require(msg.sender == relayer, "Only relayer can mint");
		_mint(account, 1, 1, "");
		emit Mint(account, 1, 1);
	}

	function mint(address account) public onlyOwner {
		_mint(account, 1, 1, "");
		emit Mint(account, 1, 1);
	}

	function uri(
		uint256 _tokenid
	) public pure override returns (string memory) {
		return
			string(
				abi.encodePacked(
					"https://ipfs.io/ipfs/bafybeihjjkwdrxxjnuwevlqtqmh3iegcadc32sio4wmo7bv2gbf34qs34a/",
					Strings.toString(_tokenid),
					".json"
				)
			);
	}
}
