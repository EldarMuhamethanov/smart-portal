import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";

const DEFAULT_GAS_VALUE = "3000000";

export class ContractGasModel {
  custom: boolean = false;
  customGasValue: string = DEFAULT_GAS_VALUE;

  private _contractAddress: string;

  constructor(contractAddress: string) {
    this._contractAddress = contractAddress;
    makeAutoObservable(this);
  }

  setCustom = (custom: boolean) => {
    this.custom = custom;
  };

  setCustomGasValue = (customGasValue: string) => {
    this.customGasValue = customGasValue;
  };

  initState() {
    this._restoreDataFromLocalStorage();
  }

  _restoreDataFromLocalStorage = () => {
    this.custom =
      LocalStorage.getValue(`contract-${this._contractAddress}-gas-custom`) ||
      false;
    this.customGasValue =
      LocalStorage.getValue(`contract-${this._contractAddress}-gas-value`) ||
      DEFAULT_GAS_VALUE;
  };

  _updateDataInLocalStorage = () => {
    LocalStorage.setValue(
      `contract-${this._contractAddress}-gas-custom`,
      this.custom
    );
    LocalStorage.setValue(
      `contract-${this._contractAddress}-gas-value`,
      this.customGasValue
    );
  };
}
