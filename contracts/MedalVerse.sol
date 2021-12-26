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
	modifier isNotNullUint256(uint256 a)
		virtual
		override(
			OrganizerHandler,
			SportsmanHandler,
			EventHandler,
			AuthorHandler
		) {
		require(a != 0);
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

	function LinkUserAndEvent(address _userAddress, uint256 eventid)
		public
		isNotNull(_userAddress)
	{
		EventRegisterSportsman(eventid, _userAddress); // checks both values
		registerSportsmanToEvent(_userAddress, eventid); // no check required, already don above
	}

	function newEvent(
		uint256 organizationId,
		uint8 startDate,
		uint8 endDate,
		uint256 sportsCategory
	) public {
		// We first neet to check that the sender corresponds to an organizer
		uint256 organizerId = organizerByAddress[msg.sender];
		require(organizerId > 0, "you must be an organizer");

		require(
			checkorganizerisAdminOf(organizerId, organizationId),
			"you must be admin"
		);
		uint256 eventID = addEvent(
			organizationId,
			startDate,
			endDate,
			sportsCategory
		);
		organizerAddEvent(organizerId, organizationId, eventID);
	}
}
