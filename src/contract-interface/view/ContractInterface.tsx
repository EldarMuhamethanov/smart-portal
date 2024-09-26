"use client";

import { Button, Flex, Select, SelectProps } from "antd";
import styles from "./ContractInterface.module.css";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { AddContractCard } from "./add-contract-card/AddContractCard";
import { ContractsList } from "./ContractsList";
import { environmentModel, smartContracts } from "../model/AppModel";
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

  return (
    <Flex vertical className={styles.container} gap={20}>
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
  );
});
