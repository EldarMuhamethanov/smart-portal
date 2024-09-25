import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";

export type NetworkType = "mainnet" | "sepolia" | "hardhat";

export type ContractData = {
  address: string;
};

export class SmartContractsModel {
  contracts: ContractData[] = [];

  constructor() {
    this.contracts = [];
    makeAutoObservable(this);
  }

  checkContractExist(address: string): boolean {
    return this.contracts.some((contract) => contract.address === address);
  }

  addContract = (address: string) => {
    this.contracts = [...this.contracts, { address }];
    this._updateStorageData();
  };

  removeContract = (address: string) => {
    this.contracts = this.contracts.filter(
      (contract) => contract.address !== address
    );
    this._updateStorageData();
  };

  initState() {
    this.contracts =
      LocalStorage.getValue<ContractData[]>("smart-contracts") || [];
  }

  resetState() {
    this.contracts = [];
  }

  private _updateStorageData() {
    LocalStorage.setValue("smart-contracts", this.contracts);
  }
}
