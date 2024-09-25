import { ABI } from "@/web3/ABI";
import {
  ContractMethod,
  FieldData,
  MethodType,
} from "../view/contract-card/types";
import { makeAutoObservable, toJS } from "mobx";
import { getABI } from "@/web3/getAbi";
import { remapABItoMethodsData } from "../view/contract-card/helpers";
import { EnvironmentModel } from "./EnvironmentModel";

type FieldDataWithValue = FieldData & {
  value: string;
};

export class ContractCardModel {
  address: string;
  abi: ABI | null = null;
  methodsData: ContractMethod[] = [];
  verified: boolean = true;
  isLoading: boolean = true;
  selectedAccount: string | null = null;
  methodToResult: Record<string, string> = {};

  environmentModel: EnvironmentModel;

  constructor(address: string, environmentModel: EnvironmentModel) {
    this.address = address;
    this.environmentModel = environmentModel;
    makeAutoObservable(this);
  }

  setSelectedAccount(address: string | null) {
    this.selectedAccount = address;
  }

  async loadMethods() {
    this.isLoading = true;
    const network = "sepolia";
    this.abi = await getABI(this.address, network);
    if (!this.abi) {
      this.verified = false;
    } else {
      this.verified = true;
      const result = remapABItoMethodsData(toJS(this.abi));
      this.methodsData = result;
    }
    this.isLoading = false;
  }

  async getDataFromStorage(slotNumber: number) {
    const web3 = this.environmentModel.web3!;
    const result = await web3.eth.getStorageAt(this.address, slotNumber);
    return result;
  }

  callMethod = async (
    methodName: string,
    methodType: MethodType,
    fields: FieldDataWithValue[]
  ) => {
    if (!this.abi) {
      return;
    }
    const web3 = this.environmentModel.web3!;

    const contract = new web3.eth.Contract(this.abi, this.address);
    const argsValues = fields.map((field) => field.value);

    if (methodType === "pure" || methodType === "view") {
      try {
        const result = await contract.methods[methodName](...argsValues).call();
        if (typeof result === "string") {
          this._updateMethodResult(methodName, result);
        }
        return;
      } catch (e) {
        console.error("Failed to call method: ", e);
        return;
      }
    }

    const accounts = await web3.eth.getAccounts();
    try {
      await contract.methods[methodName](...argsValues).send({
        from: accounts[0],
      });
    } catch (e) {
      console.error("Failed to call method: ", e);
      return;
    }
  };

  createCalldata(methodName: string, fields: FieldDataWithValue[]) {
    const methodSignature =
      this.environmentModel.web3?.eth.abi.encodeFunctionSignature(
        this._remapMethodDataToSignature(methodName, fields)
      );

    const params = this.createParameters(fields);
    if (!methodSignature || !params) {
      return "";
    }

    const data = methodSignature + params.slice(2);
    return data;
  }

  createParameters(fields: FieldDataWithValue[]) {
    const params = this.environmentModel.web3?.eth.abi.encodeParameters(
      fields.map((field) => field.type),
      fields.map((field) => field.value)
    );
    return params || "";
  }

  private _updateMethodResult(methodName: string, result: string) {
    this.methodToResult[methodName] = result;
  }

  private _remapMethodDataToSignature = (
    methodName: string,
    fields: FieldData[]
  ) => {
    return `${methodName}(${fields.map((field) => field.type)})`;
  };
}
