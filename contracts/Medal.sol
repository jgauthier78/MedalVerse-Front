// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Medal is ERC20, Ownable {

    uint supplyMax = 20 * (10 ** 25);
    uint maxBurned = 10 * (10 ** 25);
    uint tokenBurned;

    mapping(address => uint256) private _balances;

    event $MedalBurned(address owner, uint amount);

    constructor() ERC20("$Medal", "$MDL"){
        _mint(msg.sender, supplyMax);
    }

    function _burn(address account, uint256 amount) internal virtual override(ERC20) {
        require(tokenBurned + amount < maxBurned, "Burn request exceeds maxBuned");

        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = _balances[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] = accountBalance - amount;
        }
        supplyMax -= amount;

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);

    }

    function getTokenBurned() public view returns(uint) {
        return tokenBurned;
    }
    
    function burn(uint amount) public onlyOwner {
        _burn(msg.sender, amount);

        emit $MedalBurned(msg.sender, amount);
    }
        
}