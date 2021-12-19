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

	// Methods -------------------------------
	function addNewUser(
		address _userAddress,
		string memory _iconURI,
		string memory _userName,
		string memory _email,
		uint8 _role,
		uint256 _sportsCategory
	) public onlyOwner isNotNull(_userAddress) {
		addUser(_userAddress, _iconURI, _userName, _email, _role);

		if ((_role & 2) == 2) addAuthor(_userAddress);
		if ((_role & 4) == 4) addOrganizer(_userAddress);
		if ((_role & 8) == 8) addSportsman(_userAddress, _sportsCategory);
	}
}
