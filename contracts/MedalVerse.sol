// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Dapp Internal Struct/UserHandler.sol";
import "./Dapp Internal Struct/AuthorHandler.sol";
import "./Dapp Internal Struct/SportsmanHandler.sol";
import "./Dapp Internal Struct/EventHandler.sol";
import "./Dapp Internal Struct/OrganizerHandler.sol";
import "./Dapp Internal Struct/MedalHandler.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MedalVerse is
	Ownable,
	UserHandler,
	AuthorHandler,
	SportsmanHandler,
	EventHandler,
	OrganizerHandler,
	MedalHandler
{
	IERC20 private Token;

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
		require(a != address(0), "ERR_K");
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
		require(a != 0, "ERR_K");
		_;
	}

	modifier isAdminOfEvent(uint256 eventID) {
		uint256 organizationId = getEventOrganizer(eventID);

		require(checkorganizerisAdminOf(organizationId), "ERR_J");
		_;
	}

	// Event -------------------------------

	event MedalVerseWithdraw(address owner);

	// Methods -------------------------------

	constructor(address addressToken) {
		Token = IERC20(addressToken);
	}

	///@dev Add a new user to the DB, using parent classes
	///@param _userAddress userAddr
	///@param _iconURI Image for the UI
	///@param _userName FName + LName
	///@param _email email address
	///@param _role Author / Organizer / sportsman
	function addNewUser(
		address _userAddress,
		string memory _iconURI,
		string memory _userName,
		string memory _email,
		uint256 _role
	) external onlyOwner isNotNull(_userAddress) {
		addUser(_userAddress, _iconURI, _userName, _email, _role);
		if ((_role & 2) == 2) addAuthor(_userAddress);
		if ((_role & 4) == 4) addOrganizer(_userAddress);
		if ((_role & 8) == 8) addSportsman(_userAddress);
	}

	///@dev register a user to an event and event to user
	///@param _userAddress address of the user
	///@param eventid id of the event
	function LinkUserAndEvent(address _userAddress, uint256 eventid)
		external
		isNotNull(_userAddress)
	{
		EventRegisterSportsman(eventid, _userAddress); // checks both values
		registerSportsmanToEvent(_userAddress, eventid); // no check required, already don above
	}

	///@dev creates a new event, associated to an organization
	///@param organizationId Id Of the Organization
	///@param startDate starting Date
	///@param endDate ending Date
	///@param eventDesc Description for the event
	function newEvent(
		uint256 organizationId,
		uint128 startDate,
		uint128 endDate,
		string memory eventDesc
	) external isNotNullUint256(startDate) isNotNullUint256(endDate) {
		require(endDate > startDate, "invalid dates");
		// We first neet to check that the sender corresponds to an organizer
		uint256 organizerId = organizerByAddress[msg.sender];
		require(organizerId > 0, "ERR6");
		require(checkorganizerisAdminOf(organizerId, organizationId), "ERR7");

		uint256 eventID = addEvent(
			organizationId,
			startDate,
			endDate,
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
		if (
			getEventCurrentState(eventID) ==
			stateOfCompetition.CompetitionInProgress
		) endEvent(eventID);
		setEventWinner(eventID, winner);
	}

	///@dev A medal is associated to an event, whatever its status
	///@param eventID id of the event
	///@param _nft address of medal nft associated to the prize
	function adminAddMedal(uint256 eventID, address _nft)
		external
		isAdminOfEvent(eventID)
	{
		// Check we have a IERC21 contract
		IERC721(_nft).supportsInterface(type(IERC721).interfaceId);

		// Find the organizer corresponding to the event
		uint256 orgId = getEventOrganizer(eventID);
		addMedal(_nft, orgId, eventID);
		uint256 medalID = getMedalCount() - 1;
		// registers medal to the event structure
		eventSetMedal(eventID, medalID);
	}

	///@dev Affect the medal owned by the event to the winner of the competition
	///@param eventID id of the event
	function adminGiveMedalToWinner(uint256 eventID)
		external
		isAdminOfEvent(eventID)
	{
		// Gets the id og the winner to associate the medal
		address winner = getWinner(eventID);
		require(winner != address(0), "ERR_I");
		require(eventHasMedal(eventID));

		setMedalWinner(eventGetMedal(eventID), winner);
		eventDistributeMedal(eventID);
		sportsmanAddMedal(winner, eventGetMedal(eventID));
	}

	///@dev add / remove the medal from user gallery. Nota: checks are done in getSportsmanMedal
	///@param medalIndx id of the event
	function publishMedal(uint256 medalIndx, bool status) public {
		uint256 mdID = getSportsmanMedal(msg.sender, medalIndx); // converts sportsMan->medalIndx => medalID
		medalPublish(mdID, status);
	}

	///@dev Set the geographic position of the Event
	///@param eventID id of the event
	function adminSetEventPosition(
		uint256 eventID,
		string memory posX,
		string memory posY
	) external isAdminOfEvent(eventID) {
		eventSetPosition(eventID, posX, posY);
	}

	///@dev Withdraw token placed in the contract
	function withdraw() external onlyOwner {
		uint256 balance = Token.balanceOf(address(this)); // check balance of contract MedalVerse
		require(balance != 0, "ERR_H");
		Token.transfer(msg.sender, balance); // transfer balance to owner

		emit MedalVerseWithdraw(msg.sender);
	}

	///@dev Check balance contract
	///@return return balance contract
	function getBalance() external view returns (uint256) {
		return Token.balanceOf(address(this));
	}
}
