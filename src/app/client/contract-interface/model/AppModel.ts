import { SmartContractsModel } from "./SmartContractsModel";
import { EnvironmentModel } from "./env/EnvironmentModel";
import { AccountsModel } from "./AccountsModel";
import { ContractCardModel } from "./ContractCard/ContractCardModel";
import { AppSettingsModel } from "./Settings/AppSettingsModel";

let contractsModelMap: Record<string, ContractCardModel> = {};

const appSettings = new AppSettingsModel();
const smartContracts = new SmartContractsModel();
const accountsModel = new AccountsModel();
const environmentModel = new EnvironmentModel(
  smartContracts,
  accountsModel,
  contractsModelMap
);

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

export { smartContracts, environmentModel, accountsModel, appSettings };
