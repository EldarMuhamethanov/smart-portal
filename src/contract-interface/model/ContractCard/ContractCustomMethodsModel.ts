import { ContractMethod } from "@/contract-interface/view/contract-card/types";
import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";

export type CustomMethodData = ContractMethod & {
  id: string;
  aliasName?: string;
};

export class ContractCustomMethodsModel {
  customMethods: CustomMethodData[] = [];

  private _contractAddress: string;

  constructor(contractAddress: string) {
    this._contractAddress = contractAddress;
    makeAutoObservable(this);
  }

  initState() {
    this.customMethods = this._getCustomMethodsFromStorage();
  }

  getMethodById = (id: string) => {
    return this.customMethods.find((method) => method.id == id) || null;
  };

  addCustomMethod = (contractMethod: CustomMethodData) => {
    this.customMethods.push(contractMethod);
    this._updateCustomMethodsInStorage();
  };

  removeCustomMethod = (id: string) => {
    this.customMethods = this.customMethods.filter(
      (method) => method.id !== id
    );
    this._updateCustomMethodsInStorage();
  };

  private _getCustomMethodsFromStorage() {
    return (
      LocalStorage.getValue<CustomMethodData[]>(
        `contract-${this._contractAddress}-custom-methods`
      ) || []
    );
  }

  private _updateCustomMethodsInStorage() {
    LocalStorage.setValue<CustomMethodData[]>(
      `contract-${this._contractAddress}-custom-methods`,
      this.customMethods
    );
  }
}
