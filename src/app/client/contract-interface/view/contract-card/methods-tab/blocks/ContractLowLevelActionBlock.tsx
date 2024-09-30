import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Button, Flex, Input, Typography } from "antd";
import { useState } from "react";

export const ContractLowLevelActionBlock: React.FC<{
  contractModel: ContractCardModel;
}> = ({ contractModel }) => {
  const [inputValue, setInputValue] = useState("");
  const onCallTransaction = () => {
    contractModel.lowLevelSendTransaction(inputValue);
  };
  return (
    <Flex vertical style={{ maxWidth: 600 }}>
      <Typography.Title level={4}>Низкоуровневая транзакция</Typography.Title>
      <Flex gap={20}>
        <Input
          placeholder="Calldata"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="primary" onClick={onCallTransaction}>
          Вызвать
        </Button>
      </Flex>
    </Flex>
  );
};
