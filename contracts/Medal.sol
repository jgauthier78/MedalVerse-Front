// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Medal is ERC20, Ownable {

    uint supplyMax = 20 * (10 ** 25);
    uint maxBurned = 10 * (10 ** 25);
    uint tokenBurned;

    constructor() ERC20("$Medal", "$MDL"){
        _mint(msg.sender, supplyMax);
    }

    function burn(uint amount) public onlyOwner {
        require(tokenBurned + amount > maxBurned);
        _burn(msg.sender, amount);
    }

    function getTokenBurned() public view returns(uint) {
        return tokenBurned;
    }
        
}