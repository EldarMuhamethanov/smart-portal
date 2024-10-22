import { makeAutoObservable } from "mobx";
import { ContractAbiModel } from "./ContractAbiModel";
import { EnvironmentModel } from "../env/EnvironmentModel";
import { parseEventData } from "./helpers";
import { optionalArray } from "@/core/array";
import { Contract, ContractAbi } from "web3";

export type FilterFieldData = {
  name: string;
  values: (string | number | boolean)[];
};

export type FilterData = {
  eventName: string;
  fields: FilterFieldData[];
};

export type EventData = {
  name: string;
  values: object;
  fullData: object;
};

export class ContractEventsModel {
  events: EventData[] = [];
  eventsLoading: boolean = true;

  filterData: FilterData | null = null;

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

  setFilterData = (filterData: FilterData | null) => {
    this.filterData = filterData;
    this.loadEvents();
  };

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

      const events = await (this.filterData
        ? // @ts-expect-error unknown
          this._getEventsByFilter(contract, latest)
        : // @ts-expect-error unknown
          this._getAllEvents(contract, latest));

      this.events = optionalArray(events.map(parseEventData)).toReversed();
      this.eventsLoading = false;
    } catch {}
  };

  private _getEventsByFilter = (
    contract: Contract<ContractAbi>,
    latest: bigint
  ) => {
    const filterData = this.filterData!;
    const filter = filterData.fields.length
      ? filterData.fields.reduce((res, field) => {
          res[field.name] = field.values;
          return res;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }, {} as Record<string, any>)
      : undefined;

    return contract.getPastEvents(
      // @ts-expect-error unknown
      filterData.eventName,
      {
        filter,
        fromBlock: 0,
        toBlock: latest,
      }
    );
  };

  private _getAllEvents = (contract: Contract<ContractAbi>, latest: bigint) => {
    return contract.getPastEvents("allEvents", {
      fromBlock: 0,
      toBlock: latest,
    });
  };
}
