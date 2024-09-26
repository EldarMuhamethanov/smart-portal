import { ContractInterfaceModel } from "./ContractInterfaceModel";
import { SmartContractsModel } from "./SmartContractsModel";
import { EnvironmentModel } from "./EnvironmentModel";
import { AccountsModel } from "./AccountsModel";
import { ContractCardModel } from "./ContractCard/ContractCardModel";

let contractsModelMap: Record<string, ContractCardModel> = {};

const smartContracts = new SmartContractsModel();
const accountsModel = new AccountsModel();
const environmentModel = new EnvironmentModel(
  smartContracts,
  accountsModel,
  contractsModelMap
);
const contractInterfaceModel = new ContractInterfaceModel(smartContracts);

export const removeContractModel = (address: string) => {
  delete contractsModelMap[address];
};

export const addContractModel = (address: string) => {
  if (!contractsModelMap[address]) {
    contractsModelMap[address] = new ContractCardModel(
      address,
      environmentModel
    );
  }
};

export const getContractModel = (address: string): ContractCardModel => {
  return contractsModelMap[address];
};

export const resetContractsModel = () => {
  contractsModelMap = {};
};

export {
  smartContracts,
  contractInterfaceModel,
  environmentModel,
  accountsModel,
};
