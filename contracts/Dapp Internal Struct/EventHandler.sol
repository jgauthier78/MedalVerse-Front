// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventHandler is Ownable {
	struct EventDesc {
		uint256 eventId;
		uint256 sportCategory;
		uint256 organizedBy;
		address[] registeredSportsMan;
		uint8 startDate;
		uint8 endDate;
		bool activ;
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
	// Events -------------------------------
	event eventAdded(uint256 eventId);
	event eventRemoved(uint256 eventId);

	// Methods -------------------------------
	///@dev add an event to the list of events
	///@param _organizedBy id of the organizer
	///@param _startDate Date for the event to start
	///@param _endDate Date for the event to finish
	///@param _sportCategory Type of event
	function addEvent(
		uint256 _organizedBy,
		uint8 _startDate,
		uint8 _endDate,
		uint256 _sportCategory
	) public onlyOwner {
		EventDesc storage _event = eventList[eventCount];
		_event.eventId = eventCount;
		_event.organizedBy = _organizedBy;
		_event.startDate = _startDate;
		_event.endDate = _endDate;
		_event.sportCategory = _sportCategory;
		_event.activ = true;
		emit eventAdded(eventCount);
		eventCount++;
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
	function getEventCount(uint256 _start, uint256 _end)
		public
		view
		returns (uint256)
	{
		return eventCount;
	}
}
