import { LocalStorage } from "@/core/localStorage";
import { ABI } from "@/web3/abi/ABI";
import { makeAutoObservable } from "mobx";

export class ContractAbiModel {
  abi: ABI | null = null;

  private _contractAddress: string;

  constructor(contractAddress: string) {
    this._contractAddress = contractAddress;
    makeAutoObservable(this);
  }

  tryToGetAbiFromStorage = () => {
    this.abi = this._getNotVerifiedABIFromStorage();
  };

  setAbi = (abi: ABI | null) => {
    this.abi = abi;
    this._updateNotVerifiedABIInStorage();
  };

  private _getNotVerifiedABIFromStorage = () => {
    return (
      LocalStorage.getValue<ABI | null>(
        `contract-${this._contractAddress}-abi`
      ) || null
    );
  };

  private _updateNotVerifiedABIInStorage = () => {
    LocalStorage.setValue<ABI | null>(
      `contract-${this._contractAddress}-abi`,
      this.abi
    );
  };
}
