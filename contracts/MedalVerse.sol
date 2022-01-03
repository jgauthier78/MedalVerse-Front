// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Dapp Internal Struct/UserHandler.sol";
import "./Dapp Internal Struct/AuthorHandler.sol";
import "./Dapp Internal Struct/SportsmanHandler.sol";
import "./Dapp Internal Struct/EventHandler.sol";
import "./Dapp Internal Struct/OrganizerHandler.sol";
import "./Dapp Internal Struct/MedalHandler.sol";

contract MedalVerse is
	Ownable,
	UserHandler,
	AuthorHandler,
	SportsmanHandler,
	EventHandler,
	OrganizerHandler,
	MedalHandler
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
		require(a != address(0), "should not be null");
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
		require(a != 0, "value must not be null");
		_;
	}

	modifier isAdminOfEvent(uint256 eventID) {
		uint256 organizationId = getEventOrganizer(eventID);

		require(checkorganizerisAdminOf(organizationId), "you must be admin");
		_;
	}

	// Methods -------------------------------

	///@dev Add a new user to the DB, using parent classes
	///@param _userAddress userAddr
	///@param _iconURI Image for the UI
	///@param _userName FName + LName
	///@param _email email address
	///@param _role Author / Organizer / sportsman
	///@param _sportsCategory id of the event
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

	///@dev register a user to an event and event to user
	///@param _userAddress address of the user
	///@param eventid id of the event
	function LinkUserAndEvent(address _userAddress, uint256 eventid)
		public
		isNotNull(_userAddress)
	{
		EventRegisterSportsman(eventid, _userAddress); // checks both values
		registerSportsmanToEvent(_userAddress, eventid); // no check required, already don above
	}

	///@dev creates a new event, associated to an organization
	///@param organizationId Id Of the Organization
	///@param startDate starting Date
	///@param endDate ending Date
	///@param sportsCategory Category of sport for the event
	///@param eventDesc Description for the event
	function newEvent(
		uint256 organizationId,
		uint256 startDate,
		uint256 endDate,
		uint256 sportsCategory,
		string memory eventDesc
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
			sportsCategory,
			eventDesc
		);
		organizerAddEvent(organizerId, organizationId, eventID + 1);
	}

	///@dev The event starts now, checks we are an admin for the event
	///@param eventID id of the event
	function adminStartEvent(uint256 eventID) external isAdminOfEvent(eventID) {
		startEvent(eventID);
	}

	///@dev The event ends now,checks we are an admin for the event
	///@param eventID id of the event
	function adminEndEvent(uint256 eventID) external isAdminOfEvent(eventID) {
		endEvent(eventID);
	}

	///@dev The event gets a winner and closes,checks we are an admin for the event
	///@param eventID id of the event
	function adminSetWinner(uint256 eventID, address winner)
		external
		isAdminOfEvent(eventID)
		isNotNull(winner)
	{
		setEventWinner(eventID, winner);
		endEvent(eventID);
	}

	///@dev The event gets a winner and closes,checks we are an admin for the event
	///@param eventID id of the event
	///@param _nft address of medal nft associated to the prize
	function adminAddMedal(uint256 eventID, address _nft)
		external
		isAdminOfEvent(eventID)
	{
		address winner = getWinner(eventID);
		require(winner != address(0), "Set a Winner First");
		uint256 orgId = getEventOrganizer(eventID);
		addMedal(_nft, orgId, eventID);
		uint256 medalID = getMedalCount() - 1;
		// If the winner is already set, then we need to affect it to the medal
		setMedalWinner(medalID, winner);
		// registers medal to the event and sportsman structure
		eventSetMedal(eventID, medalID);
		sportsmanAddMedal(winner, medalID);
	}

	///@dev add / remove the medal from user gallery. Nota: checks are done in getSportsmanMedal
	///@param medalIndx id of the event
	function publishMedal(uint256 medalIndx, bool status) public {
		uint256 mdID = getSportsmanMedal(msg.sender, medalIndx); // converts sportsMan->medalIndx => medalID
		medalPublish(mdID, status);
	}
}
