## `OrganizerHandler`





### `isNotNull(address a)`





### `isNotNullUint256(uint256 a)`





### `isLowerThanUint256(uint256 a, uint256 b)`






### `addOrganizer(address _user)` (internal)



add an organizer to the list of organizers


### `addOrganization(address _user, string _name, string _description, string _logoURI)` (external)



add an organization to the list of orgs


### `organizationAddAdmin(uint256 orgId, address _user)` (public)



add an admin to an org.


### `getOrganizationName(uint256 orgID) → string` (external)





### `getOrganizationsList(uint256 _start, uint256 _end) → struct OrganizerHandler.organizationDesc[]` (external)



returns the list of organization : they may be inactive, must test activ value


### `getActivAdminCount(uint256 orgIndx) → uint256` (internal)



returns the count of activ admin


### `getAdminList(uint256 orgIndx) → uint256[]` (external)



returns the list activ admin of an organisation


### `checkorganizerisAdminOf(uint256 organizer, uint256 orgIndx) → bool` (public)



returns true if the user is admin of the organization


### `checkorganizerisAdminOf(uint256 orgIndx) → bool` (public)



returns true if the user is admin of the organization


### `getOrganizerAddressById(uint256 id) → address` (external)



returns the address of an admin, given an id organizer


### `getOrganizerOrganisationList(address _user) → uint256[]` (external)



returns the list of organization the organizer subscribed to


### `organizerAddEvent(uint256 organizerID, uint256 organizationId, uint256 eventID)` (internal)





### `getEventList(uint256 orgId) → uint256[]` (external)



return the list of events associated to an organization



### `OrganizerAdded(address _user, uint256 indx)`





### `OganizationAdded(address _user, uint256 indx)`





### `organizerAddedEvent()`






### `Organizer`


address _user


uint256[] organizationList


uint256 nbActivOganization


bool activ


### `Organization`


uint256[] adminList


uint256[] EventList


string name


string description


string logoURI


### `organizationDesc`


string name


string description


string logoURI



