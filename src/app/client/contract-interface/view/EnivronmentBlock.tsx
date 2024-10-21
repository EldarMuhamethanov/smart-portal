import { Flex, Typography, Select, Button, Input, SelectProps } from "antd";
import { observer } from "mobx-react-lite";
import { environmentModel } from "../model/AppModel";
import { RpcEndpointBlock } from "./RpcEndpointBlock";
import { useTranslationContext } from "./TranslationContext";
import { EnvironmentType } from "@/web3/Environment";

const ENVIRONMENTS: EnvironmentType[] = ["metamask", "hardhat", "foundry"];

export const EnvironmentBlock: React.FC = observer(() => {
  const onEnvChange: SelectProps["onChange"] = (value) => {
    environmentModel.setEnvironment(value);
  };
  const translation = useTranslationContext();
  return (
    <>
      <Flex vertical>
        <Typography.Title level={4}>
          {translation.t("select-env-title")}
        </Typography.Title>
        <Select
          placeholder={translation.t("select-env-title")}
          onChange={onEnvChange}
          value={environmentModel.environment}
          allowClear
          style={{
            maxWidth: "100%",
            width: 600,
          }}
        >
          {ENVIRONMENTS.map((environment) => (
            <Select.Option key={environment} value={environment}>
              {environment}
            </Select.Option>
          ))}
        </Select>
      </Flex>
      {environmentModel.environment &&
        environmentModel.environment === "metamask" &&
        !environmentModel.web3 && (
          <Button
            type="primary"
            onClick={environmentModel.tryToConnectMetamask}
            style={{ alignSelf: "flex-start" }}
          >
            Подключиться к Metamask
          </Button>
        )}
      {environmentModel.chainIdError && (
        <Input
          value={"Неподдерживаемая сеть, Пожалуйста выберете другую"}
          variant="filled"
          status="error"
        />
      )}
      {environmentModel.environment &&
        environmentModel.environment !== "metamask" && <RpcEndpointBlock />}
    </>
  );
});
