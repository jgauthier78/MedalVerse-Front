// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

enum stateOfCompetition {
	RegistrationOfParticipants,
	CompetitionInProgress,
	RewardDistribution,
	RewardDistributed
}

contract EventHandler is Ownable {
	struct EventDesc {
		address winner; // Winner of the Event
		uint256 eventId; // Index of the event in the EventList
		uint256 organizedBy; // Id of the Organization
		uint256 medalID;
		uint128 startDate;
		uint128 endDate;
		stateOfCompetition eventState;
		string eventDescription; // String describing the event
		string positionX;
		string positionY;
		address[] registeredSportsMan; //List of sportsman that are participating to the event
		bool hasMedal;
		bool ended; // finished ?
		bool started; // The event has started
	}

	// Data ---------------------------------

	uint256 eventCount; // Index for events
	mapping(uint256 => EventDesc) eventList; // List of events already registered

	// Modifiers ----------------------------
	modifier eventIsInState(uint256 eventId, stateOfCompetition _state) {
		require(eventList[eventId - 1].eventState == _state, "ERR_3");
		_;
	}
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}
	modifier isNotNullUint256(uint256 a) virtual {
		require(a != 0);
		_;
	}
	modifier isInRange(uint256 a, uint256 b) {
		require(a <= b, "ERR_1");
		_;
	}

	// Events -------------------------------
	event eventAdded(uint256 eventId);
	event eventRemoved(uint256 eventId);
	event eventRegisterSportsman(uint256 eventId, address sportsmanId);
	event eventStatusChanged(uint256 eventId, stateOfCompetition newStatus);
	event eventWinnerSet(uint256 eventId, address winner);

	// Methods -------------------------------
	///@dev add an event to the list of events
	///@param _organizedBy id of the oganization
	///@param _startDate Date for the event to start
	///@param _endDate Date for the event to finish
	///@param _eventDescription Desc of the evnt
	function addEvent(
		uint256 _organizedBy,
		uint128 _startDate,
		uint128 _endDate,
		string memory _eventDescription
	) internal returns (uint256) {
		EventDesc storage _event = eventList[eventCount];
		_event.eventId = eventCount;
		_event.organizedBy = _organizedBy;
		_event.startDate = _startDate;
		_event.endDate = _endDate;
		_event.winner = address(0);
		_event.eventDescription = _eventDescription;
		_event.eventState = stateOfCompetition.RegistrationOfParticipants;

		emit eventAdded(eventCount);

		return eventCount++;
	}

	///@dev returns the current state of the event
	///@param evntID index of the event
	function getEventCurrentState(uint256 evntID)
		public
		view
		returns (stateOfCompetition)
	{
		return eventList[evntID - 1].eventState;
	}

	///@dev returns the details of a specific event
	///@param eventId id of the event
	function getEvent(uint256 eventId)
		external
		view
		isNotNullUint256(eventId)
		returns (EventDesc memory)
	{
		EventDesc memory dsc = eventList[eventId - 1];
		dsc.eventId += 1;
		return dsc;
	}

	///@dev returns the winner of the event
	///@param eventId id of the event
	function getWinner(uint256 eventId)
		public
		view
		isInRange(eventId, eventCount)
		returns (address)
	{
		return eventList[eventId - 1].winner;
	}

	///@dev defines the winner of the event
	///@param eventID id of the event
	///@param _winner address of the winner
	function setEventWinner(uint256 eventID, address _winner)
		internal
		isNotNullUint256(eventID)
		isInRange(eventID, eventCount)
		eventIsInState(eventID, stateOfCompetition.RewardDistribution)
	{
		eventList[eventID - 1].winner = _winner;
		emit eventWinnerSet(eventID, _winner);
	}

	///@dev Open to registration
	///@param eventId id of the event
	function startEvent(uint256 eventId)
		internal
		isNotNullUint256(eventId)
		isInRange(eventId, eventCount)
		eventIsInState(eventId, stateOfCompetition.RegistrationOfParticipants)
	{
		// start the competition
		eventList[eventId - 1].eventState = stateOfCompetition
			.CompetitionInProgress;
		eventList[eventId - 1].started = true;
		emit eventStatusChanged(
			eventId,
			stateOfCompetition.CompetitionInProgress
		);
	}

	///@dev The event is closed
	///@param eventId id of the event
	function endEvent(uint256 eventId)
		internal
		isInRange(eventId, eventCount)
		isNotNullUint256(eventId)
		eventIsInState(eventId, stateOfCompetition.CompetitionInProgress)
	{
		eventList[eventId - 1].eventState = stateOfCompetition
			.RewardDistribution;
		eventList[eventId - 1].ended = true;
		emit eventStatusChanged(eventId, stateOfCompetition.RewardDistribution);
	}

	///@dev returns the list of Events
	///@param _start start index  - paging
	///@param _end ending index - paging
	function getEventList(uint256 _start, uint256 _end)
		external
		view
		isNotNullUint256(eventCount)
		isNotNullUint256(_start)
		returns (EventDesc[] memory)
	{
		_start--;
		_end--;
		require(_start <= _end); // check params
		require(_start < eventCount, "ERR_1");

		// we adjust the ending value
		if (_end >= eventCount) _end = eventCount - 1;

		// creat an array for returning only usefull values
		EventDesc[] memory _result = new EventDesc[](_end - _start + 1);
		// Fill the structure
		uint256 x = _start;
		while (x <= _end) {
			_result[x] = eventList[x];
			_result[x].eventId += 1;
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
	) internal isInRange(eventId, eventCount) isNotNullUint256(eventId) {
		eventList[eventId - 1].registeredSportsMan.push(sportsmanID);
		emit eventRegisterSportsman(eventId, sportsmanID);
	}

	///@dev returns the id of the event organizer
	///@param eventId id of the event
	function getEventOrganizer(uint256 eventId)
		internal
		view
		isNotNullUint256(eventId)
		isInRange(eventId, eventCount)
		returns (uint256)
	{
		return eventList[eventId - 1].organizedBy;
	}

	///@dev Define the medal for the event
	///@param eventID id of the event
	///@param medalID id of the medal
	function eventSetMedal(uint256 eventID, uint256 medalID)
		internal
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
	//		// eventIsInState(eventID, stateOfCompetition.RewardDistribution)
	{
		eventID--;
		eventList[eventID].hasMedal = true;
		eventList[eventID].medalID = medalID;
	}

	///@dev Affect the medal of the event to the winner
	///@param eventID id of the event
	function eventDistributeMedal(uint256 eventID)
		internal
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		eventIsInState(eventID, stateOfCompetition.RewardDistribution)
	{
		require(eventList[eventID - 1].hasMedal == true, "ERR_4");
		eventList[eventID - 1].eventState = stateOfCompetition
			.RewardDistributed;
		emit eventStatusChanged(eventID, stateOfCompetition.RewardDistributed);
	}

	///@dev checks if event has a medal
	///@param eventID id of the event
	function eventHasMedal(uint256 eventID)
		public
		view
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		returns (bool)
	{
		return eventList[eventID - 1].hasMedal;
	}

	///@dev returns the id of the medal associated to the event
	///@param eventID id of the event
	function eventGetMedal(uint256 eventID)
		public
		view
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		returns (uint256)
	{
		return eventList[eventID - 1].medalID;
	}

	///@dev returns the id of the winner associated to the event
	///@param eventID id of the event
	function eventGetWinner(uint256 eventID)
		external
		view
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		returns (address)
	{
		return eventList[eventID - 1].winner;
	}

	///@dev Affects coordinates to en event
	///@param eventID id of the event
	///@param posX X position
	///@param posY Y Position
	function eventSetPosition(
		uint256 eventID,
		string memory posX,
		string memory posY
	) internal isInRange(eventID, eventCount) isNotNullUint256(eventID) {
		eventList[eventID - 1].positionX = posX;
		eventList[eventID - 1].positionY = posY;
	}

	///@dev returns X coordinate of an event
	///@param eventID id of the event
	function eventGetPositionX(uint256 eventID)
		external
		view
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		returns (string memory)
	{
		return eventList[eventID - 1].positionX;
	}

	///@dev returns Y coordinate of an event
	///@param eventID id of the event
	function eventGetPositionY(uint256 eventID)
		external
		view
		isInRange(eventID, eventCount)
		isNotNullUint256(eventID)
		returns (string memory)
	{
		return eventList[eventID - 1].positionY;
	}
}
