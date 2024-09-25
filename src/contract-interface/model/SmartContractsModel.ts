import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";
import {
  addContractModel,
  removeContractModel,
  resetContractsModel,
} from "./AppModel";

export type NetworkType = "mainnet" | "sepolia" | "hardhat";

export class SmartContractsModel {
  contracts: string[] = [];

  constructor() {
    this.contracts = [];
    makeAutoObservable(this);
  }

  checkContractExist(address: string): boolean {
    return this.contracts.some((contract) => contract === address);
  }

  addContract = (address: string) => {
    this.contracts = [...this.contracts, address];
    addContractModel(address);
    this._updateStorageData();
  };

  removeContract = (address: string) => {
    this.contracts = this.contracts.filter((contract) => contract !== address);
    removeContractModel(address);
    this._updateStorageData();
  };

  initState() {
    this.contracts = LocalStorage.getValue<string[]>("smart-contracts") || [];
    this.contracts.forEach(addContractModel);
  }

  resetState() {
    this.contracts = [];
    resetContractsModel();
  }

  private _updateStorageData() {
    LocalStorage.setValue("smart-contracts", this.contracts);
  }
}
