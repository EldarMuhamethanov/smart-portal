import { makeAutoObservable } from "mobx";

export class AccountsModel {
  accounts: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  updateAccounts(accounts: string[]) {
    this.accounts = accounts;
  }
}
