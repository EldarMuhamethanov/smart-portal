import { Typography, Flex, Divider, notification } from "antd";
import { MethodForm, MethodFormProps } from "./method-form/MethodForm";
import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { copyToClipboard } from "@/core/clipboard";
import { ContractValueBlock } from "./blocks/ContractValueBlock";
import { ContractSelectedAccountBlock } from "./blocks/ContractSelectedAccountBlock";
import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { ContractGasBlock } from "./blocks/ContractGasBlock";
import { CustomMethodsBlock } from "./blocks/custom-methods/CustomMethodsBlock";
import { ContractLowLevelActionBlock } from "./blocks/ContractLowLevelActionBlock";

type ContractsMethodsTabProps = {
  contractModel: ContractCardModel;
};

export const ContractsMethodsTab: React.FC<ContractsMethodsTabProps> = observer(
  ({ contractModel }) => {
    const [api, contextHolder] = notification.useNotification();

    const onCopyCalldata: MethodFormProps["onCopyCalldata"] = (
      methodName,
      fields
    ) => {
      const calldata = contractModel.createCalldata(methodName, fields);
      if (calldata) {
        copyToClipboard(calldata);
        api.info({
          message: "Calldata скопирована в буфер обмена",
        });
      } else {
        api.error({
          message: "Calldata не скопирована",
          description:
            "Не все поля были заполнены или были заполнены некорректно",
        });
      }
    };

    const onCopyParameters: MethodFormProps["onCopyParameters"] = (fields) => {
      const parameters = contractModel.createParameters(fields);
      if (parameters) {
        copyToClipboard(parameters);
        api.info({
          message: "Параметры скопированы в буфер обмена",
        });
      } else {
        api.error({
          message: "Параметры не скопированы",
          description:
            "Не все поля были заполнены или были заполнены некорректно",
        });
      }
    };

    return (
      <Flex vertical style={{ width: "100%" }}>
        {contextHolder}
        <ContractSelectedAccountBlock contractModel={contractModel} />
        <Divider />
        <ContractValueBlock contractModel={contractModel} />
        <Divider />
        <ContractGasBlock contractModel={contractModel} />
        <Divider />
        <CustomMethodsBlock
          contractModel={contractModel}
          onCopyCalldata={onCopyCalldata}
          onCopyParameters={onCopyParameters}
        />
        <Divider />
        <ContractLowLevelActionBlock contractModel={contractModel} />
        <Divider />
        {!contractModel.verified ? (
          <Typography.Paragraph>
            К сожалению данный контракт не верифицирован, поэтому мы не можем
            отобразить его методы
          </Typography.Paragraph>
        ) : (
          <Flex vertical>
            {contractModel.methodsData.map((method, index) => (
              <Fragment key={method.name}>
                <MethodForm
                  type={method.type}
                  name={method.name}
                  fields={method.fields}
                  result={contractModel.methodToResult[method.name]}
                  onCall={contractModel.callMethod}
                  onCopyCalldata={onCopyCalldata}
                  onCopyParameters={onCopyParameters}
                />
                {index < contractModel.methodsData.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Flex>
        )}
      </Flex>
    );
  }
);
