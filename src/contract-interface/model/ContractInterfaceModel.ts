import { makeAutoObservable } from "mobx";
import { SmartContractsModel } from "./SmartContractsModel";

export class ContractInterfaceModel {
  smartContractModel: SmartContractsModel;

  constructor(smartContractModel: SmartContractsModel) {
    makeAutoObservable(this);

    this.smartContractModel = smartContractModel;
  }
}
