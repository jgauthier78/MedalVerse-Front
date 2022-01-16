// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";
struct NFT_Medal_Bkg_Desc {
	address author; // Owner of the NFT
	address NFT_Bkg_Adr; //Address for the minted NFT (can be null)
	uint256 price; // Price for the corresponding NFT
	uint256 creationId; // Creation ref
	string description; // Its Description
	string URI; // URI for the image
}

///@dev Structure for describing MedalVerse Authors - used by AuthorHandler
struct Author {
	address userAddress; // address used as ref
	uint256[] creations; // list of creations saved in AuthorHandler
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
	modifier isNotNullUint256(uint256 a) virtual {
		require(a != 0);
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

		allAuthors[_user].userAddress = _user;
		allAuthors[_user].activ = true;
		emit AuthorAdded(_user, registeredAuthors.length - 1);
	}

	///@dev Register a creation for a given author
	///@param _user Address of the user to register as author
	///@param _price Price of the NFT
	///@param _description may be null
	///@param _URI Address of the image, used before minting the NFT
	function addCreation(
		address _user,
		uint256 _price,
		string memory _description,
		string memory _URI
	) external onlyOwner isNotNull(_user) {
		Author storage _author = allAuthors[_user];
		require(_author.activ, "ERR_0");
		uint256 allCreationCount = allCreations.length;
		allCreations.push();
		// Register the creation in the global list of creations
		allCreations[allCreationCount] = NFT_Medal_Bkg_Desc({
			price: _price,
			creationId: allCreationCount,
			author: _user,
			NFT_Bkg_Adr: address(0x00),
			description: _description,
			URI: _URI
		});

		// Save the index into the author Structure
		_author.creations.push(allCreationCount);
		emit CreationAdded(_user, allCreationCount);
	}

	///@dev Register a creation for a given author TESTED
	///@param _creationId index of the creation as registered in allCreations
	///@param _NFT Address of the minted NFT
	function affectNFTtoCreation(uint256 _creationId, address _NFT)
		external
		onlyOwner
		isNotNull(_NFT)
	{
		allCreations[_creationId].NFT_Bkg_Adr = _NFT;
	}

	///@dev returns the list of creations for user _author TESTED
	///@param _author address of the user
	function getAuthorCreationsList(address _author)
		external
		view
		isNotNull(_author)
		isNotNullUint256(allAuthors[_author].creations.length)
		returns (uint256[] memory)
	{
		return allAuthors[_author].creations;
	}

	///@dev returns the list of creations
	///@param _start start index  - paging
	///@param _end ending index - paging
	function getCreationList(uint256 _start, uint256 _end)
		external
		view
		isNotNullUint256(allCreations.length)
		returns (NFT_Medal_Bkg_Desc[] memory)
	{
		require(_start <= _end); // check params
		require(_start < allCreations.length, "ERR_1");

		// we adjust the ending value
		if (_end >= allCreations.length) _end = allCreations.length - 1;

		// creat an array for returning only usefull values
		NFT_Medal_Bkg_Desc[] memory _desc = new NFT_Medal_Bkg_Desc[](
			_end - _start + 1
		);

		// Fill the structure
		uint256 x = _start;
		while (x <= _end) {
			_desc[x - _start] = NFT_Medal_Bkg_Desc({
				price: allCreations[x].price,
				creationId: allCreations[x].creationId,
				author: allCreations[x].author,
				NFT_Bkg_Adr: allCreations[x].NFT_Bkg_Adr,
				description: allCreations[x].description,
				URI: allCreations[x].URI
			});

			x++;
		}
		return _desc;
	}

	///@dev returns the Author struc corresponding to the user TESTED
	///@param _user user address
	function getAuthor(address _user)
		external
		view
		isNotNull(_user)
		returns (Author memory)
	{
		return allAuthors[_user];
	}
}
