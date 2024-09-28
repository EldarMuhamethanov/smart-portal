"use client";

import {
  Button,
  Flex,
  Select,
  SelectProps,
  ConfigProvider,
  theme,
  Typography,
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

const ENVIRONMENTS: EnvironmentType[] = ["metamask", "hardhat"];

export const ContractInterface: React.FC = observer(() => {
  const [showAddingContractForm, setShowAddingContractForm] = useState(false);

  const onEnvChange: SelectProps["onChange"] = (value) => {
    environmentModel.setEnvironment(value);
  };

  useSingleLayoutEffect(() => {
    environmentModel.initState();
  });

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--page-background-color",
      appSettings.darkModeOn ? "#000000" : "#ffffff"
    );

    document.documentElement.style.setProperty(
      "--page-text-color",
      appSettings.darkModeOn ? "#ffffffd9" : "#000000e0"
    );

    document.documentElement.style.setProperty(
      "--page-header-color",
      appSettings.darkModeOn ? "#000000" : "#ffffff"
    );

    document.documentElement.style.setProperty(
      "--page-header-box-shadow",
      appSettings.darkModeOn
        ? "0 1px 3px rgb(255 255 255 / 22%)"
        : "0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)"
    );
  }, [appSettings.darkModeOn]);

  return (
    <ConfigProvider
      theme={{
        algorithm: appSettings.darkModeOn
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm,
      }}
    >
      <Flex vertical className={styles.container} gap={20}>
        <Flex vertical>
          <Typography.Title level={4}>Выберите окружение</Typography.Title>
          <Select
            placeholder="Выберите окружение"
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

        {environmentModel.environment && (
          <>
            {!showAddingContractForm && (
              <Button
                type="primary"
                onClick={() => setShowAddingContractForm(true)}
                icon={<PlusOutlined />}
                iconPosition="end"
              >
                Добавить контракт
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
  );
});
