// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract SimpleStorage
{
  uint storedData = 5;

  function set( uint x ) public
  {
    storedData = x;
  }

  function get() public view returns ( uint256 )
  {
    return storedData;
  }
}
