import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Flex, Typography, Radio, InputNumber } from "antd";
import { RadioChangeEvent } from "antd/lib";
import { observer } from "mobx-react-lite";

export const ContractGasBlock: React.FC<{
  contractModel: ContractCardModel;
}> = observer(({ contractModel }) => {
  const onChange = (e: RadioChangeEvent) => {
    contractModel.setGasIsCustom(e.target.value === "custom");
  };

  return (
    <Flex vertical>
      <Typography.Title level={4}>Газ</Typography.Title>
      <Radio.Group
        onChange={onChange}
        value={contractModel.gasIsCustom ? "custom" : "estimated"}
      >
        <Flex vertical gap={20} style={{ maxWidth: 600 }}>
          <Radio value="estimated">Estimated gas</Radio>
          <Flex align="center" gap={40}>
            <Radio value="custom">Custom</Radio>

            <InputNumber
              readOnly={!contractModel.gasIsCustom}
              value={contractModel.gasCustomValue}
              min={"0"}
              onInput={contractModel.setGasCustomValue}
              onChange={(value) =>
                value && contractModel.setGasCustomValue(value)
              }
              step={1}
              precision={0}
              formatter={(value) => `${value}`.replace(/[^\d]/g, "")}
              parser={(value) => `${value}`.replace(/[^\d]/g, "")}
              style={{ flexGrow: 1 }}
            />
          </Flex>
        </Flex>
      </Radio.Group>
    </Flex>
  );
});
