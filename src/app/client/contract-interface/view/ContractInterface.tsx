"use client";

import {
  Button,
  Flex,
  Select,
  SelectProps,
  ConfigProvider,
  theme,
  Typography,
  Input,
} from "antd";
import styles from "./ContractInterface.module.css";
import { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { AddContractCard } from "./add-contract-card/AddContractCard";
import { ContractsList } from "./ContractsList";
import {
  appSettings,
  environmentModel,
  smartContracts,
} from "../model/AppModel";
import { EnvironmentType } from "@/web3/Environment";
import { observer } from "mobx-react-lite";
import { useSingleLayoutEffect } from "@/core/hooks/useSingleLayoutEffect";
import { darkTheme, lightTheme } from "../model/Settings/themes";
import { useTranslation } from "@/app/i18n/client";
import { TranslationContext } from "./TranslationContext";
import { RpcEndpointBlock } from "./RpcEndpointBlock";

const ENVIRONMENTS: EnvironmentType[] = ["metamask", "hardhat", "foundry"];

export const ContractInterface: React.FC<{ lng: string }> = observer(
  ({ lng }) => {
    const [showAddingContractForm, setShowAddingContractForm] = useState(false);
    const translation = useTranslation(lng);

    const onEnvChange: SelectProps["onChange"] = (value) => {
      environmentModel.setEnvironment(value);
    };

    useSingleLayoutEffect(() => {
      environmentModel.initState();
      appSettings.initState();
    });

    useEffect(() => {
      const themeObject = appSettings.darkModeOn ? darkTheme : lightTheme;
      Object.entries(themeObject).forEach(([cssVariable, value]) => {
        document.documentElement.style.setProperty(cssVariable, value);
      });
    }, [appSettings.darkModeOn]);

    const showAddContractButton = !!environmentModel.web3;
    return (
      <TranslationContext.Provider value={translation}>
        <ConfigProvider
          theme={{
            algorithm: appSettings.darkModeOn
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          }}
        >
          <Flex vertical className={styles.container} gap={15}>
            <Flex vertical>
              <Typography.Title level={4}>
                {translation.t("select-env-title")}
              </Typography.Title>
              <Select
                placeholder={translation.t("select-env-title")}
                onChange={onEnvChange}
                value={environmentModel.environment}
                allowClear
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
              environmentModel.environment !== "metamask" && (
                <RpcEndpointBlock />
              )}

            {showAddContractButton && (
              <>
                {!showAddingContractForm && (
                  <Button
                    type="primary"
                    onClick={() => setShowAddingContractForm(true)}
                    icon={<PlusOutlined />}
                    iconPosition="end"
                    size="large"
                    style={{
                      alignSelf: "flex-start",
                    }}
                  >
                    {translation.t("add-contract-button")}
                  </Button>
                )}
                {showAddingContractForm && (
                  <AddContractCard
                    onCancel={() => setShowAddingContractForm(false)}
                    onSubmit={(address) => {
                      smartContracts.addContract(address);
                      setShowAddingContractForm(false);
                    }}
                  />
                )}
                <ContractsList />
              </>
            )}
          </Flex>
        </ConfigProvider>
      </TranslationContext.Provider>
    );
  }
);
