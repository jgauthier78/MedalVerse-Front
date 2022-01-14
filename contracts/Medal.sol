// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Medal is ERC20, Ownable {
	uint256 supplyMax = 20 * (10**25); // Supply max
	uint256 maxBurned = 10 * (10**25); // Max token burn
	uint256 tokenBurned; // Number token burn

	event $MedalBurned(address owner, uint256 amount);

	constructor() ERC20("$Medal", "$MDL") {
		_mint(msg.sender, supplyMax); //
	}

	///@dev indicated the already burn token number
	///@return Burn token Number
	function getTokenBurned() external view returns (uint256) {
		return tokenBurned;
	}

	///@dev Burn the indicated amount of token
	///@param amount Amount to burn
	function burn(uint256 amount) external onlyOwner {
		require(tokenBurned + amount <= maxBurned, "ERR_F"); // Check that the amount + the number already burned does not exceed the maximum amount to burn
		_burn(msg.sender, amount);

		tokenBurned += amount;

		emit $MedalBurned(msg.sender, amount);
	}
}


