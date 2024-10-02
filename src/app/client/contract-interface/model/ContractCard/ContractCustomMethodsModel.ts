import { ContractMethod } from "@/app/client/contract-interface/view/contract-card/types";
import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";

export type CustomMethodData = ContractMethod & {
  id: string;
  aliasName?: string;
};

export class ContractCustomMethodsModel {
  customMethods: CustomMethodData[] = [];
  methodToResult: Record<string, string[]> = {};
  transactionToResult: Record<string, object> = {};
  methodToError: Record<string, string> = {};
  expanded: boolean = false;

  private _contractAddress: string;

  constructor(contractAddress: string) {
    this._contractAddress = contractAddress;
    makeAutoObservable(this);
  }

  initState() {
    this.customMethods = this._getCustomMethodsFromStorage();
    this.expanded = this._getCustomMethodsExpandedFromStorage();
  }

  getMethodById = (id: string) => {
    return this.customMethods.find((method) => method.id == id) || null;
  };

  setMethodResult = (methodName: string, result: string[]) => {
    this.methodToResult[methodName] = result;
  };

  setTransactionResult = (methodName: string, result: object) => {
    this.transactionToResult[methodName] = result;
  };

  setMethodError = (methodName: string, error: string) => {
    this.methodToError[methodName] = error;
  };

  clearMethodResult = (methodName: string) => {
    delete this.methodToResult[methodName];
  };

  clearTransactionResult = (methodName: string) => {
    delete this.transactionToResult[methodName];
  };

  clearMethodError = (methodName: string) => {
    delete this.methodToError[methodName];
  };

  setExpanded = (expanded: boolean) => {
    this.expanded = expanded;
    this._updateCustomMethodsExpandedInStorage();
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
  private _getCustomMethodsExpandedFromStorage() {
    return (
      LocalStorage.getValue<boolean>(
        `contract-${this._contractAddress}-custom-methods-expanded`
      ) || false
    );
  }

  private _updateCustomMethodsExpandedInStorage() {
    LocalStorage.setValue<boolean>(
      `contract-${this._contractAddress}-custom-methods-expanded`,
      this.expanded
    );
  }
}
