"use client";

import { Button, Flex, ConfigProvider, theme } from "antd";
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
import { observer } from "mobx-react-lite";
import { useSingleLayoutEffect } from "@/core/hooks/useSingleLayoutEffect";
import { darkTheme, lightTheme } from "../model/Settings/themes";
import { useTranslation } from "@/app/i18n/client";
import {
  TranslationContext,
  useTranslationContext,
} from "./TranslationContext";
import { EnvironmentBlock } from "./EnivronmentBlock";
import { WelcomeModal } from "./welcome/WelcomeModal";
import { LocalStorage } from "@/core/localStorage";

const WELCOME_MODAL_SHOWN_KEY = "welcome-modal-shown";

const AddContractBlock: React.FC = observer(() => {
  const translation = useTranslationContext();
  const [showAddingContractForm, setShowAddingContractForm] = useState(false);

  const showAddContractButton = !!environmentModel.web3;
  return (
    <>
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
        </>
      )}
    </>
  );
});

const useColorScheme = (darkModeOn: boolean) => {
  useEffect(() => {
    const themeObject = darkModeOn ? darkTheme : lightTheme;
    Object.entries(themeObject).forEach(([cssVariable, value]) => {
      document.documentElement.style.setProperty(cssVariable, value);
    });
  }, [darkModeOn]);
};

export const ContractInterface: React.FC<{ lng: string }> = observer(
  ({ lng }) => {
    const translation = useTranslation(lng);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
      const wasShown = LocalStorage.getValue(WELCOME_MODAL_SHOWN_KEY);
      if (!wasShown) {
        setShowWelcome(true);
      }
    }, []);

    useSingleLayoutEffect(() => {
      environmentModel.initState();
      appSettings.initState();
    });

    useColorScheme(appSettings.darkModeOn);

    return (
      <TranslationContext.Provider value={translation}>
        <ConfigProvider
          theme={{
            algorithm: appSettings.darkModeOn
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          }}
        >
          <div className={styles.page}>
            <Flex vertical gap={20}>
              <EnvironmentBlock />
              <AddContractBlock />
              <ContractsList />
            </Flex>
          </div>
          <WelcomeModal 
            open={showWelcome} 
            onClose={() => setShowWelcome(false)} 
          />
        </ConfigProvider>
      </TranslationContext.Provider>
    );
  }
);
