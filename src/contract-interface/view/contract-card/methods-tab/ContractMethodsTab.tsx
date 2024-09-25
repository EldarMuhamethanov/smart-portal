import { Typography, Flex, Divider, notification } from "antd";
import { MethodForm, MethodFormProps } from "../method-form/MethodForm";
import { Fragment } from "react";
import { observer } from "mobx-react-lite";
import { getContractModel } from "@/contract-interface/model/AppModel";
import { copyToClipboard } from "@/core/clipboard";

type ContractsMethodsTabProps = {
  address: string;
};

export const ContractsMethodsTab: React.FC<ContractsMethodsTabProps> = observer(
  ({ address }) => {
    const [api, contextHolder] = notification.useNotification();

    const contractModel = getContractModel(address);

    const onCopyCalldata: MethodFormProps["onCopyCalldata"] = (
      methodName,
      fields
    ) => {
      copyToClipboard(contractModel.createCalldata(methodName, fields));
      api.info({
        message: "Calldata скопирована в буфер обмена",
      });
    };

    const onCopyParameters: MethodFormProps["onCopyParameters"] = (fields) => {
      copyToClipboard(contractModel.createParameters(fields));
      api.info({
        message: "Параметры скопированы в буфер обмена",
      });
    };

    return !contractModel.verified ? (
      <Typography.Paragraph>
        К сожалению данный контракт не верифицирован, поэтому мы не можем
        отобразить его методы
      </Typography.Paragraph>
    ) : (
      <Flex vertical gap={20}>
        {contextHolder}
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
    );
  }
);
