// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventHandler is Ownable {
	struct EventDesc {
		uint256 eventId; // Index of the event in the EventList
		uint256 sportCategory; // Category
		uint256 organizedBy; // Id of the Organization
		address[] registeredSportsMan; //List of sportsman that are participating to the event
		address winner; // Winner of the Event
		uint8 startDate;
		uint8 endDate;
		bool activ;
		bool ended; // finished ?
		bool started; // The event has started
	}

	// Data ---------------------------------
	//   Events
	mapping(uint256 => EventDesc) eventList; // List of events already registered
	uint256 eventCount; // Index for events

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}
	modifier isNotNullUint256(uint256 a) virtual {
		require(a != 0);
		_;
	}
	modifier isInRange(uint256 a, uint256 b) {
		require(a < b);
		_;
	}

	// Events -------------------------------
	event eventAdded(uint256 eventId);
	event eventRemoved(uint256 eventId);
	event eventRegisterSportsman(uint256 eventId, address sportsmanId);

	// Methods -------------------------------
	///@dev add an event to the list of events
	///@param _organizedBy id of the oganization
	///@param _startDate Date for the event to start
	///@param _endDate Date for the event to finish
	///@param _sportCategory Type of event
	function addEvent(
		uint256 _organizedBy,
		uint8 _startDate,
		uint8 _endDate,
		uint256 _sportCategory
	) public returns (uint256) {
		EventDesc storage _event = eventList[eventCount];
		_event.eventId = eventCount;
		_event.organizedBy = _organizedBy;
		_event.startDate = _startDate;
		_event.endDate = _endDate;
		_event.sportCategory = _sportCategory;
		_event.activ = true;
		_event.ended = false;
		_event.started = false;
		_event.winner = address(0);
		emit eventAdded(eventCount);
		return eventCount++;
	}

	///@dev remove an event from the list of events
	///@param eventId id of the event
	function removeEvent(uint256 eventId) private onlyOwner {
		eventList[eventCount].activ = false;
		emit eventRemoved(eventId);
	}

	///@dev returns the details of a specific event
	///@param eventId id of the event
	function getEvent(uint256 eventId) public view returns (EventDesc memory) {
		return eventList[eventId];
	}

	function getWinner(uint256 eventId)
		external
		view
		isNotNullUint256(eventId)
		returns (address)
	{
		return eventList[eventId].winner;
	}

	function setWinner(uint256 eventId, address winner)
		internal
		isNotNullUint256(eventId)
	{
		eventList[eventId].winner = winner;
	}

	function startEvent(uint256 eventId)
		internal
		isInRange(eventId, eventCount)
	{
		eventList[eventId].started = true;
		eventList[eventId].ended = false;
	}

	function endEvent(uint256 eventId) internal isInRange(eventId, eventCount) {
		eventList[eventId].ended = true;
	}

	///@dev returns the list of Events
	///@param _start start index  - paging
	///@param _end ending index - paging
	function getEventList(uint256 _start, uint256 _end)
		public
		view
		isNotNullUint256(eventCount)
		returns (EventDesc[] memory)
	{
		require(_start <= _end); // check params
		require(_start < eventCount, "StartIndex out of range");

		// we adjust the ending value
		if (_end >= eventCount) _end = eventCount - 1;

		// creat an array for returning only usefull values
		EventDesc[] memory _result = new EventDesc[](_end - _start + 1);
		// Fill the structure
		uint256 x = _start;
		while (x <= _end) {
			_result[x] = eventList[x];
			x++;
		}
		return _result;
	}

	///@dev returns the number of Events
	function getEventCount() public view returns (uint256) {
		return eventCount;
	}

	///@dev Add a Sportsman to an event
	///@param eventId id of the event
	///@param sportsmanID address of the sportsman
	function EventRegisterSportsman(
		uint256 eventId,
		address sportsmanID // Sportsman already validated by child class
	) internal isInRange(eventId, eventCount) {
		eventList[eventId].registeredSportsMan.push(sportsmanID);
		emit eventRegisterSportsman(eventId, sportsmanID);
	}

	function getEventOrganizer(uint256 eventId)
		internal
		view
		isInRange(eventId, eventCount)
		returns (uint256)
	{
		return eventList[eventId].organizedBy;
	}
}
