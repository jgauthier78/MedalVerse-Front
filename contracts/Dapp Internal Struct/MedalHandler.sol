// SPDX-License-Identifier: MIT
pragma solidity ^0.8;
import "@openzeppelin/contracts/access/Ownable.sol";

struct Medal {
	address throwIn; // Address of the NFT
	address winner; // Address of the Winner
	uint256 organizationID; // Id of the org
	uint256 eventID; // Id of Event
	bool isInWinnerGallery; // sportsman wants to publish the medal in his gallery
}

contract MedalHandler is Ownable {
	Medal[] medalList; // Global List of Medals

	// Modifiers -------------------------------
	modifier indexInRange(uint256 medalID) {
		require(medalID < medalList.length, "ERR_1");
		_;
	}
	// Events -------------------------------
	event MedalAdded(uint256 medalID, uint256 eventID);
	event MedalPublished(uint256 medalID, bool status);

	// Methods -------------------------------

	///@dev Add a medal to the list of available Medals
	///@param orgID id of the organization
	///@param evntID id of the event
	function addMedal(
		address _nft,
		uint256 orgID,
		uint256 evntID
	) internal {
		medalList.push(
			Medal({
				throwIn: _nft,
				winner: address(0),
				organizationID: orgID,
				eventID: evntID,
				isInWinnerGallery: false
			})
		);

		emit MedalAdded(medalList.length - 1, evntID);
	}

	///@dev Returns the number of medal in the contract
	function getMedalCount() public view returns (uint256) {
		return medalList.length;
	}

	///@dev Returns the nmedal for a specific id
	///@param medalID id of the Medal to get
	function getMedal(uint256 medalID)
		external
		view
		indexInRange(medalID)
		returns (Medal memory)
	{
		return medalList[medalID];
	}

	///@dev Affects the id of the Winner to the Medal
	///@param medalID id of the Medal to set
	///@param _winner address of the Winner
	function setMedalWinner(uint256 medalID, address _winner)
		internal
		indexInRange(medalID)
	{
		medalList[medalID].winner = _winner;
	}

	///@dev Allow the medal to be published in the gallery
	///@param medalID id of the Medal to set
	///@param status published or not
	function medalPublish(uint256 medalID, bool status)
		internal
		indexInRange(medalID)
	{
		medalList[medalID].isInWinnerGallery = status;
		emit MedalPublished(medalID, status);
	}
}
