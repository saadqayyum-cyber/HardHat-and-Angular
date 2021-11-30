const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank Contract", () => {

    let bank, token, owner, address_1, address_2;
    let addresses;

    beforeEach(async () => {
        const BankContract = await ethers.getContractFactory("Bank");
        bank = await BankContract.deploy();
        await bank.deployed();

        const TokenContract = await ethers.getContractFactory("Token");
        token = await TokenContract.deploy(bank.address);
        await token.deployed();

        // getSigners() will accounts which have their private key available
        // Having private key means they are signers.
        // In Hardhat Network or Ganache we have private key of every account.
        // So this func returns array of account objects.
        // owner is 1st account in array, address_1 is 2nd, address_2 is 3rd.
        // ... address ??? Unknown
        [owner, address_1, address_2, ...addresses] = await ethers.getSigners();
    });

    describe("Deployment", () => {
        it("Should have total assests 0", async () => {
            expect(await bank.totalAssets()).to.equal("0");
        });

        it("Owner should have 0 token and 0 account balance", async () => {
            expect(await token.balanceOf(owner.address)).to.equal("0");
            expect(await bank.accounts(owner.address)).to.equal("0");
        });
        it("Account1 should have 0 token and 0 account balance", async () => {
            expect(await token.balanceOf(address_1.address)).to.equal("0");
            expect(await bank.accounts(address_1.address)).to.equal("0");
        });
        it("Account2 should have 0 token and 0 account balance", async () => {
            expect(await token.balanceOf(address_2.address)).to.equal("0");
            expect(await bank.accounts(address_2.address)).to.equal("0");
        });
    });

    describe("Deposit and Withdrawl", () => {
        const oneEth = ethers.utils.parseEther("1.0");

        it("Should let owner deposit 1 ether,then total assets should be 1 and owner account balance should be 1", async() => {
            await bank.connect(owner).deposit({value: oneEth});
            expect(await bank.totalAssets()).to.equal(oneEth);
            expect(await bank.accounts(owner.address)).to.equal(oneEth);
        });

        it("Should let account1 deposit and withdraw 1 ether and then he have 1 FREE", async () => {
            await bank.connect(address_1).deposit({value: oneEth});
            await bank.connect(address_1).withdraw(oneEth, token.address);
            expect(await bank.totalAssets()).to.equal("0");
            expect(await token.balanceOf(address_1.address)).to.equal("1");
        });

        it("Should fail when trying to withdraw money you haven't deposited", async () => {
            await expect(bank.connect(address_2).withdraw(oneEth, token.address)).to.be.revertedWith("Not have enough balance!");
        });
    });
});