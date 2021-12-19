// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./NFT_Medal_Bkg_Desc.sol";

///@dev Structure for describing MedalVerse Authors - used by AuthorHandler
struct Author {
	address userAddress; // address used as ref
	mapping(uint256 => uint256) creations; // list of creations saved in AuthorHandler
	uint256 creationCount; // Number of creations
	bool activ;
}

///@dev Contract Adding / Removing Authors and their creations
contract AuthorHandler is Ownable {
	// Data ---------------------------------
	// - Authors -
	mapping(address => Author) allAuthors; // Container for all the authors by address
	address[] public registeredAuthors; // Array of all the authors addresses

	// - Creations -
	NFT_Medal_Bkg_Desc[] public allCreations; // Container for all the creations made by authors

	// Modifiers ----------------------------
	modifier isNotNull(address a) virtual {
		require(a != address(0));
		_;
	}

	// Events -------------------------------
	event AuthorAdded(address usrAddr, uint256 indx);
	event CreationAdded(address usrAddr, uint256 indx);

	// Methods -------------------------------
	///@dev Register an author, given an address
	///@param _user Address of the user to register as author
	function addAuthor(address _user) internal onlyOwner isNotNull(_user) {
		registeredAuthors.push(_user);
		Author storage _author = allAuthors[_user];
		_author.userAddress = _user;
		_author.activ = true;
		emit AuthorAdded(_user, registeredAuthors.length - 1);
	}

	///@dev Register a creation for a given author
	///@param _user Address of the user to register as author
	///@param _price Price of the NFT
	///@param _sportCategory Category for UI
	///@param _description may be null
	///@param _URI Address of the image, used before minting the NFT
	function addCreation(
		address _user,
		uint256 _price,
		uint256 _sportCategory,
		string memory _description,
		string memory _URI
	) public onlyOwner isNotNull(_user) {
		Author storage _author = allAuthors[_user];
		require(_author.activ, "Author must be activ to add Creation");
		uint256 allCreationCount = allCreations.length;
		allCreations.push();
		// Register the creation in the global list of creations
		allCreations[allCreationCount] = NFT_Medal_Bkg_Desc({
			price: _price,
			creationId: allCreationCount,
			sportCategory: _sportCategory,
			author: _user,
			NFT_Bkg_Adr: address(0x00),
			description: _description,
			URI: _URI,
			activ: true
		});

		// Save the index into the author Structure
		_author.creations[_author.creationCount++] = allCreationCount;
		emit CreationAdded(_user, allCreationCount);
	}

	///@dev Register a creation for a given author
	///@param _creationId index of the creation as registered in allCreations
	///@param _NFT Address of the minted NFT
	function affectNFTtoCreation(uint256 _creationId, address _NFT)
		public
		onlyOwner
		isNotNull(_NFT)
	{
		allCreations[_creationId].NFT_Bkg_Adr = _NFT;
	}
}
