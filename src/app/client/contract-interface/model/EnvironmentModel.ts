import { connectToMetaMask } from "@/web3/connectToMetamask";
import { LocalStorage } from "@/core/localStorage";
import { EnvironmentType } from "@/web3/Environment";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { SmartContractsModel } from "./SmartContractsModel";
import { AccountsModel } from "./AccountsModel";
import { ContractCardModel } from "./ContractCard/ContractCardModel";

const DEFAULT_RPC_ENDPOINT = "http://localhost:8545";

export class EnvironmentModel {
  smartContracts: SmartContractsModel;
  accountsModel: AccountsModel;
  environment: EnvironmentType | null;
  rpcEndpoint: string = DEFAULT_RPC_ENDPOINT;
  rpcEndpointError: boolean = false;
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
    try {
      await this._createWeb3();
      await this._updateAccounts();
      this._updateLocalState();
      this._updateRPCEndpointInStorage();
      this.smartContracts.resetState();
    } catch {
      this.rpcEndpointError = true;
      this.web3 = null;
    }
  }

  async updateRPCEndpoint(endpoint: string) {
    this.rpcEndpoint = endpoint;
    this.setEnvironment(this.environment!);
  }

  async initState() {
    this.environment =
      LocalStorage.getValue<EnvironmentType>("environment") || null;
    if (!this.environment) {
      return;
    }
    if (this.environment !== "metamask") {
      this.rpcEndpoint = this._getEndpointFromStorage();
    }
    try {
      await this._createWeb3();
      await this._updateAccounts();
      this.smartContracts.initState();
    } catch {
      this.rpcEndpointError = true;
      this.web3 = null;
    }
  }

  private async _createWeb3() {
    if (this.environment === "metamask") {
      this.web3 = await connectToMetaMask();
    } else {
      this.web3 = new Web3(this.rpcEndpoint);
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

  private _updateRPCEndpointInStorage() {
    if (this.rpcEndpoint) {
      LocalStorage.setValue("rpc-endpoint", this.rpcEndpoint);
    } else {
      LocalStorage.removeValue("rpc-endpoint");
    }
  }

  private _getEndpointFromStorage(): string {
    return LocalStorage.getValue("rpc-endpoint") || DEFAULT_RPC_ENDPOINT;
  }
}
