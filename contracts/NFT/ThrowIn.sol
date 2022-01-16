// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ThrowIn is ERC721, Ownable {
	// Data --------------------------------
	uint256 mintCount;
	uint256 MDL_Mint_Royalties = 500 * (10**18);
	uint256 year;
	address medalVerse;
	IERC721Metadata NFT_Artist; // Recovering an ERC721 interface
	IERC20 private Token; // Recovering an ERC20 interface

	Winner[] public winnersArray; // Winner structure array
	uint256[] public yearOfEditionArray; // Stock up on the years where the competition takes place

	mapping(address => Winner) public winnerMap; // Associate a winner structure with an address
	mapping(uint256 => string) public uriToken; // Associate the token id and the uri
	mapping(uint256 => address) public winnerByYearMap; // Year -> Winners array

	string nameOfOrganization;
	string uri;
	bool antiDoping;
	bool pause;

	// Modifiers ----------------------------
	///@dev Check that the address is not zero
	modifier isNotNull(address a) virtual {
		require(a != address(0), "ERR_8");
		_;
	}

	///@dev Check that the contract is paused
	modifier whenPaused() {
		require(pause == true, "ERR_9");
		_;
	}

	///@dev Check that the contract is not paused
	modifier whenNotPaused() {
		require(pause == false, "ERR_A:");
		_;
	}

	modifier checkAntiDoping() {
		require(antiDoping == true, "ERR_B");
		_;
	}
	modifier notMinted() {
		require(mintCount == 0, "ERR_C"); // Check if the nft has already been mint
		_;
	}
	// Events ---------------------------------
	event throwInCupMinted(address mint);
	event throwInWinnersAdd(address organizer, address winners);
	event throwInSetPause(bool check);
	event throwInPauseRemoved(bool check);
	event throwInTranserWithoutPermission(
		address caller,
		address recipient,
		uint256 id
	);
	event throwInSetYear(uint256 whatYear);
	event throwInOwnerRecovery(address caller, address recipient, uint256 id);

	// Methods -------------------------------

	constructor(
		string memory organization,
		address addressNFT_Artist,
		address addressToken,
		address addressMedalVerse,
		string memory name,
		string memory symbol,
		bool _antiDoping
	) ERC721(name, symbol) {
		IERC721Metadata(addressNFT_Artist).supportsInterface(
			type(IERC721).interfaceId
		);
		nameOfOrganization = organization;
		NFT_Artist = IERC721Metadata(addressNFT_Artist);
		Token = IERC20Metadata(addressToken);
		medalVerse = addressMedalVerse;
		name = name;
		symbol = symbol;
		antiDoping = _antiDoping;
	}

	///@dev Structure to describe the winner
	struct Winner {
		string playerName; // Name of winner
		uint256[] year; // All the years of victory
		uint256 numberOfVictory; // Number of victory of player or team
	}

	///@dev Mint the only possible edition of the NFT Cup
	///@param tokenId Token id of the NFTA Artist got the Uri
	function mintCup(uint256 tokenId)
		external
		onlyOwner
		whenNotPaused
		notMinted
	{
		uint256 balance = Token.balanceOf(msg.sender); // Check the minter balance

		require(balance > MDL_Mint_Royalties); // Check the balance is greater than the price
		Token.transferFrom(msg.sender, medalVerse, MDL_Mint_Royalties); //.Transfer amount token to MedalVerse

		uri = IERC721Metadata(NFT_Artist).tokenURI(tokenId); // Get the uri of the NFTArtist
		mintCount++; // increment the number of NFT mint
		uriToken[mintCount] = uri; // Set the uri of the mint token
		emit throwInCupMinted(msg.sender);

		_mint(msg.sender, mintCount); // Mint the NFT
	}

	///@dev Ensures that only the owner can move the nft when the contract is paused
	///@param from NFT owner address
	///@param to address receiving the NFT
	///@param tokenId Token ID to transfer
	function _beforeTokenTransfer(
		address from,
		address to,
		uint256 tokenId
	) internal virtual override {
		super._beforeTokenTransfer(from, to, tokenId);
		address ownerContract = owner();

		if (ownerContract != msg.sender) {
			require(!pause, "ERR_D");
		}
	}

	///@dev Recovery of NFT without the athlete's consent
	///@param from NFT owner address
	///@param tokenId ID to transfer
	function safeTransferFromWithoutPermission(address from, uint256 tokenId)
		external
		onlyOwner
		checkAntiDoping
		whenPaused
	{
		_safeTransfer(from, msg.sender, tokenId, "");

		emit throwInTranserWithoutPermission(msg.sender, from, tokenId);
	}

	///@dev Recover the NFT to restart the competition
	///@param from NFT owner address
	///@param tokenId ID to transfer
	function organisazionRecovery(address from, uint256 tokenId)
		external
		onlyOwner
		whenNotPaused
	{
		_safeTransfer(from, msg.sender, tokenId, "");

		emit throwInOwnerRecovery(msg.sender, from, tokenId);
	}

	///@dev pause the contract
	function setPaused() external onlyOwner checkAntiDoping whenNotPaused {
		pause = true;

		emit throwInSetPause(pause);
	}

	///@dev unpause the contract
	function removePaused() external onlyOwner checkAntiDoping whenPaused {
		pause = false;

		emit throwInPauseRemoved(pause);
	}

	///@dev Set the year of the compet
	///@param competYear Current year
	function setYear(uint256 competYear) external onlyOwner whenNotPaused {
		year = competYear;

		emit throwInSetYear(competYear);
	}

	///@dev Add winners to the Winners array and modify its structure associated with this wallet
	///@param walletPlayer winner's addressNumber
	///@param name winner's name
	function addWinner(string memory name, address walletPlayer)
		external
		onlyOwner
		isNotNull(walletPlayer)
		whenNotPaused
	{
		require(year != 0, "ERR_E");

		// Define the winner structure
		winnerMap[walletPlayer].playerName = name;
		winnerMap[walletPlayer].year.push(year);
		winnerMap[walletPlayer].numberOfVictory += 1;

		yearOfEditionArray.push(year);

		winnersArray.push(
			Winner(
				winnerMap[walletPlayer].playerName,
				winnerMap[walletPlayer].year,
				winnerMap[walletPlayer].numberOfVictory
			)
		); // Push the structure into the winner array

		emit throwInWinnersAdd(msg.sender, walletPlayer);
	}

	// Methods View-------------------------------

	///@return Return all winners by name and assigned number
	function getAllWinners()
		external
		view
		returns (string[] memory, uint256[] memory)
	{
		string[] memory winnersString = new string[](winnersArray.length); // Instantiate a string array the length of the winners array
		uint256[] memory yearsOfVictory = new uint256[](
			yearOfEditionArray.length
		); // Instantiate a uint array the length of the yearOfParticipationArray

		// Loop that goes through all the name of the winner and copies it as well as the production years of the competition
		for (uint256 i = 0; i < winnersArray.length; i++) {
			winnersString[i] = winnersArray[i].playerName;
			yearsOfVictory[i] = yearOfEditionArray[i];
		}

		return (winnersString, yearsOfVictory);
	}

	///@return Return the structure of the winner as well as the table of years
	function viewAllYearVictoryByAddress(address winner)
		external
		view
		isNotNull(winner)
		returns (uint256[] memory)
	{
		return (winnerMap[winner].year);
	}

	///@return returns a chosen year without the victorious years table
	///@param winner Address of a winner register
	///@param number Number selected from the list
	function viewThisVictoryByAddress(address winner, uint256 number)
		external
		view
		isNotNull(winner)
		returns (uint256)
	{
		return (winnerMap[winner].year[number]);
	}

	///@return Returns if the contract is paused or not
	function paused() external view returns (bool) {
		return pause;
	}

	///@dev Get the org who created the NFT
	///@return return the organization name
	function getOrganizationName() external view returns (string memory) {
		return nameOfOrganization;
	}

	///@return year of the current competition
	function getYearOfCompetition() public view returns (uint256) {
		return year;
	}
}
