// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

// The structure that handles the organization, organizers and admins
contract OrganizerHandler is Ownable {
	// An organizer is an admin of an organization
	struct Organizer {
		address _user;
		uint256[] organizationList; // id of orgs users subscribed to (id+1)
		uint256 nbActivOganization; // number of orgsid != 0
		bool activ;
	}

	// an Organization is a strucure that can create events
	struct Organization {
		uint256[] adminList;
		uint256[] EventList;
		string name;
		string description;
		string logoURI;
		bool activ;
	}

	Organizer[] organizerList; // List of organizers
	mapping(address => uint256) organizerByAddress;

	Organization[] organizationList; // List of organization

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}
	modifier isNotNullUint256(uint256 a) virtual {
		require(a != 0);
		_;
	}
	modifier isLowerThanUint256(uint256 a, uint256 b) virtual {
		require(a < b);
		_;
	}

	// Events --------------------------------

	event OrganizerAdded(address _user, uint256 indx);
	event OganizationAdded(address _user, uint256 indx);

	// Methods -------------------------------
	// Methods -------------------------------
	///@dev add an organizer to the list of organizers
	///@param _user address of the organizer
	function addOrganizer(address _user) internal onlyOwner isNotNull(_user) {
		uint256 indx = organizerList.length;
		Organizer storage _organizer = organizerList.push();
		_organizer._user = _user;
		_organizer.activ = true;
		organizerByAddress[_user] = indx + 1;

		emit OrganizerAdded(_user, indx);
	}

	// Methods -------------------------------
	///@dev add an organization to the list of orgs
	///@param _user admin of the organization
	///@param _name UI dislay name
	///@param _description UI description text
	///@param _logoURI Link to the icon lo		user.organizationState[orgId] = true;

	function addOrganization(
		address _user,
		string memory _name,
		string memory _description,
		string memory _logoURI
	) public isNotNull(_user) onlyOwner {
		uint256 indx = organizationList.length;
		Organization storage _org = organizationList.push();
		_org.name = _name;
		_org.description = _description;
		_org.logoURI = _logoURI;
		_org.activ = true;
		organizationAddAdmin(indx, _user);

		emit OganizationAdded(_user, indx);
	}

	///@dev add an admin to an org.
	///@param _user admin of the organizatio
	///@param orgId id of the organization
	function organizationAddAdmin(uint256 orgId, address _user)
		public
		onlyOwner
		isNotNull(_user)
	{
		Organization storage org = organizationList[orgId];
		uint256 usrIndex = organizerByAddress[_user];
		assert(usrIndex != 0);
		Organizer storage user = organizerList[usrIndex - 1];

		// register in the Organizer struct
		user.organizationList.push(orgId + 1);
		user.nbActivOganization++;

		// register in the Organization struct index 0 is used to remove a user from a list
		org.adminList.push(usrIndex);
	}

	// Exposing data to the outside ---

	function getOrganizationName(uint256 orgID)
		public
		view
		returns (string memory)
	{
		require(orgID < organizationList.length, "ERR_1");
		return organizationList[orgID].name;
	}

	// Simplified struct used for viewing the internal states
	struct organizationDesc {
		string name;
		string description;
		string logoURI;
		bool activ;
	}

	///@dev returns the list of organization : they may be inactive, must test activ value
	///@param _start starting index amoung organizations
	///@param _end ending index amoung ogranizations
	function getOrganizationsList(uint256 _start, uint256 _end)
		public
		view
		isNotNullUint256(organizationList.length)
		returns (organizationDesc[] memory)
	{
		require(_start <= _end); // check params
		require(_start < organizationList.length, "ERR_1");

		// we adjust the ending value
		if (_end >= organizationList.length) _end = organizationList.length - 1;

		// creat an array for returning only usefull values
		organizationDesc[] memory _desc = new organizationDesc[](
			_end - _start + 1
		);

		// Fill the structure
		uint256 x = _start;
		while (x <= _end) {
			_desc[x - _start] = organizationDesc({
				name: organizationList[x].name,
				description: organizationList[x].description,
				logoURI: organizationList[x].logoURI,
				activ: organizationList[x].activ
			});

			x++;
		}
		return _desc;
	}

	///@dev returns the number of Organizations
	function getOrganisationCount() public view returns (uint256) {
		return organizationList.length;
	}

	///@dev returns the count of activ admin
	///@param orgIndx count the number
	function getActivAdminCount(uint256 orgIndx)
		internal
		view
		returns (uint256)
	{
		uint256 count = 0;
		for (uint256 x = 0; x < organizationList[orgIndx].adminList.length; x++)
			if (organizationList[orgIndx].adminList[x] != 0) count++;

		return count;
	}

	///@dev returns the list activ admin of an organisation
	///@param orgIndx  index amoung organizations
	function getAdminList(uint256 orgIndx)
		public
		view
		isLowerThanUint256(orgIndx, organizationList.length)
		returns (uint256[] memory)
	{
		uint256 size = getActivAdminCount(orgIndx);

		uint256[] memory list = new uint256[](size);
		for (uint256 x = 0; x < organizationList[orgIndx].adminList.length; x++)
			if (organizationList[orgIndx].adminList[x] > 0)
				list[x] = organizationList[orgIndx].adminList[x] - 1;
		return list;
	}

	///@dev returns true if the user is admin of the organization
	///@param organizer  index amoung organizers
	///@param orgIndx  index amoung organizations
	function checkorganizerisAdminOf(uint256 organizer, uint256 orgIndx)
		public
		view
		returns (bool)
	{
		require(orgIndx < organizationList.length, "ERR_5");
		require(organizer <= organizerList.length, "ERR_1");
		uint256 maxL = organizationList[orgIndx].adminList.length;

		for (uint256 i = 0; i < maxL; i++) {
			if (organizationList[orgIndx].adminList[i] == organizer)
				return true;
		}
		return false;
	}

	///@dev returns true if the user is admin of the organization
	///@param orgIndx  index amoung organizations
	function checkorganizerisAdminOf(uint256 orgIndx)
		public
		view
		returns (bool)
	{
		uint256 organizerId = organizerByAddress[msg.sender];
		require(organizerId > 0, "ERR_6");
		return checkorganizerisAdminOf(organizerId, orgIndx);
	}

	///@dev returns the address of an admin, given an id organizer
	///@param id  id (=index) of the organizer
	function getOrganizerAddressById(uint256 id)
		public
		view
		isLowerThanUint256(id, organizerList.length)
		returns (address)
	{
		return organizerList[id]._user;
	}

	///@dev returns the list of organization the organizer subscribed to
	///@param _user  address of the user
	function getOrganizerOrganisationList(address _user)
		public
		view
		returns (uint256[] memory)
	{
		// We make sure the provided addess is correct
		uint256 indx = organizerByAddress[_user];
		require(indx != 0, "ERR_6");
		indx--; // Now that we have checked, we get the correct iD
		uint256 size = organizerList[indx].nbActivOganization;

		// we stop if no subscription
		require(size > 0, "ERR_7");

		// Create and fill returnable array
		uint256[] memory result = new uint256[](size);
		uint256 increment = 0;
		for (uint256 x = 0; x < organizationList.length; x++) {
			if (organizerList[indx].organizationList[x] > 0) {
				result[increment++] =
					organizerList[indx].organizationList[x] -
					1;
			}
		}
		return result;
	}

	event organizerAddedEvent();

	function organizerAddEvent(
		uint256 organizerID,
		uint256 organizationId,
		uint256 eventID
	) internal {
		require(organizerID <= organizerList.length, "ERR_1");

		organizationList[organizationId].EventList.push(eventID);
		emit organizerAddedEvent();
	}

	///@dev return the list of events associated to an organization
	///@param orgId id of the org
	function getEventList(uint256 orgId)
		public
		view
		returns (uint256[] memory)
	{
		uint256[] memory EventList = organizationList[orgId].EventList;
		return EventList;
	}
}
