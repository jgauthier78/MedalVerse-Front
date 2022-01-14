## `SportsmanHandler`



Contract Adding / Removing Authors and their creations

### `isNotNull(address a)`





### `isNotNullUint256(uint256 a)`






### `addSportsman(address _user)` (internal)



Register an author, given an address


### `registerSportsmanToEvent(address _sportsMan, uint256 eventId)` (internal)



Sportsman registers to an Event


### `getSportsmanList(uint256 _start, uint256 _end) → struct SportsmanHandler.SportsmanDesc[]` (external)



returns the list of organization : they may be inactif, must test activ value


### `getSportsManEventsNumber(address sportsmanId) → uint256` (external)



returns the nb of activ events the sportsman registered to


### `getSportsmanEventsSubscriptions(address sportsmanId) → uint256[]` (external)



returns the list of activ events the sportsman registered to


### `getSportsmanMedalList(address sportsmanId) → uint256[]` (external)





### `getSportsmanMedalCount(address sportsmanId) → uint256` (external)





### `getSportsmanMedal(address sportsmanId, uint256 indx) → uint256` (public)





### `sportsmanAddMedal(address sportsmanId, uint256 medalID)` (internal)






### `sportsmanAdded(address usrAddr)`





### `sportsmanRegisterdEvent(address usrAddr, uint256 eventID)`





### `sportsmanUnregisterdEvent(address usrAddr, uint256 eventID)`





### `sportsmanMedalAdded(address sportsmanId, uint256 medalID)`






### `SportsmanDesc`


address userAddress


uint256 nbActivSubscriptions



