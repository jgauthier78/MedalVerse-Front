// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Medal is ERC20, Ownable {
	uint256 supplyMax = 20 * (10**25); // Supply max
	uint256 maxBurned = 10 * (10**25); // Max token burn
	uint256 tokenBurned; // Number token burn

	mapping(address => uint256) private _balances;

	event $MedalBurned(address owner, uint256 amount);

	constructor() ERC20("$Medal", "$MDL") {
		_mint(msg.sender, supplyMax); //
	}

	///@dev override of the function provided by openzeppelin to add a require
	function _burn(address account, uint256 amount)
		internal
		virtual
		override(ERC20)
	{
		require(tokenBurned + amount < maxBurned, "ERR_F"); // require add . Check that the amount + the number already burned does not exceed the maximum amount to burn

		require(account != address(0), "ERR_8");

		_beforeTokenTransfer(account, address(0), amount);

		uint256 accountBalance = _balances[account];
		require(accountBalance >= amount, "ERR_G");
		unchecked {
			_balances[account] = accountBalance - amount;
		}
		supplyMax -= amount;

		emit Transfer(account, address(0), amount);

		_afterTokenTransfer(account, address(0), amount);
	}

	///@dev indicated the already burn token number
	///@return Burn token Number
	function getTokenBurned() public view returns (uint256) {
		return tokenBurned;
	}

	///@dev Burn the indicated amount of token
	///@param amount Amount to burn
	function burn(uint256 amount) public onlyOwner {
		_burn(msg.sender, amount);

		emit $MedalBurned(msg.sender, amount);
	}
}
