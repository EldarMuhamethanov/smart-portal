import { connectToMetaMask } from "@/connectToMetamask";
import { LocalStorage } from "@/core/localStorage";
import { EnvironmentType } from "@/web3/Environment";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { SmartContractsModel } from "./SmartContractsModel";
import { AccountsModel } from "./AccountsModel";
import { ContractCardModel } from "./ContractCard/ContractCardModel";

export class EnvironmentModel {
  smartContracts: SmartContractsModel;
  accountsModel: AccountsModel;
  environment: EnvironmentType | null;
  web3: Web3 | null;
  contractsModelsMap: Record<string, ContractCardModel> = {};

  constructor(
    smartContracts: SmartContractsModel,
    accountsModel: AccountsModel,
    contractsModelsMap: Record<string, ContractCardModel>
  ) {
    this.contractsModelsMap = contractsModelsMap;
    this.smartContracts = smartContracts;
    this.accountsModel = accountsModel;
    this.environment = null;
    this.web3 = null;
    makeAutoObservable(this);
  }

  async setEnvironment(env: EnvironmentType | undefined) {
    this.environment = env || null;
    this.smartContracts.resetState();
    await this._createWeb3();
    await this._updateAccounts();
    this._updateLocalState();
  }

  async initState() {
    this.environment =
      LocalStorage.getValue<EnvironmentType>("environment") || null;
    if (!this.environment) {
      return;
    }
    await this._createWeb3();
    await this._updateAccounts();
    this.smartContracts.initState();
  }

  private async _createWeb3() {
    if (this.environment === "metamask") {
      this.web3 = await connectToMetaMask();
    } else {
      this.web3 = new Web3("http://localhost:8545");
    }
  }

  private async _updateAccounts() {
    if (this.web3) {
      const accounts = await this.web3.eth.getAccounts();
      this.accountsModel.updateAccounts(accounts);

      Object.values(this.contractsModelsMap).forEach((model) => {
        model.setSelectedAccount(accounts[0]);
      });
    }
  }

  private _updateLocalState() {
    LocalStorage.setValue("environment", this.environment);
  }
}
