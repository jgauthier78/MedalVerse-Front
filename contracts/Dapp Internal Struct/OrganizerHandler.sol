// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

contract OrganizerHandler is Ownable {
	struct Organizer {
		address _user;
		uint256[] organizationList;
		mapping(uint256 => bool) organizationState;
		bool activ;
	}

	struct Organization {
		uint256[] adminList;
		mapping(address => bool) adminState;
		string name;
		string description;
		string logoURI;
		bool activ;
	}

	Organizer[] organizerList; // List of organizers
	mapping(address => uint256) organizeByAddress;

	Organization[] organizationList; // List of organization

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	event OrganizerAdded(address _user, uint256 indx);
	event OganizationAdded(address _user, uint256 indx);

	// Methods -------------------------------
	function addOrganizer(address _user) internal onlyOwner isNotNull(_user) {
		uint256 indx = organizerList.length;
		Organizer storage _organizer = organizerList.push();
		_organizer._user = _user;
		_organizer.activ = true;
		organizeByAddress[_user] = indx;

		emit OrganizerAdded(_user, indx);
	}

	// Methods -------------------------------
	///@dev add an organization to the list of orgs
	///@param _user admin of the organization
	///@param _name UI dislay name
	///@param _description UI description text
	///@param _logoURI Link to the icon logo
	function addOrganization(
		address _user,
		string memory _name,
		string memory _description,
		string memory _logoURI
	) public onlyOwner isNotNull(_user) {
		uint256 indx = organizationList.length;
		Organization storage _org = organizationList.push();
		_org.name = _name;
		_org.description = _description;
		_org.logoURI = _logoURI;
		_org.activ = true;

		// add the user to the list of admin
		organizationAddAdmin(_user, indx);

		emit OganizationAdded(_user, indx);
	}

	///@dev add an admin to an org.
	///@param _user admin of the organizatio
	///@param orgId id of the organization
	function organizationAddAdmin(address _user, uint256 orgId)
		private
		onlyOwner
		isNotNull(_user)
	{
		Organization storage org = organizationList[orgId];
		uint256 usrIndex = organizeByAddress[_user];
		Organizer storage user = organizerList[usrIndex];

		// register in the Organizer struct
		user.organizationList.push(orgId);
		user.organizationState[orgId] = true;

		// register in the Organization struct
		org.adminList.push(usrIndex);
		org.adminState[_user] = false;
	}
}
