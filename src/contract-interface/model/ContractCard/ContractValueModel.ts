import { makeAutoObservable } from "mobx";

export type CurrencyType = "ether" | "wei" | "gwei" | "finney";

export class ContractValueModel {
  value: string = "0";
  selectedCurrency: CurrencyType = "ether";
  constructor() {
    makeAutoObservable(this);
  }

  setValue(newValue: string) {
    this.value = newValue;
  }

  setSelectedCurrency(newCurrency: CurrencyType) {
    this.selectedCurrency = newCurrency;
  }
}
