import { configure } from "mobx";
import { ContractInterfaceModel } from "./ContractInterfaceModel";
import { SmartContractsModel } from "./SmartContractsModel";
import { EnvironmentModel } from "./EnvironmentModel";
import { AccountsModel } from "./AccountsModel";

configure({
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: true,
});

const smartContracts = new SmartContractsModel();
const accountsModel = new AccountsModel();
const environmentModel = new EnvironmentModel(smartContracts, accountsModel);
const contractInterfaceModel = new ContractInterfaceModel(smartContracts);

export { smartContracts, contractInterfaceModel, environmentModel };
