declare let window: any;

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ethers } from 'ethers';
import addresses from '../../environment/contract-address.json';
import Bank from '../../blockchain/artifacts/blockchain/contracts/Bank.sol/Bank.json';
import Token from '../../blockchain/artifacts/blockchain/contracts/Token.sol/Token.json';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  depositForm: FormGroup;
  withdrawForm: FormGroup;

  signer: any;

  bankContract: any;
  tokenContract: any;

  userTotalAssets: any;
  userTotalToken: any;
  totalAssets: any;
  signerAddress: any;

  constructor() {
    this.depositForm = new FormGroup({
      DepositAmount: new FormControl()
    });

    this.withdrawForm = new FormGroup({
      WithdrawAmount: new FormControl()
    });
  }

  async deposit() {
    const tx = await this.bankContract.deposit({
      value: ethers.utils.parseEther(this.depositForm.value.DepositAmount.toString())
    });
    await tx.wait();

    this.depositForm.reset();
    window.location.reload();
  }

  async withdraw() {
    const tx = await this.bankContract.withdraw(
      ethers.utils.parseEther(this.withdrawForm.value.WithdrawAmount.toString()),
      addresses.tokenContract
    );

    await tx.wait();
    this.withdrawForm.reset();
    window.location.reload();
  }


  async ngOnInit() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send("eth_requestAccounts", []);
    this.signer = provider.getSigner();

    provider.on("network", (newNetwork: any, oldNetwork: any) => {
      if(oldNetwork) {
        window.location.reload();
      }
    });

    
    if(this.signer.getChainId() !== 3) {
      alert("Please change your network to ropsten testnet!");
    }

    this.bankContract = new ethers.Contract(addresses.bankContract, Bank.abi, this.signer);
    this.tokenContract = new ethers.Contract(addresses.tokenContract, Token.abi, this.signer);

    this.userTotalAssets =  ethers.utils.formatEther(await this.bankContract.accounts(await this.signer.getAddress()));
    this.userTotalToken = await this.tokenContract.balanceOf(await this.signer.getAddress());
    this.totalAssets = ethers.utils.formatEther(await this.bankContract.totalAssets()); 
    this.signerAddress = await this.signer.getAddress();
  }

}
