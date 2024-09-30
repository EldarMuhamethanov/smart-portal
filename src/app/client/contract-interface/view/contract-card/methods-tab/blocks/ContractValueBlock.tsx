import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { CurrencyType } from "@/app/client/contract-interface/model/ContractCard/ContractValueModel";
import { getValueByCheckedKey } from "@/core/typings";
import { Typography, Flex, InputNumber, InputNumberProps, Select } from "antd";
import { SelectProps } from "antd/lib";
import { observer } from "mobx-react-lite";

const CURRENCY_TYPES: CurrencyType[] = ["wei", "gwei", "finney", "ether"];

const remapCurrencyTypesToLabels = (currencyType: CurrencyType): string => {
  return getValueByCheckedKey(currencyType, {
    wei: "Wei",
    gwei: "Gwei",
    finney: "Finney",
    ether: "Ether",
  });
};

export const ContractValueBlock: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const onValueChanged: InputNumberProps<string>["onChange"] = (value) => {
    contractModel.setValueToSend(value || "0");
  };

  const onCurrencyChanged: SelectProps["onChange"] = (value) => {
    contractModel.setSelectedCurrency(value);
  };

  return (
    <Flex vertical>
      <Typography.Title level={4}>Value</Typography.Title>
      <Flex gap={20} style={{ maxWidth: 600 }}>
        <InputNumber
          value={contractModel.valueToSend}
          min={"0"}
          onInput={onValueChanged}
          onChange={onValueChanged}
          step={1}
          precision={0}
          formatter={(value) => `${value}`.replace(/[^\d]/g, "")}
          parser={(value) => `${value}`.replace(/[^\d]/g, "")}
          style={{ flexGrow: 1 }}
        />
        <Select
          onChange={onCurrencyChanged}
          value={contractModel.selectedCurrency}
        >
          {CURRENCY_TYPES.map((currency) => (
            <Select.Option key={currency} value={currency}>
              {remapCurrencyTypesToLabels(currency)}
            </Select.Option>
          ))}
        </Select>
      </Flex>
    </Flex>
  );
});
