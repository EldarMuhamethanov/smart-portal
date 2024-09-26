"use client";

import { Button, Card, Flex, notification } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { ReactNode, useLayoutEffect, useState } from "react";
import styles from "./ContractCard.module.css";
import classNames from "classnames";
import { ContractsMethodsTab } from "./methods-tab/ContractMethodsTab";
import { copyToClipboard } from "@/core/clipboard";
import { ContractStorageTab } from "./storage-tab/ContractStorageTab";
import { observer } from "mobx-react-lite";
import { getContractModel } from "@/contract-interface/model/AppModel";

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

export const ContractCard: React.FC<ContractCardProps> = observer(
  ({ address, onRemoveContract }) => {
    const cardModel = getContractModel(address);
    const [api, contextHolder] = notification.useNotification();
    const [activeTabKey, setActiveTabKey] = useState<string>("methods");
    const [expanded, setExpanded] = useState(true);

    useLayoutEffect(() => {
      cardModel.initState();
      cardModel.loadMethods();
    }, [cardModel]);

    const onCopy = () => {
      copyToClipboard(address);
      api.info({
        message: "Адресс контракта скопирован",
      });
    };

    const tabContent: Record<string, ReactNode> = {
      methods: <ContractsMethodsTab address={address} />,
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
          loading={cardModel.isLoading}
          tabList={cardModel.isLoading || expanded ? TAB_LIST : undefined}
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          className={classNames(
            !cardModel.isLoading && !expanded && styles.Card__collapsed
          )}
        >
          {tabContent[activeTabKey]}
        </Card>
      </>
    );
  }
);
