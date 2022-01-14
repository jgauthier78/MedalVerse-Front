## `MedalVerse`





### `isNotNull(address a)`





### `isNotNullUint256(uint256 a)`





### `isAdminOfEvent(uint256 eventID)`






### `constructor(address addressToken)` (public)





### `addNewUser(address _userAddress, string _iconURI, string _userName, string _email, uint256 _role)` (external)



Add a new user to the DB, using parent classes


### `LinkUserAndEvent(address _userAddress, uint256 eventid)` (external)



register a user to an event and event to user


### `newEvent(uint256 organizationId, uint128 startDate, uint128 endDate, string eventDesc)` (external)



creates a new event, associated to an organization


### `adminStartEvent(uint256 eventID)` (external)



The event starts now, checks we are an admin for the event


### `adminEndEvent(uint256 eventID)` (external)



The event ends now,checks we are an admin for the event


### `adminSetWinner(uint256 eventID, address winner)` (external)



The event gets a winner and closes,checks we are an admin for the event


### `adminAddMedal(uint256 eventID, address _nft)` (external)



A medal is associated to an event, whatever its status


### `adminGiveMedalToWinner(uint256 eventID)` (external)



Affect the medal owned by the event to the winner of the competition


### `publishMedal(uint256 medalIndx, bool status)` (public)



add / remove the medal from user gallery. Nota: checks are done in getSportsmanMedal


### `adminSetEventPosition(uint256 eventID, string posX, string posY)` (external)



Set the geographic position of the Event


### `withdraw()` (external)



Withdraw token placed in the contract

### `getBalance() → uint256` (external)



Check balance contract



### `MedalVerseWithdraw(address owner)`







