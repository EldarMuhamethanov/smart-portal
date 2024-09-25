import { Typography, Flex, Divider } from "antd";
import { MethodForm, MethodFormProps } from "../method-form/MethodForm";
import { ContractMethod } from "../types";
import { Fragment, useState } from "react";
import { observer } from "mobx-react-lite";
import { environmentModel } from "@/contract-interface/model/AppModel";
import { ABI } from "@/web3/ABI";

type ContractsMethodsTabProps = {
  address: string;
  abi: ABI | null;
  notVerifiedContract: boolean;
  methodsData: ContractMethod[];
};

export const ContractsMethodsTab: React.FC<ContractsMethodsTabProps> = observer(
  ({ address, notVerifiedContract, methodsData, abi }) => {
    const [methodToResult, setMethodToResult] = useState<
      Record<string, string>
    >({});

    const _updateMethodResult = (methodName: string, result: string) => {
      setMethodToResult((v) => ({
        ...v,
        [methodName]: result,
      }));
    };

    const onCallMethod: MethodFormProps["onCall"] = async (
      methodName,
      methodType,
      fields
    ) => {
      if (!abi) {
        return;
      }
      const web3 = environmentModel.web3!;

      const contract = new web3.eth.Contract(abi, address);
      const argsValues = fields.map((field) => field.value);

      if (methodType === "pure" || methodType === "view") {
        try {
          const result = await contract.methods[methodName](
            ...argsValues
          ).call();
          if (typeof result === "string") {
            _updateMethodResult(methodName, result);
          }
          return;
        } catch (e) {
          console.error("Failed to call method: ", e);
          return;
        }
      }

      const accounts = await web3.eth.getAccounts();
      try {
        await contract.methods[methodName](...argsValues).send({
          from: accounts[0],
        });
      } catch (e) {
        console.error("Failed to call method: ", e);
        return;
      }
    };

    return notVerifiedContract ? (
      <Typography.Paragraph>
        К сожалению данный контракт не верифицирован, поэтому мы не можем
        отобразить его методы
      </Typography.Paragraph>
    ) : (
      <Flex vertical gap={20}>
        {methodsData.map((method, index) => (
          <Fragment key={method.name}>
            <MethodForm
              type={method.type}
              name={method.name}
              fields={method.fields}
              result={methodToResult[method.name]}
              onCall={onCallMethod}
              onCopyCalldata={() => {}}
              onCopyParameters={() => {}}
            />
            {index < methodsData.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Flex>
    );
  }
);
