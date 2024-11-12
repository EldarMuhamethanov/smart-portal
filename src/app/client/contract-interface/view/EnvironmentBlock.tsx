import { Button, Flex, Input, Select, SelectProps, Typography } from "antd";
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
  
  const { t } = useTranslationContext();
  
  return (
    <Flex vertical>
      <Typography.Title level={4}>
        {t("select-env-title")}
      </Typography.Title>
      <Select
        placeholder={t("select-env-title")}
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

      {environmentModel.environment &&
        environmentModel.environment === "metamask" &&
        !environmentModel.web3 && (
          <Button
            type="primary"
            onClick={environmentModel.tryToConnectMetamask}
            style={{ alignSelf: "flex-start" }}
          >
            {t("environment.connect-metamask")}
          </Button>
        )}
        
      {environmentModel.chainIdError && (
        <Input
          value={t("environment.unsupported-network")}
          variant="filled"
          status="error"
        />
      )}
      
      {environmentModel.environment &&
        environmentModel.environment !== "metamask" && <RpcEndpointBlock />}
    </Flex>
  );
}); 