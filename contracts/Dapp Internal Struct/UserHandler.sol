// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

///@dev Structure for describing MedalVerse Users - used by the main contract
struct User {
	string iconURI; // URI for displaying user in UI
	string userName; // Username for UI elements
	string email; // email for the user
	uint8 role; // Role in MedalVerse (Admin, Author,)
	bool activ; // user is activ on the website
}

contract UserHandler is Ownable {
	// Data ---------------------------------
	mapping(address => User) _Users;
	address[] public registeredUsers; // List of Users registered to DAPP

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	// Events -------------------------------
	event UserAdded(address usrAddr, uint256 indx);

	// User Methods -------------------------

	///@dev Registers a User, given an address and all the details
	///@param _userAddress of the user to register as User
	///@param _iconURI UI for the user
	///@param _userName concatenation of first & last name
	///@param _email of the user to register as User
	///@param _role of the user to register as User
	function addUser(
		address _userAddress,
		string memory _iconURI,
		string memory _userName,
		string memory _email,
		uint8 _role
	) internal onlyOwner isNotNull(_userAddress) {
		// Copy to the structure
		_Users[_userAddress] = User({
			iconURI: _iconURI,
			userName: _userName,
			email: _email,
			role: _role,
			activ: true
		});
		// Push to the list of users so we can parse registered users.
		registeredUsers.push(_userAddress);
		emit UserAdded(_userAddress, registeredUsers.length - 1);
	}

	///@dev Returns details about a user, given an address (for UI=)
	///@param _userAdr of the user
	function getUserDetails(address _userAdr)
		external
		view
		isNotNull(_userAdr)
		returns (User memory)
	{
		return _Users[_userAdr];
	}
}
