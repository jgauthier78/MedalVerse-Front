// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Dapp Internal Struct/UserHandler.sol";
import "./Dapp Internal Struct/AuthorHandler.sol";
import "./Dapp Internal Struct/SportsmanHandler.sol";
import "./Dapp Internal Struct/EventHandler.sol";
import "./Dapp Internal Struct/OrganizerHandler.sol";

contract MedalVerse is
	Ownable,
	UserHandler,
	AuthorHandler,
	SportsmanHandler,
	EventHandler,
	OrganizerHandler
{
	// Modifiers ----------------------------
	modifier isNotNull(address a)
		virtual
		override(
			UserHandler,
			AuthorHandler,
			SportsmanHandler,
			EventHandler,
			OrganizerHandler
		) {
		require(a != address(0));
		_;
	}

	function addNewUser(
		address _userAddress,
		string memory _iconURI,
		string memory _userName,
		string memory _email
	) public onlyOwner isNotNull(_userAddress) {
		addUser(_userAddress, _iconURI, _userName, _email, 0);
	}

	function addNewAuthor(
		address _userAddress,
		string memory _iconURI,
		string memory _userName,
		string memory _email
	) public onlyOwner isNotNull(_userAddress) {
		addUser(_userAddress, _iconURI, _userName, _email, 2);
		addAuthor(_userAddress);
	}
}
