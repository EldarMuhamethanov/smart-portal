import { Flex } from "antd";
import { smartContracts } from "../model/AppModel";
import { ContractCard } from "./contract-card/ContractCard";
import { observer } from "mobx-react-lite";

export const ContractsList: React.FC = observer(() => {
  return (
    <Flex vertical gap={20}>
      {smartContracts.contracts.map((contract) => {
        return (
          <ContractCard
            key={contract.address}
            address={contract.address}
            onRemoveContract={() =>
              smartContracts.removeContract(contract.address)
            }
          />
        );
      })}
    </Flex>
  );
});
