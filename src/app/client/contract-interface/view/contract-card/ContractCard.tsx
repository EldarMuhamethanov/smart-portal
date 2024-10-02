"use client";

import { Button, Card, Flex, notification } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { ReactNode, useState } from "react";
import styles from "./ContractCard.module.css";
import classNames from "classnames";
import { ContractsMethodsTab } from "./methods-tab/ContractMethodsTab";
import { copyToClipboard } from "@/core/clipboard";
import { ContractStorageTab } from "./storage-tab/ContractStorageTab";
import { observer } from "mobx-react-lite";
import { getContractModel } from "@/app/client/contract-interface/model/AppModel";
import { addContractLoadToQueue } from "@/app/client/contract-interface/model/ContractCard/contractsLoadsQueue";
import { useSingleLayoutEffect } from "@/core/hooks/useSingleLayoutEffect";
import { ContractCodeTab } from "./code-tab/ContractCodeTab";
import { useTranslationContext } from "../TranslationContext";
import { ContractAbiTab } from "./abi-tab/ContractAbiTab";

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
    const { t } = useTranslationContext();
    const [api, contextHolder] = notification.useNotification();
    const [activeTabKey, setActiveTabKey] = useState<string>("methods");

    useSingleLayoutEffect(() => {
      cardModel.initState();
      addContractLoadToQueue(address, cardModel);
    });

    const onCopy = () => {
      copyToClipboard(address);
      api.info({
        message: t("contract-card.address-copied"),
      });
    };

    const tabList = [
      {
        key: "methods",
        tab: t("contract-card.methods-tab"),
      },
      {
        key: "storage",
        tab: t("contract-card.storage-tab"),
      },
      {
        key: "code",
        tab: t("contract-card.code-tab"),
      },
      {
        key: "abi",
        tab: "ABI",
      },
    ];

    const tabContent: Record<string, ReactNode> = {
      methods: <ContractsMethodsTab contractModel={cardModel} />,
      storage: <ContractStorageTab contractModel={cardModel} />,
      code: <ContractCodeTab contractModel={cardModel} />,
      abi: <ContractAbiTab contractModel={cardModel} />,
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
              expanded={cardModel.expanded}
              onExpandChange={() => cardModel.setExpanded(!cardModel.expanded)}
            />
          }
          loading={cardModel.isLoading}
          tabList={
            cardModel.isLoading || cardModel.expanded ? tabList : undefined
          }
          activeTabKey={activeTabKey}
          onTabChange={setActiveTabKey}
          className={classNames(
            !cardModel.isLoading &&
              !cardModel.expanded &&
              styles.Card__collapsed
          )}
        >
          {tabContent[activeTabKey]}
        </Card>
      </>
    );
  }
);
