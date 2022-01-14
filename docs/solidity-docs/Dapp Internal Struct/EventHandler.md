## `EventHandler`





### `eventIsInState(uint256 eventId, enum stateOfCompetition _state)`





### `isNotNull(address a)`





### `isNotNullUint256(uint256 a)`





### `isInRange(uint256 a, uint256 b)`






### `addEvent(uint256 _organizedBy, uint128 _startDate, uint128 _endDate, string _eventDescription) → uint256` (internal)



add an event to the list of events


### `getEventCurrentState(uint256 evntID) → enum stateOfCompetition` (public)



returns the current state of the event


### `getEvent(uint256 eventId) → struct EventHandler.EventDesc` (external)



returns the details of a specific event


### `getWinner(uint256 eventId) → address` (public)



returns the winner of the event


### `setEventWinner(uint256 eventID, address _winner)` (internal)



defines the winner of the event


### `startEvent(uint256 eventId)` (internal)



Open to registration


### `endEvent(uint256 eventId)` (internal)



The event is closed


### `getEventList(uint256 _start, uint256 _end) → struct EventHandler.EventDesc[]` (external)



returns the list of Events


### `getEventCount() → uint256` (public)



returns the number of Events

### `EventRegisterSportsman(uint256 eventId, address sportsmanID)` (internal)



Add a Sportsman to an event


### `getEventOrganizer(uint256 eventId) → uint256` (internal)



returns the id of the event organizer


### `eventSetMedal(uint256 eventID, uint256 medalID)` (internal)





### `eventDistributeMedal(uint256 eventID)` (internal)



Affect the medal of the event to the winner


### `eventHasMedal(uint256 eventID) → bool` (public)



checks if event has a medal


### `eventGetMedal(uint256 eventID) → uint256` (public)



returns the id of the medal associated to the event


### `eventGetWinner(uint256 eventID) → address` (external)



returns the id of the winner associated to the event


### `eventSetPosition(uint256 eventID, string posX, string posY)` (internal)



Affects coordinates to en event


### `eventGetPositionX(uint256 eventID) → string` (external)



returns X coordinate of an event


### `eventGetPositionY(uint256 eventID) → string` (external)



returns Y coordinate of an event



### `eventAdded(uint256 eventId)`





### `eventRemoved(uint256 eventId)`





### `eventRegisterSportsman(uint256 eventId, address sportsmanId)`





### `eventStatusChanged(uint256 eventId, enum stateOfCompetition newStatus)`





### `eventWinnerSet(uint256 eventId, address winner)`






### `EventDesc`


address winner


uint256 eventId


uint256 organizedBy


uint256 medalID


uint128 startDate


uint128 endDate


enum stateOfCompetition eventState


string eventDescription


string positionX


string positionY


address[] registeredSportsMan


bool hasMedal


bool ended


bool started



