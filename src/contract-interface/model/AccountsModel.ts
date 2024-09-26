import { makeAutoObservable } from "mobx";

export class AccountsModel {
  accounts: string[] = [];

  constructor() {
    this.accounts = [];
    makeAutoObservable(this);
  }

  updateAccounts(accounts: string[]) {
    this.accounts = accounts;
  }
}
