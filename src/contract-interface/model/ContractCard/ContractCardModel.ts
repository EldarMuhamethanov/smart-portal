import { ABI } from "@/web3/ABI";
import {
  ContractMethod,
  FieldData,
  MethodType,
} from "../../view/contract-card/types";
import { makeAutoObservable, toJS } from "mobx";
import { UnknownNetwork, getContractCodeData } from "@/web3/getAbi";
import { remapABItoMethodsData } from "../../view/contract-card/helpers";
import { EnvironmentModel } from "../EnvironmentModel";
import {
  ContractSelectedAccount,
  SelectedAccountData,
} from "./ContractSelectedAccount";
import { ContractValueModel, CurrencyType } from "./ContractValueModel";
import { LocalStorage } from "@/core/localStorage";
import { ContractGasModel } from "./ContractGasModel";
import { ContractCodeModel } from "./ContractCodeModel";

type FieldDataWithValue = FieldData & {
  value: string;
};

export class ContractCardModel {
  address: string;
  abi: ABI | null = null;
  methodsData: ContractMethod[] = [];
  verified: boolean = true;
  isLoading: boolean = true;
  methodToResult: Record<string, string> = {};
  expanded: boolean = false;

  private _environmentModel: EnvironmentModel;
  private _selectedAccountModel: ContractSelectedAccount;
  private _contractValueModel: ContractValueModel;
  private _contractGasModel: ContractGasModel;
  private _contractCodeModel: ContractCodeModel;

  constructor(address: string, environmentModel: EnvironmentModel) {
    this.address = address;
    this._environmentModel = environmentModel;
    this._selectedAccountModel = new ContractSelectedAccount(
      address,
      environmentModel
    );
    this._contractValueModel = new ContractValueModel();
    this._contractGasModel = new ContractGasModel(address);
    this._contractCodeModel = new ContractCodeModel();
    makeAutoObservable(this);
  }

  get selectedAccount(): SelectedAccountData | null {
    return this._selectedAccountModel.selectedAccount || null;
  }

  get valueToSend(): string {
    return this._contractValueModel.value;
  }

  get selectedCurrency(): CurrencyType {
    return this._contractValueModel.selectedCurrency;
  }

  get gasIsCustom(): boolean {
    return this._contractGasModel.custom;
  }

  get gasCustomValue(): string {
    return this._contractGasModel.customGasValue;
  }

  get code(): string {
    return this._contractCodeModel.code;
  }

  initState = () => {
    this._selectedAccountModel.initState();
    this.expanded = this._getExpandedFromStorage();
  };

  setSelectedAccount = (address: string | null) => {
    this._selectedAccountModel.setSelectedAccount(address);
  };

  setValueToSend = (value: string) => {
    this._contractValueModel.setValue(value);
  };

  setSelectedCurrency = (currency: CurrencyType) => {
    this._contractValueModel.setSelectedCurrency(currency);
  };

  setGasIsCustom = (custom: boolean) => {
    this._contractGasModel.setCustom(custom);
  };

  setGasCustomValue = (customValue: string) => {
    this._contractGasModel.setCustomGasValue(customValue);
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setExpanded(expanded: boolean) {
    this.expanded = expanded;
    this._updateExpandedInStorage();
  }

  async loadMethods() {
    this.setIsLoading(true);
    if (this._environmentModel.environment === "hardhat") {
      this.verified = false;
      this.setIsLoading(false);
      return;
    }
    const networkId = await this._environmentModel.web3!.eth.net.getId();
    try {
      const result = await getContractCodeData(this.address, Number(networkId));
      this.abi = result?.abi || null;
      this._contractCodeModel.setCode(result?.code || "");
    } catch (e) {
      if (e instanceof UnknownNetwork) {
        console.log("Неизвестная сеть");
      }
      return;
    }
    if (!this.abi) {
      this.verified = false;
    } else {
      this.verified = true;
      const result = remapABItoMethodsData(toJS(this.abi));
      this.methodsData = result;
    }
    this.setIsLoading(false);
  }

  getDataFromStorage = async (slotNumber: number) => {
    const web3 = this._environmentModel.web3!;
    const result = await web3.eth.getStorageAt(this.address, slotNumber);
    return result;
  };

  callMethod = async (
    methodName: string,
    methodType: MethodType,
    fields: FieldDataWithValue[]
  ) => {
    if (!this.abi) {
      return;
    }
    if (!this._selectedAccountModel.selectedAccount) {
      console.error("need to select account");
      return;
    }
    const web3 = this._environmentModel.web3!;

    const contract = new web3.eth.Contract(this.abi, this.address);
    const argsValues = fields.map((field) => field.value);

    if (methodType === "pure" || methodType === "view") {
      try {
        const result = await contract.methods[methodName](...argsValues).call({
          from: this._selectedAccountModel.selectedAccount.address,
        });
        console.log("result", result);
        if (typeof result === "string") {
          this._updateMethodResult(methodName, result);
        }
        return;
      } catch (e) {
        console.error("Failed to call method: ", e);
        return;
      }
    }

    try {
      await contract.methods[methodName](...argsValues).send({
        from: this._selectedAccountModel.selectedAccount.address,
        gas: this._contractGasModel.custom
          ? this._contractGasModel.customGasValue
          : undefined,
        value: web3.utils.toWei(
          this._contractValueModel.value,
          this._contractValueModel.selectedCurrency
        ),
      });
    } catch (e) {
      console.error("Failed to call method: ", e);
      return;
    }
  };

  createCalldata(methodName: string, fields: FieldDataWithValue[]) {
    if (fields.some((field) => !field.value)) {
      return "";
    }

    try {
      const methodSignature =
        this._environmentModel.web3?.eth.abi.encodeFunctionSignature(
          this._remapMethodDataToSignature(methodName, fields)
        );

      const params = this.createParameters(fields);
      if (!methodSignature || !params) {
        return "";
      }

      const data = methodSignature + params.slice(2);
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "";
    }
  }

  createParameters(fields: FieldDataWithValue[]) {
    if (fields.some((field) => !field.value)) {
      return "";
    }
    try {
      const params = this._environmentModel.web3?.eth.abi.encodeParameters(
        fields.map((field) => field.type),
        fields.map((field) => field.value)
      );
      return params || "";
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return "";
    }
  }

  private _updateMethodResult(methodName: string, result: string) {
    this.methodToResult[methodName] = result;
  }

  private _updateExpandedInStorage() {
    LocalStorage.setValue(`contract-${this.address}-expanded`, this.expanded);
  }

  private _getExpandedFromStorage() {
    return (
      LocalStorage.getValue<boolean>(`contract-${this.address}-expanded`) ||
      false
    );
  }

  private _remapMethodDataToSignature = (
    methodName: string,
    fields: FieldData[]
  ) => {
    return `${methodName}(${fields.map((field) => field.type)})`;
  };
}
