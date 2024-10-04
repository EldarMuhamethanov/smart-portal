import {
  ContractMethod,
  FieldData,
  MethodType,
} from "../../view/contract-card/types";
import { makeAutoObservable } from "mobx";
import { getContractCodeData } from "@/web3/getAbi";
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
import {
  ContractCustomMethodsModel,
  CustomMethodData,
} from "./ContractCustomMethodsModel";
import { UnknownNetwork } from "@/web3/errors";
import { remapArgsValues, remapResultObject } from "./helpers";
import { ContractAbiModel } from "./ContractAbiModel";
import { ABI } from "@/web3/ABI";

export type FieldDataWithValue = FieldData & {
  value: string;
};

export class ContractCardModel {
  address: string;
  methodsData: ContractMethod[] = [];
  verified: boolean = true;
  isLoading: boolean = true;
  methodToResult: Record<string, string[]> = {};
  transactionToResult: Record<string, object> = {};
  methodToError: Record<string, string> = {};
  expanded: boolean = false;

  private _environmentModel: EnvironmentModel;
  private _selectedAccountModel: ContractSelectedAccount;
  private _contractValueModel: ContractValueModel;
  private _contractGasModel: ContractGasModel;
  private _contractCodeModel: ContractCodeModel;
  private _contractCustomMethodsModel: ContractCustomMethodsModel;
  private _contractAbiModel: ContractAbiModel;

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
    this._contractCustomMethodsModel = new ContractCustomMethodsModel(address);
    this._contractAbiModel = new ContractAbiModel(address);
    makeAutoObservable(this);
  }

  get abi(): ABI | null {
    return this._contractAbiModel.abi;
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

  get customMethods() {
    return this._contractCustomMethodsModel.customMethods;
  }

  get customMethodsExpanded() {
    return this._contractCustomMethodsModel.expanded;
  }

  getCustomMethodResult = (methodName: string): string[] | null => {
    return this._contractCustomMethodsModel.methodToResult[methodName] || null;
  };

  getCustomTransactionResult = (methodName: string): object | null => {
    return (
      this._contractCustomMethodsModel.transactionToResult[methodName] || null
    );
  };

  getCustomMethodError = (methodName: string): string | null => {
    return this._contractCustomMethodsModel.methodToError[methodName] || null;
  };

  initState = () => {
    this._selectedAccountModel.initState();
    this._contractCustomMethodsModel.initState();
    this._initSelectedAccount();
    this.expanded = this._getExpandedFromStorage();
  };

  setAbi = (abi: ABI) => {
    this._contractAbiModel.setAbi(abi);
    this._updateMethodsData();
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

  addCustomMethod = (method: CustomMethodData) => {
    this._contractCustomMethodsModel.addCustomMethod(method);
  };

  setCustomMethodsExpanded = (expanded: boolean) => {
    this._contractCustomMethodsModel.setExpanded(expanded);
  };

  removeCustomMethod = (id: string) => {
    this._contractCustomMethodsModel.removeCustomMethod(id);
  };

  setIsLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };

  setExpanded(expanded: boolean) {
    this.expanded = expanded;
    this._updateExpandedInStorage();
  }

  clearCustomMethodResult = (methodName: string) => {
    this._contractCustomMethodsModel.clearMethodResult(methodName);
  };

  clearCustomTransactionResult = (methodName: string) => {
    this._contractCustomMethodsModel.clearTransactionResult(methodName);
  };

  clearCustomMethodError = (methodName: string) => {
    this._contractCustomMethodsModel.clearMethodError(methodName);
  };

  clearMethodResult = (methodName: string) => {
    delete this.methodToResult[methodName];
  };

  clearTransactionResult = (methodName: string) => {
    delete this.transactionToResult[methodName];
  };

  clearMethodError = (methodName: string) => {
    delete this.methodToError[methodName];
  };

  async loadMethods() {
    this.setIsLoading(true);
    if (this._environmentModel.environment === "hardhat") {
      this.verified = false;
      this._contractAbiModel.tryToGetAbiFromStorage();
      this._updateMethodsData();
      this.setIsLoading(false);
      return;
    }
    const networkId = await this._environmentModel.web3!.eth.net.getId();
    try {
      const result = await getContractCodeData(this.address, Number(networkId));
      this._contractAbiModel.setAbi(result?.abi || null);
      this._contractCodeModel.setCode(result?.code || "");
    } catch (e) {
      if (e instanceof UnknownNetwork) {
        console.log("Неизвестная сеть");
      }
      return;
    }
    if (!this._contractAbiModel.abi) {
      this.verified = false;
      this._contractAbiModel.tryToGetAbiFromStorage();
    } else {
      this.verified = true;
    }
    this._updateMethodsData();
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
    if (!this._contractAbiModel.abi) {
      return;
    }
    if (!this._selectedAccountModel.selectedAccount) {
      console.error("need to select account");
      return;
    }
    const web3 = this._environmentModel.web3!;
    this.clearMethodResult(methodName);
    this.clearMethodError(methodName);

    const contract = new web3.eth.Contract(
      this._contractAbiModel.abi,
      this.address
    );
    let argsValues;
    try {
      argsValues = remapArgsValues(fields);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      this.methodToError[methodName] = e.message;
      return;
    }

    if (methodType === "pure" || methodType === "view") {
      try {
        const result = await contract.methods[methodName](...argsValues).call({
          from: this._selectedAccountModel.selectedAccount.address,
        });
        const remappedData = remapResultObject(result);
        if (remappedData.length) {
          this._updateMethodResult(methodName, remappedData);
        }
        return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this.methodToError[methodName] = e.message;
        console.error("Failed to call method: ", e);
        return;
      }
    }

    try {
      const result = await contract.methods[methodName](...argsValues).send({
        from: this._selectedAccountModel.selectedAccount.address,
        gas: this._contractGasModel.custom
          ? this._contractGasModel.customGasValue
          : undefined,
        value: web3.utils.toWei(
          this._contractValueModel.value,
          this._contractValueModel.selectedCurrency
        ),
      });
      const stringResult = JSON.stringify(result, (_, value) => {
        if (typeof value === "bigint") {
          return Number(String(value));
        }
        return value;
      });
      const parsedResult = JSON.parse(stringResult);
      this.transactionToResult[methodName] = parsedResult;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      this.methodToError[methodName] = e.message;
      console.error("Failed to send transaction: ", e);
      return;
    }
  };

  callCustomMethod = async (
    id: string,
    methodType: MethodType,
    fields: FieldDataWithValue[]
  ) => {
    if (!this._selectedAccountModel.selectedAccount) {
      console.error("need to select account");
      return;
    }
    const web3 = this._environmentModel.web3!;

    const customMethodData = this._contractCustomMethodsModel.getMethodById(id);
    if (!customMethodData) {
      console.error("Unknown method");
      return;
    }
    const methodName = customMethodData.name;

    const calldata = this.createCalldata(methodName, fields);

    this._contractCustomMethodsModel.clearMethodResult(methodName);
    this._contractCustomMethodsModel.clearMethodError(methodName);

    if (methodType === "pure" || methodType === "view") {
      try {
        const result = await web3.eth.call({
          from: this._selectedAccountModel.selectedAccount.address,
          to: this.address,
          data: calldata,
        });
        const decodedResult = web3.eth.abi.decodeParameters(
          customMethodData.outputs,
          result
        );
        const remappedData = remapResultObject(decodedResult);
        if (remappedData.length) {
          this._contractCustomMethodsModel.setMethodResult(
            methodName,
            remappedData
          );
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        this._contractCustomMethodsModel.setMethodError(methodName, e.message);
        console.error("Error: ", e);
      }

      return;
    }

    const result = await this.lowLevelSendTransaction(calldata);
    if (result.type == "success") {
      const { receipt } = result;
      this._contractCustomMethodsModel.setTransactionResult(
        methodName,
        receipt
      );
    } else {
      this._contractCustomMethodsModel.setMethodError(methodName, result.error);
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
      console.error("Error while creating calldata", e);
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

  lowLevelSendTransaction = async (calldata: string) => {
    if (!this._selectedAccountModel.selectedAccount) {
      console.error("need to select account");
      return {
        type: "error",
        error: "Need to select account",
      };
    }
    const web3 = this._environmentModel.web3!;
    try {
      const gasEstimate = await web3.eth.estimateGas({
        to: this.address,
        data: calldata,
        from: this._selectedAccountModel.selectedAccount.address,
      });
      const tx = await web3.eth.sendTransaction({
        from: this._selectedAccountModel.selectedAccount.address,
        to: this.address,
        data: calldata,
        gas: this._contractGasModel.custom
          ? this._contractGasModel.customGasValue
          : gasEstimate,
        value: web3.utils.toWei(
          this._contractValueModel.value,
          this._contractValueModel.selectedCurrency
        ),
      });
      console.log("Транзакция отправлена:", tx.transactionHash);
      const receipt = await web3.eth.getTransactionReceipt(tx.transactionHash);

      const stringResult = JSON.stringify(receipt, (_, value) => {
        if (typeof value === "bigint") {
          return Number(String(value));
        }
        return value;
      });
      const parsedReceipt = JSON.parse(stringResult);
      console.log("parsedReceipt", parsedReceipt);
      return {
        type: "success",
        receipt: parsedReceipt,
        transactionHash: tx.transactionHash,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error("Ошибка при отправке транзакции:", e);
      return {
        type: "error",
        error: e.message,
      };
    }
  };

  private _initSelectedAccount = () => {
    if (!this._selectedAccountModel.selectedAccount) {
      this._selectedAccountModel.setSelectedAccount(
        this._environmentModel.accountsModel.accounts[0]
      );
    }
  };

  private _updateMethodsData = () => {
    if (this._contractAbiModel.abi) {
      this.methodsData = remapABItoMethodsData(this._contractAbiModel.abi);
    } else {
      this.methodsData = [];
    }
  };

  private _updateMethodResult(methodName: string, result: string[]) {
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
