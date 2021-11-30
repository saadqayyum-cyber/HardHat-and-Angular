const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const BankContract = await ethers.getContractFactory("Bank");
    let bank = await BankContract.deploy();
    await bank.deployed();
    console.log("The Bank Contract was deployed to: ", bank.address);

    const TokenContract = await ethers.getContractFactory("Token");
    let token = await TokenContract.deploy(bank.address);
    await token.deployed();
    console.log("The Token Contract was deployed to: ", token.address);


    let addresses = {bankContract : bank.address, tokenContract: token.address};
    let addressesJSON = JSON.stringify(addresses); // Converts to JSON
    fs.writeFileSync("environment/contract-address.json", addressesJSON);
}

main()
.then(() => {
    process.exit(0);
})
.catch((error) => {
    console.error(error);
    process.exit(1);    
})