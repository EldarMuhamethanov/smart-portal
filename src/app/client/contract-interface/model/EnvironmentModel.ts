import { connectToMetaMask } from "@/web3/connectToMetamask";
import { LocalStorage } from "@/core/localStorage";
import { EnvironmentType } from "@/web3/Environment";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { SmartContractsModel } from "./SmartContractsModel";
import { AccountsModel } from "./AccountsModel";
import { ContractCardModel } from "./ContractCard/ContractCardModel";

const DEFAULT_RPC_ENDPOINT = "http://localhost:8545";

const etherscanEndpoints: Array<number> = [
  1, 3, 4, 5, 10, 42, 56, 97, 137, 80001, 42161, 421613, 43114, 11155111,
];

export class EnvironmentModel {
  smartContracts: SmartContractsModel;
  accountsModel: AccountsModel;
  environment: EnvironmentType | null;
  rpcEndpoint: string = DEFAULT_RPC_ENDPOINT;
  rpcEndpointError: boolean = false;
  chainIdError: boolean = false;
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
    if (env === this.environment) {
      return;
    }
    this.environment = env || null;
    this.smartContracts.resetState();
    this.rpcEndpoint =
      this.rpcEndpoint ||
      this._getEndpointFromStorage() ||
      DEFAULT_RPC_ENDPOINT;
    this.rpcEndpointError = false;
    await this._recreateWeb3();
    if (this.web3) {
      this._updateLocalState();
      this._updateRPCEndpointInStorage();
    }
  }

  tryToConnectMetamask = async () => {
    this.environment = "metamask";
    this.smartContracts.resetState();
    await this._recreateWeb3();
    if (this.web3) {
      this._updateLocalState();
    }
  };

  async updateRPCEndpoint(endpoint: string) {
    if (endpoint === this.rpcEndpoint) {
      return;
    }
    this.rpcEndpoint = endpoint;
    await this._recreateWeb3();
    if (this.web3) {
      this._updateRPCEndpointInStorage();
      this.smartContracts.resetState();
    }
  }

  async initState() {
    this.environment = this._getEnvFromStorage();
    if (!this.environment) {
      return;
    }
    if (this.environment !== "metamask") {
      this.rpcEndpoint = this._getEndpointFromStorage();
    } else {
      this.rpcEndpoint = "";
      this._updateRPCEndpointInStorage();
    }
    await this._recreateWeb3();
    await this._initChain();
    if (this.web3) {
      this.smartContracts.initState();
    } else {
      this.smartContracts.resetState();
    }
  }

  private async _createWeb3() {
    if (this.environment === "metamask") {
      this.web3 = await connectToMetaMask({
        onChainChanged: this._onChangeChain,
        onDisconnectValet: this._onDisconnectValet,
        onDisconnectMetamask: this._onDisconnectValet,
      });
    } else {
      this.web3 = new Web3(this.rpcEndpoint);
    }
  }

  private _initChain = async () => {
    if (!this.web3 || this.environment !== "metamask") {
      return;
    }
    const networkId = await this.web3.eth.net.getId();

    this.chainIdError = !etherscanEndpoints.includes(
      Number(networkId.toString())
    );
  };

  private async _updateAccounts() {
    if (this.web3) {
      const accounts = await this.web3.eth.getAccounts();
      this.accountsModel.updateAccounts(accounts);

      Object.values(this.contractsModelsMap).forEach((model) => {
        model.setSelectedAccount(accounts[0]);
      });
    } else {
      this.accountsModel.updateAccounts([]);
    }
  }

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

  private _onChangeChain = () => {
    this.smartContracts.resetState();
    this._initChain();
  };

  private _onDisconnectValet = () => {
    this.web3 = null;
    this._updateAccounts();
    this.smartContracts.resetState();
  };

  private _updateLocalState() {
    LocalStorage.setValue("environment", this.environment);
  }

  private _getEnvFromStorage() {
    return LocalStorage.getValue<EnvironmentType>("environment") || null;
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
