"use client";

import { Button, Card, Flex, notification } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { ReactNode, useEffect, useState } from "react";
import { ContractMethod } from "./types";
import { remapABItoMethodsData } from "./helpers";
import styles from "./ContractCard.module.css";
import classNames from "classnames";
import { getABI } from "@/web3/getAbi";
import { ContractsMethodsTab } from "./methods-tab/ContractMethodsTab";
import { copyToClipboard } from "@/core/clipboard";
import { ContractStorageTab } from "./storage-tab/ContractStorageTab";
import { ABI } from "@/web3/ABI";

const TAB_LIST = [
  {
    key: "methods",
    tab: "Методы",
  },
  {
    key: "storage",
    tab: "Storage",
  },
];

const CardExtra: React.FC<{
  expanded: boolean;
  onCopy: () => void;
  onRemove: () => void;
  onExpandChange: () => void;
}> = ({ onCopy, onRemove, expanded, onExpandChange }) => {
  return (
    <Flex gap={20}>
      <Button shape="circle" icon={<CopyOutlined />} onClick={onCopy} />
      <Button shape="circle" icon={<DeleteOutlined />} onClick={onRemove} />
      <Button
        shape="circle"
        icon={expanded ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
        onClick={onExpandChange}
      />
    </Flex>
  );
};

type ContractCardProps = {
  address: string;
  onRemoveContract: () => void;
};

export const ContractCard: React.FC<ContractCardProps> = ({
  address,
  onRemoveContract,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [abi, setAbi] = useState<ABI | null>(null);
  const [methodsData, setMethodsData] = useState<ContractMethod[]>([]);
  const [notVerifiedContract, setNotVerifiedContract] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState<string>("methods");
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const loadMethods = async () => {
      setIsLoading(true);
      const network = "sepolia";
      const abi = await getABI(address, network);
      console.log("abi", abi);
      if (!abi) {
        setNotVerifiedContract(true);
      } else {
        const result = remapABItoMethodsData(abi);
        setMethodsData(result);
        setAbi(abi);
      }
      setIsLoading(false);
    };
    loadMethods();
  }, [address]);

  const onCopy = () => {
    copyToClipboard(address);
    api.info({
      message: "Адресс контракта скопирован",
    });
  };

  const tabContent: Record<string, ReactNode> = {
    methods: (
      <ContractsMethodsTab
        address={address}
        abi={abi}
        notVerifiedContract={notVerifiedContract}
        methodsData={methodsData}
      />
    ),
    storage: <ContractStorageTab address={address} />,
  };

  return (
    <>
      {contextHolder}
      <Card
        title={address}
        extra={
          <CardExtra
            onCopy={onCopy}
            onRemove={onRemoveContract}
            expanded={expanded}
            onExpandChange={() => setExpanded((v) => !v)}
          />
        }
        loading={isLoading}
        tabList={isLoading || expanded ? TAB_LIST : undefined}
        activeTabKey={activeTabKey}
        onTabChange={setActiveTabKey}
        className={classNames(
          !isLoading && !expanded && styles.Card__collapsed
        )}
      >
        {tabContent[activeTabKey]}
      </Card>
    </>
  );
};
