import { makeAutoObservable } from "mobx";
import { ContractAbiModel } from "./ContractAbiModel";
import { EnvironmentModel } from "../env/EnvironmentModel";
import { parseEventData } from "./helpers";
import { optionalArray } from "@/core/array";

export type EventData = {
  name: string;
  values: object;
  fullData: object;
};

const STEP = 1000;

export class ContractEventsModel {
  events: EventData[] = [];
  eventsLoading: boolean = true;

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

  loadEvents = async () => {
    if (!this._envModel.web3 || !this._abiModel.abi) {
      return;
    }
    this.eventsLoading = true;
    const contract = new this._envModel.web3.eth.Contract(
      this._abiModel.abi,
      this._contractAddress
    );

    try {
      const latest = await this._envModel.web3.eth.getBlockNumber();

      const events = await contract.getPastEvents("allEvents", {
        fromBlock: Math.max(Number(latest) - STEP, 0),
        toBlock: latest,
      });
      this.events = optionalArray(events.map(parseEventData)).toReversed();
      this.eventsLoading = false;
    } catch {}
  };
}
