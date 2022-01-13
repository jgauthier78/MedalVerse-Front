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

	function addMedal(
		address _nft,
		uint256 oID,
		uint256 eID
	) internal {
		medalList.push(
			Medal({
				throwIn: _nft,
				winner: address(0),
				organizationID: oID,
				eventID: eID,
				isInWinnerGallery: false
			})
		);

		emit MedalAdded(medalList.length - 1, eID);
	}

	function getMedalCount() public view returns (uint256) {
		return medalList.length;
	}

	function getMedal(uint256 medalID)
		external
		view
		indexInRange(medalID)
		returns (Medal memory)
	{
		return medalList[medalID];
	}

	function setMedalWinner(uint256 medalID, address _winner)
		internal
		indexInRange(medalID)
	{
		medalList[medalID].winner = _winner;
	}

	function medalPublish(uint256 medalID, bool status)
		internal
		indexInRange(medalID)
	{
		medalList[medalID].isInWinnerGallery = status;
		emit MedalPublished(medalID, status);
	}
}
