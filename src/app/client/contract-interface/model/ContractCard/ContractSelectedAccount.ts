import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";
import { EnvironmentModel } from "../env/EnvironmentModel";

export type SelectedAccountData = {
  address: string;
  balance: string | null;
};

export class ContractSelectedAccount {
  selectedAccount: SelectedAccountData | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _updateBalanceSubscription: null | any = null;
  private _contractAddress: string;
  private _environmentModel: EnvironmentModel;

  constructor(contractAddress: string, environmentModel: EnvironmentModel) {
    this._contractAddress = contractAddress;
    this._environmentModel = environmentModel;
    makeAutoObservable(this);
  }

  setSelectedAccount(address: string | null) {
    this.selectedAccount = address
      ? {
          address,
          balance: null,
        }
      : null;
    this._updateSelectedAccountStorageState();
    this._updateSelectedAccountBalance();
    if (this.selectedAccount) {
      this._subscribeToNewBlockCreated();
    } else {
      this._unsubscribeNewBlockCreated();
    }
  }

  setSelectedAccountBalance = (balance: string) => {
    if (this.selectedAccount) {
      this.selectedAccount.balance = balance.toString();
    }
  };

  initState() {
    this.selectedAccount =
      LocalStorage.getValue(
        `contract-${this._contractAddress}-selected-account`
      ) || null;

    this._updateSelectedAccountBalance();

    if (this.selectedAccount) {
      this._subscribeToNewBlockCreated();
    } else {
      this._unsubscribeNewBlockCreated();
    }
  }

  private _subscribeToNewBlockCreated() {
    if (
      !this._environmentModel.web3 ||
      this._environmentModel.environment !== "metamask"
    ) {
      return;
    }
    this._updateBalanceSubscription = this._environmentModel.web3.eth.subscribe(
      "newBlockHeaders",
      () => {
        this._updateSelectedAccountBalance();
      }
    );
  }

  private _unsubscribeNewBlockCreated() {
    if (
      !this._environmentModel.web3 ||
      !this._updateBalanceSubscription ||
      this._environmentModel.environment === "hardhat"
    ) {
      return;
    }
    this._updateBalanceSubscription.unsubscribe();
  }

  private async _updateSelectedAccountBalance() {
    if (!this._environmentModel.web3 || !this.selectedAccount) {
      return;
    }
    const balance = await this._environmentModel.web3.eth.getBalance(
      this.selectedAccount.address
    );
    this.setSelectedAccountBalance(balance.toString());
    this._updateSelectedAccountStorageState();
  }

  private _updateSelectedAccountStorageState() {
    LocalStorage.setValue(
      `contract-${this._contractAddress}-selected-account`,
      this.selectedAccount
    );
  }
}
