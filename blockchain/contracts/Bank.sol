// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract Bank {
    mapping(address => uint256) public accounts;

    constructor() {}

    function totalAssets() external view returns(uint256) {
        return address(this).balance;
    }

    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0 Ether");
        accounts[msg.sender] += msg.value;
    }

    function withdraw(uint256 _amount, address _tokenContractAddress) external {
        require(_amount <= accounts[msg.sender], "Not have enough balance!");

        accounts[msg.sender] -= _amount;
        payable(msg.sender).transfer(_amount);

        Token yieldToken = Token(_tokenContractAddress);
        yieldToken.mint(msg.sender, 1);

    }
}