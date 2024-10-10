import { LocalStorage } from "@/core/localStorage";
import { EnvironmentType } from "@/web3/Environment";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { SmartContractsModel } from "../SmartContractsModel";
import { AccountsModel } from "../AccountsModel";
import { ContractCardModel } from "../ContractCard/ContractCardModel";
import { IEvnModel } from "./types";
import { MetamaskEnvironmentModel } from "./MetamaskEnvironmentModel";
import { LocalEnvironmentModel } from "./LocalEnvironmentModel";

export class EnvironmentModel {
  environment: EnvironmentType | null = null;

  private _smartContracts: SmartContractsModel;
  private _accountsModel: AccountsModel;
  private _contractsModelsMap: Record<string, ContractCardModel> = {};
  private _privateImplModel: IEvnModel | null = null;

  constructor(
    smartContracts: SmartContractsModel,
    accountsModel: AccountsModel,
    contractsModelsMap: Record<string, ContractCardModel>
  ) {
    this._contractsModelsMap = contractsModelsMap;
    this._smartContracts = smartContracts;
    this._accountsModel = accountsModel;
    makeAutoObservable(this);
  }

  get web3(): Web3 | null {
    return this._privateImplModel?.web3 || null;
  }

  get accountsModel() {
    return this._accountsModel;
  }

  get rpcEndpointError() {
    return this._privateImplModel?.rpcEndpointError || false;
  }

  get rpcEndpoint() {
    return this._privateImplModel?.rpcEndpoint || "";
  }

  get chainIdError() {
    return this._privateImplModel?.chainIdError || false;
  }

  async setEnvironment(env: EnvironmentType | undefined) {
    if (env === this.environment) {
      return;
    }
    this.environment = env || null;
    this._privateImplModel?.resetState();
    this._privateImplModel = this._createModel();

    await this._privateImplModel?.updateState();
    this._updateLocalState();
  }

  tryToConnectMetamask = async () => {
    this._privateImplModel?.tryToConnectMetamask();
  };

  updateRPCEndpoint = async (endpoint: string) => {
    this._privateImplModel?.updateRPCEndpoint(endpoint);
  };

  async initState() {
    this.environment = this._getEnvFromStorage();
    if (!this.environment) {
      return;
    }
    this._privateImplModel = this._createModel();
    this._privateImplModel?.initState();

    if (this._privateImplModel?.web3) {
      this._smartContracts.initState();
    } else {
      this._smartContracts.resetState();
    }
  }

  private _createModel = () => {
    return (
      this.environment &&
      (this.environment === "metamask"
        ? new MetamaskEnvironmentModel(
            this._smartContracts,
            this._accountsModel,
            this._contractsModelsMap
          )
        : new LocalEnvironmentModel(
            this._smartContracts,
            this._accountsModel,
            this._contractsModelsMap
          ))
    );
  };

  private _updateLocalState() {
    if (this.environment) {
      LocalStorage.setValue("environment", this.environment);
    } else {
      LocalStorage.removeValue("environment");
    }
  }

  private _getEnvFromStorage() {
    return LocalStorage.getValue<EnvironmentType>("environment") || null;
  }
}
