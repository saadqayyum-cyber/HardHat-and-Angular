// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    address private bankContractAddress;

    constructor(address _bankContractAddress) ERC20("YieldToken", "FREE"){
        bankContractAddress = _bankContractAddress;
    }

    function mint(address _account, uint256 _amount) public onlyBank{
        _mint(_account, _amount);
    }

    modifier onlyBank {
        require(msg.sender == bankContractAddress, "Only Bank can mint tokens!");
        _;
    }
}

