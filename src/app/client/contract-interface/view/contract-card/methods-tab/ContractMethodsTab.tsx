"use client";
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
import { useTranslationContext } from "../../TranslationContext";

type ContractsMethodsTabProps = {
  contractModel: ContractCardModel;
};

export const ContractsMethodsTab: React.FC<ContractsMethodsTabProps> = observer(
  ({ contractModel }) => {
    const [api, contextHolder] = notification.useNotification();
    const { t } = useTranslationContext();

    const onCopyCalldata: MethodFormProps["onCopyCalldata"] = (
      methodName,
      fields
    ) => {
      const calldata = contractModel.createCalldata(methodName, fields);
      if (calldata) {
        copyToClipboard(calldata);
        api.info({
          message: t("contract-card.methods.calldata-copied"),
        });
      } else {
        api.error({
          message: t("contract-card.methods.failed-calldata-copied-title"),
          description: t(
            "contract-card.methods.failed-calldata-copied-description"
          ),
        });
      }
    };

    const onCopyParameters: MethodFormProps["onCopyParameters"] = (fields) => {
      const parameters = contractModel.createParameters(fields);
      if (parameters) {
        copyToClipboard(parameters);
        api.info({
          message: t("contract-card.methods.parameters-copied"),
        });
      } else {
        api.error({
          message: t("contract-card.methods.failed-parameters-copied-title"),
          description: t(
            "contract-card.methods.failed-parameters-copied-description"
          ),
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
            {t("contract-card.methods.not-verified")}
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
                  transactionResult={
                    contractModel.transactionToResult[method.name]
                  }
                  error={contractModel.methodToError[method.name]}
                  onCall={contractModel.callMethod}
                  onCopyCalldata={onCopyCalldata}
                  onCopyParameters={onCopyParameters}
                  onResultClear={() =>
                    contractModel.clearMethodResult(method.name)
                  }
                  onTransactionResultClear={() =>
                    contractModel.clearTransactionResult(method.name)
                  }
                  onErrorClear={() =>
                    contractModel.clearMethodError(method.name)
                  }
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
