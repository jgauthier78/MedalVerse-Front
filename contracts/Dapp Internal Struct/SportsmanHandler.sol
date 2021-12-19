// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFT_Medal_Bkg_Desc.sol";

///@dev Structure for describing MedalVerse Authors - used by AuthorHandler
struct Sportsman {
	address userAddress; // address used as ref
	uint256 sportCategory; // Number of creations
	mapping(uint256 => uint256) eventsSubscribed; // Events referenced by count
	mapping(uint256 => bool) eventsActivSubscription; // subscription referenced by eventsID
	uint256 nbEventsSubscrided;
	bool activ;
}

///@dev Contract Adding / Removing Authors and their creations
contract SportsmanHandler is Ownable {
	// Data ---------------------------------
	// - Authors -
	mapping(address => Sportsman) allSportsman; // Container for all the authors by address
	address[] public registeredSportsman; // Array of all the authors addresses

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	// Events -------------------------------
	event sportsmanAdded(address usrAddr);
	event sportsmanRegisterdEvent(address usrAddr, uint256 eventID);
	event sportsmanUnregisterdEvent(address usrAddr, uint256 eventID);

	// Methods -------------------------------
	///@dev Register an author, given an address
	///@param _user Address of the user to register as author
	function addSportsman(address _user, uint256 _sportCategory)
		internal
		onlyOwner
		isNotNull(_user)
	{
		registeredSportsman.push(_user);
		Sportsman storage _sportsMan = allSportsman[_user];
		_sportsMan.userAddress = _user;
		_sportsMan.sportCategory = _sportCategory;
		_sportsMan.activ = true;

		emit sportsmanAdded(_user);
	}

	///@dev Sportsman registers to an Event
	///@param _sportsMan Address of the user sportsman
	///@param eventId id of the event to register to
	function registerEvent(address _sportsMan, uint256 eventId)
		private
		onlyOwner
		isNotNull(_sportsMan)
	{
		assert(allSportsman[_sportsMan].activ);
		allSportsman[_sportsMan].eventsSubscribed[
			allSportsman[_sportsMan].nbEventsSubscrided++
		] = eventId;
		allSportsman[_sportsMan].eventsActivSubscription[eventId] = true;
		emit sportsmanRegisterdEvent(_sportsMan, eventId);
	}

	///@dev Sportsman unregisters to an Event
	///@param _sportsMan Address of the user sportsman
	///@param eventId id of the event to unregister to
	function unRegisterEvent(address _sportsMan, uint256 eventId)
		private
		onlyOwner
		isNotNull(_sportsMan)
	{
		allSportsman[_sportsMan].eventsActivSubscription[eventId] = false;
		emit sportsmanUnregisterdEvent(_sportsMan, eventId);
	}
}
