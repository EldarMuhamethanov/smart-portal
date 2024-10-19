import { makeAutoObservable } from "mobx";
import { ContractAbiModel } from "./ContractAbiModel";
import { EnvironmentModel } from "../env/EnvironmentModel";

export class ContractEventsModel {
  eventsLoading: boolean = false;

  private _contractAddress: string;
  private _abiModel: ContractAbiModel;
  private _envModel: EnvironmentModel;
  constructor(
    contractAddress: string,
    abiModel: ContractAbiModel,
    envModel: EnvironmentModel
  ) {
    this._contractAddress = contractAddress;
    this._abiModel = abiModel;
    this._envModel = envModel;
    makeAutoObservable(this);
  }

  loadEvents() {
    if (!this._envModel.web3 || !this._abiModel.abi) {
      return;
    }
    this.eventsLoading = true;
    const contract = new this._envModel.web3.eth.Contract(
      this._abiModel.abi,
      this._contractAddress
    );

    contract.getPastEvents(
      "allEvents",
      {
        fromBlock: 0,
        toBlock: "latest",
      },
      (error, events) => {
        if (error) {
          console.error("Error:", error);
        } else {
          console.log("Past events:", events);
        }
      }
    );
  }
}
