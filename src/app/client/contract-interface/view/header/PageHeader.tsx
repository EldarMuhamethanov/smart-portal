"use client";

import {
  Button,
  ConfigProvider,
  Flex,
  theme,
  Select,
  Image,
  Typography,
} from "antd";
import {
  MoonFilled,
  MoonOutlined,
  GithubOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { appSettings } from "@/app/client/contract-interface/model/AppModel";
import styles from "./PageHeader.module.css";
import { useRouter } from "next/navigation";
import { languages } from "@/app/i18n/settings";
import { useState } from "react";
import { DocumentationModal } from "../documentation/DocumentationModal";
import { useTranslation } from "@/app/i18n/client";
import { TranslationContext } from "../TranslationContext";

export const PageHeader: React.FC<{ lng: string }> = observer(({ lng }) => {
  const router = useRouter();
  const translation = useTranslation(lng);
  const [showDocs, setShowDocs] = useState(false);

  const changeLanguage = (lang: string) => {
    router.push(`/${lang}`);
  };

  return (
    <TranslationContext.Provider value={translation}>
      <ConfigProvider
        theme={{
          algorithm: appSettings.darkModeOn
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        }}
      >
        <Flex
          justify="space-between"
          align="center"
          style={{ height: "100%", position: "relative" }}
        >
          <Flex
            gap={10}
            style={{ height: "100%", position: "relative" }}
            align="center"
          >
            <Image src="/logo.png" height="98%" preview={false} alt="logo" />
            <Typography.Title
              level={3}
              style={{ marginBottom: 0 }}
              className={styles.logoTitle}
            >
              Smart Portal
            </Typography.Title>
          </Flex>
          <Flex gap={20}>
            <Select defaultValue={lng} size="large" onChange={changeLanguage}>
              {languages.map((language) => (
                <Select.Option key={language} value={language}>
                  {language.toLocaleUpperCase()}
                </Select.Option>
              ))}
            </Select>
            <Button
              icon={<GithubOutlined />}
              size="large"
              onClick={() =>
                window.open(
                  "https://github.com/EldarMuhamethanov/smart-portal",
                  "_blank"
                )
              }
            />
            <Button
              icon={appSettings.darkModeOn ? <MoonFilled /> : <MoonOutlined />}
              size="large"
              onClick={() => appSettings.setDarkMode(!appSettings.darkModeOn)}
            />
            <Button
              size="large"
              icon={<QuestionCircleOutlined />}
              onClick={() => setShowDocs(true)}
            />
          </Flex>
        </Flex>

        <DocumentationModal
          open={showDocs}
          onClose={() => setShowDocs(false)}
        />
      </ConfigProvider>
    </TranslationContext.Provider>
  );
});
