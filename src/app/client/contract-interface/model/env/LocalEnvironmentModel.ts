import { LocalStorage } from "@/core/localStorage";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { AccountsModel } from "../AccountsModel";
import { ContractCardModel } from "../ContractCard/ContractCardModel";
import { SmartContractsModel } from "../SmartContractsModel";
import { IEvnModel } from "./types";

const DEFAULT_RPC_ENDPOINT = "http://localhost:8545";

export class LocalEnvironmentModel implements IEvnModel {
  web3: Web3 | null = null;
  rpcEndpoint: string = DEFAULT_RPC_ENDPOINT;
  rpcEndpointError: boolean = false;

  private _accountsModel: AccountsModel;
  private _smartContracts: SmartContractsModel;
  private _contractsModelsMap: Record<string, ContractCardModel>;

  constructor(
    smartContracts: SmartContractsModel,
    accountsModel: AccountsModel,
    contractsModelsMap: Record<string, ContractCardModel>
  ) {
    this._accountsModel = accountsModel;
    this._smartContracts = smartContracts;
    this._contractsModelsMap = contractsModelsMap;
    makeAutoObservable(this);
  }

  get chainIdError() {
    return false;
  }

  initState = async () => {
    await this._recreateWeb3();
  };

  updateState = async () => {
    this._smartContracts.resetState();

    this.rpcEndpoint = this.rpcEndpoint || this._getEndpointFromStorage();
    this.rpcEndpointError = false;

    await this._recreateWeb3();
    if (this.web3) {
      this._updateRPCEndpointInStorage();
    }
  };

  updateRPCEndpoint = async (endpoint: string) => {
    if (endpoint === this.rpcEndpoint) {
      return;
    }
    this.resetState();
    this.rpcEndpoint = endpoint;
    await this._recreateWeb3();
    if (this.web3) {
      this._updateRPCEndpointInStorage();
      this._smartContracts.resetState();
    }
  };

  tryToConnectMetamask = async () => {};

  resetState = () => {
    this.web3 = null;
    this.rpcEndpointError = false;
    this.rpcEndpoint = "";
    this._updateRPCEndpointInStorage();
  };

  private async _recreateWeb3() {
    try {
      await this._createWeb3();
      await this._updateAccounts();
      this.rpcEndpointError = false;
    } catch {
      this.rpcEndpointError = true;
      this.web3 = null;
    }
  }

  private async _updateAccounts() {
    if (this.web3) {
      const accounts = await this.web3.eth.getAccounts();
      this._accountsModel.updateAccounts(accounts);

      Object.values(this._contractsModelsMap).forEach((model) => {
        model.setSelectedAccount(accounts[0]);
      });
    } else {
      this._accountsModel.updateAccounts([]);
    }
  }

  private async _createWeb3() {
    this.web3 = new Web3(this.rpcEndpoint);
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
