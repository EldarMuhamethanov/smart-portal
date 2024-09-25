import { connectToMetaMask } from "@/connectToMetamask";
import { LocalStorage } from "@/core/localStorage";
import { EnvironmentType } from "@/web3/Environment";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { SmartContractsModel } from "./SmartContractsModel";
import { AccountsModel } from "./AccountsModel";

export class EnvironmentModel {
  smartContracts: SmartContractsModel;
  accountsModel: AccountsModel;
  environment: EnvironmentType | null;
  web3: Web3 | null;

  constructor(
    smartContracts: SmartContractsModel,
    accountsModel: AccountsModel
  ) {
    this.smartContracts = smartContracts;
    this.accountsModel = accountsModel;
    this.environment = null;
    this.web3 = null;
    makeAutoObservable(this);
  }

  setEnvironment(env: EnvironmentType | undefined) {
    this.environment = env || null;
    this.smartContracts.resetState();
    this._createWeb3();
    this._updateLocalState();
  }

  async initState() {
    this.environment =
      LocalStorage.getValue<EnvironmentType>("environment") || null;
    if (!this.environment) {
      return;
    }
    this._createWeb3();
    this.smartContracts.initState();
  }

  private async _createWeb3() {
    if (this.environment === "metamask") {
      this.web3 = await connectToMetaMask();
    } else {
      this.web3 = new Web3("http://localhost:8545");
    }
  }

  private _updateLocalState() {
    LocalStorage.setValue("environment", this.environment);
  }
}
