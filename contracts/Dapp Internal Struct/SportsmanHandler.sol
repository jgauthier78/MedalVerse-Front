// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

///@dev Structure for describing MedalVerse Authors - used by AuthorHandler
struct Sportsman {
	address userAddress; // address used as ref
	uint256 nbEventsSubscrided;
	uint256 nbActivSubscriptions;
	mapping(uint256 => uint256) eventsSubscribed; // Events referenced by count
	mapping(uint256 => bool) eventsActivSubscription; // subscription referenced by eventsID
	uint256[] medalList;
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
	event sportsmanMedalAdded(address sportsmanId, uint256 medalID);

	// Methods -------------------------------

	struct SportsmanDesc {
		address userAddress; // address used as ref
		uint256 nbActivSubscriptions;
	}

	///@dev returns the list of organization : they may be inactif, must test activ value
	///@param _start starting index amoung organizations
	///@param _end ending index amoung ogranizations
	function getSportsmanList(uint256 _start, uint256 _end)
		external
		view
		isNotNullUint256(registeredSportsman.length)
		returns (SportsmanDesc[] memory)
	{
		require(_start <= _end); // check params
		require(_start < registeredSportsman.length, "ERR_1");

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
				nbActivSubscriptions: sprt.nbActivSubscriptions
			});

			x++;
		}
		return _desc;
	}

	///@dev returns the nb of activ events the sportsman registered to
	///@param sportsmanId address of the sportsman
	function getSportsManEventsNumber(address sportsmanId)
		external
		view
		isNotNull(sportsmanId)
		returns (uint256)
	{
		return allSportsman[sportsmanId].nbActivSubscriptions;
	}

	///@dev returns the list of activ events the sportsman registered to
	///@param sportsmanId address of the sportsman
	function getSportsmanEventsSubscriptions(
		address sportsmanId ///@dev returns the list of activ events the sportsman registered to
	) external view returns (uint256[] memory) {
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
			uint256 id = allSportsman[sportsmanId].eventsSubscribed[x];
			// If the current subscription is active, then add it
			if (allSportsman[sportsmanId].eventsActivSubscription[id])
				result[i++] = id;
		}
		return result;
	}

	///@dev Returns the medals of a sportsman
	///@param sportsmanId id of the sportsman
	function getSportsmanMedalList(address sportsmanId)
		external
		view
		returns (uint256[] memory)
	{
		return allSportsman[sportsmanId].medalList;
	}

	///@dev Gets the number of medal owned by the Sportsman
	///@param sportsmanId id of the sportsman
	function getSportsmanMedalCount(address sportsmanId)
		external
		view
		returns (uint256)
	{
		return allSportsman[sportsmanId].medalList.length;
	}

	///@dev Returns a specific medal of a sportsman
	///@param sportsmanId id of the sportsman
	///@param indx indx of a sportsman
	function getSportsmanMedal(address sportsmanId, uint256 indx)
		public
		view
		returns (uint256)
	{
		require(indx < allSportsman[sportsmanId].medalList.length, "ERR_1");
		return allSportsman[sportsmanId].medalList[indx];
	}

	///@dev Affect a medal to a sportsman
	///@param sportsmanId id of the sportsman
	///@param medalID id of the medal
	function sportsmanAddMedal(address sportsmanId, uint256 medalID) internal {
		allSportsman[sportsmanId].medalList.push(medalID);
		emit sportsmanMedalAdded(sportsmanId, medalID);
	}

	///@dev Register an author, given an address
	///@param _user Address of the user to register as author
	function addSportsman(address _user) internal onlyOwner isNotNull(_user) {
		registeredSportsman.push(_user);
		Sportsman storage _sportsMan = allSportsman[_user];
		_sportsMan.userAddress = _user;
		emit sportsmanAdded(_user);
	}

	///@dev Sportsman registers to an Event
	///@param _sportsMan Address of the user sportsman
	///@param eventId id of the event to register to
	function registerSportsmanToEvent(address _sportsMan, uint256 eventId)
		internal
		onlyOwner
		isNotNull(_sportsMan)
		isNotNullUint256(eventId)
	{
		uint256 indx = allSportsman[_sportsMan].nbEventsSubscrided++;
		allSportsman[_sportsMan].eventsSubscribed[indx] = eventId;
		allSportsman[_sportsMan].eventsActivSubscription[eventId] = true;
		allSportsman[_sportsMan].nbActivSubscriptions++;
		emit sportsmanRegisterdEvent(_sportsMan, eventId);
	}
}
