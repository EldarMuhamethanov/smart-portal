import { connectToMetaMask } from "@/web3/connectToMetamask";
import { makeAutoObservable } from "mobx";
import Web3 from "web3";
import { AccountsModel } from "../AccountsModel";
import { ContractCardModel } from "../ContractCard/ContractCardModel";
import { SmartContractsModel } from "../SmartContractsModel";
import { IEvnModel } from "./types";

const etherscanEndpoints: Array<number> = [
  1, 3, 4, 5, 10, 42, 56, 97, 137, 80001, 42161, 421613, 43114, 11155111,
];

export class MetamaskEnvironmentModel implements IEvnModel {
  web3: Web3 | null = null;
  chainIdError: boolean = false;

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

  get rpcEndpoint() {
    return "";
  }

  get rpcEndpointError() {
    return false;
  }

  initState = async () => {
    await this._recreateWeb3();
    await this._initChain();
  };

  updateState = async () => {
    this._smartContracts.resetState();
    await this._recreateWeb3();
  };

  updateRPCEndpoint = async () => {};

  tryToConnectMetamask = async () => {
    this._smartContracts.resetState();
    await this._recreateWeb3();
  };

  resetState = () => {
    this.web3 = null;
    this.chainIdError = false;
  };

  private async _recreateWeb3() {
    try {
      await this._createWeb3();
      await this._updateAccounts();
    } catch {
      this.web3 = null;
    }
  }

  private async _createWeb3() {
    this.web3 = await connectToMetaMask({
      onChainChanged: this._onChangeChain,
      onDisconnectValet: this._onDisconnectValet,
      onDisconnectMetamask: this._onDisconnectValet,
    });
  }

  private _initChain = async () => {
    if (!this.web3) {
      return;
    }
    const networkId = await this.web3.eth.net.getId();

    this.chainIdError = !etherscanEndpoints.includes(
      Number(networkId.toString())
    );
  };

  private _onChangeChain = () => {
    this._smartContracts.resetState();
    this._initChain();
  };

  private _onDisconnectValet = () => {
    this.web3 = null;
    this._updateAccounts();
    this._smartContracts.resetState();
  };

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
}
