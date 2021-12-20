// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFT_Medal_Bkg_Desc.sol";

///@dev Structure for describing MedalVerse Authors - used by AuthorHandler
struct Sportsman {
	address userAddress; // address used as ref
	uint256 sportCategory; // Categories of sports supported
	mapping(uint256 => uint256) eventsSubscribed; // Events referenced by count
	mapping(uint256 => bool) eventsActivSubscription; // subscription referenced by eventsID
	uint256 nbEventsSubscrided;
	uint256 nbActivSubscriptions;
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
	modifier isNotNullUint256(uint256 a) virtual {
		require(a != 0);
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
	function registerSportsmanToEvent(address _sportsMan, uint256 eventId)
		private
		onlyOwner
		isNotNull(_sportsMan)
	{
		assert(allSportsman[_sportsMan].activ);
		allSportsman[_sportsMan].eventsSubscribed[
			allSportsman[_sportsMan].nbEventsSubscrided++
		] = eventId;
		allSportsman[_sportsMan].eventsActivSubscription[eventId] = true;
		allSportsman[_sportsMan].nbActivSubscriptions++;
		emit sportsmanRegisterdEvent(_sportsMan, eventId);
	}

	///@dev Sportsman unregisters to an Event
	///@param _sportsMan Address of the user sportsman
	///@param eventId id of the event to unregister to
	function unRegisterSportsmanFromEvent(address _sportsMan, uint256 eventId)
		private
		onlyOwner
		isNotNull(_sportsMan)
	{
		allSportsman[_sportsMan].eventsActivSubscription[eventId] = false;
		allSportsman[_sportsMan].nbActivSubscriptions--;
		emit sportsmanUnregisterdEvent(_sportsMan, eventId);
	}

	///@dev returns the number of Sportsman
	function getNumberOfSportsman() public view returns (uint256) {
		return registeredSportsman.length;
	}

	struct SportsmanDesc {
		address userAddress; // address used as ref
		uint256 sportCategory; // Categories of sports supported
		uint256 nbActivSubscriptions;
		bool activ;
	}

	///@dev returns the list of organization : they may be inactif, must test activ value
	///@param _start starting index amoung organizations
	///@param _end ending index amoung ogranizations
	function getSportsmanList(uint256 _start, uint256 _end)
		public
		view
		isNotNullUint256(registeredSportsman.length)
		returns (SportsmanDesc[] memory)
	{
		require(_start <= _end); // check params
		require(_start < registeredSportsman.length, "StartIndex out of range");

		// we adjust the ending value
		if (_end >= registeredSportsman.length)
			_end = registeredSportsman.length - 1;

		// creat an array for returning only usefull values
		SportsmanDesc[] memory _desc = new SportsmanDesc[](_end - _start + 1);

		// Fill the structure
		uint256 x = _start;
		while (x <= _end) {
			Sportsman storage sprt = allSportsman[registeredSportsman[x]];
			_desc[x - _start] = SportsmanDesc({
				userAddress: sprt.userAddress,
				sportCategory: sprt.sportCategory,
				nbActivSubscriptions: sprt.nbActivSubscriptions,
				activ: sprt.activ
			});

			x++;
		}
		return _desc;
	}

	function getSportsmanEventsSubscriptions(address sportsmanId)
		public
		view
		returns (uint256[] memory)
	{
		// We make sure tjere are some events the user subscribed to
		assert(allSportsman[sportsmanId].nbActivSubscriptions > 0);
		//Allocate enogh entries for the resulting list
		uint256[] memory result = new uint256[](
			allSportsman[sportsmanId].nbActivSubscriptions
		);

		uint256 i = 0;
		for (
			uint256 x = 0;
			x < allSportsman[sportsmanId].nbEventsSubscrided;
			x++
		) {
			// If the current subscription is active, then add it
			if (allSportsman[sportsmanId].eventsActivSubscription[x])
				result[i++] = allSportsman[sportsmanId].eventsSubscribed[x];
		}
		return result;
	}
}
