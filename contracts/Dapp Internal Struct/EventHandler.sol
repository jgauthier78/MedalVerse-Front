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
		uint256 startDate;
		uint256 endDate;
		uint256 medalID;
		bool hasMedal;
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
		uint256 _startDate,
		uint256 _endDate,
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
		// return eventCount++;

		// eventCount++;
		// return _event.eventId;

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
		return eventList[eventId-1];
	}

	///@dev returns the winner of the event
	///@param eventId id of the event
	function getWinner(uint256 eventId)
		public
		view
		isInRange(eventId, eventCount)
		returns (address)
	{
		return eventList[eventId].winner;
	}

	///@dev defines the winner of the event
	///@param eventID id of the event
	///@param _winner address of the winner
	function setEventWinner(uint256 eventID, address _winner)
		internal
		isInRange(eventID, eventCount)
	{
		eventList[eventID].winner = _winner;
	}

	///@dev Open to registration
	///@param eventId id of the event
	function startEvent(uint256 eventId)
		internal
		isInRange(eventId, eventCount)
	{
		eventList[eventId].started = true;
		eventList[eventId].ended = false;
	}

	///@dev The event is closed
	///@param eventId id of the event
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

	///@dev returns the id of the event organizer
	///@param eventId id of the event
	function getEventOrganizer(uint256 eventId)
		internal
		view
		isInRange(eventId, eventCount)
		returns (uint256)
	{
		return eventList[eventId].organizedBy;
	}

	function eventSetMedal(uint256 eventID, uint256 medalID)
		internal
		isInRange(eventID, eventCount)
	{
		eventList[eventID].hasMedal = true;
		eventList[eventID].medalID = medalID;
	}

	function eventHasMedal(uint256 eventID)
		public
		view
		isInRange(eventID, eventCount)
		returns (bool)
	{
		return eventList[eventID].hasMedal;
	}

	function eventGetMedal(uint256 eventID)
		public
		view
		isInRange(eventID, eventCount)
		returns (uint256)
	{
		return eventList[eventID].medalID;
	}
}
