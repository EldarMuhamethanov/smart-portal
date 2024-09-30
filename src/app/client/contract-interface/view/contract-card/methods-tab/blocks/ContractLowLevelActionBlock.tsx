import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Button, Flex, Input, Typography } from "antd";
import { useState } from "react";
import { useTranslationContext } from "../../../TranslationContext";

export const ContractLowLevelActionBlock: React.FC<{
  contractModel: ContractCardModel;
}> = ({ contractModel }) => {
  const [inputValue, setInputValue] = useState("");
  const { t } = useTranslationContext();
  const onCallTransaction = () => {
    contractModel.lowLevelSendTransaction(inputValue);
  };
  return (
    <Flex vertical style={{ maxWidth: 600 }}>
      <Typography.Title level={4}>
        {t("contract-card.methods.lowlevel-transaction")}
      </Typography.Title>
      <Flex gap={20}>
        <Input
          placeholder={t("common.calldata")}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="primary" onClick={onCallTransaction}>
          {t("contract-card.methods.call-transaction")}
        </Button>
      </Flex>
    </Flex>
  );
};
