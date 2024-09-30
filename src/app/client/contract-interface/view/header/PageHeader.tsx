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
import { MoonFilled, MoonOutlined } from "@ant-design/icons";
import { observer } from "mobx-react-lite";
import { appSettings } from "@/app/client/contract-interface/model/AppModel";
import styles from "./PageHeader.module.css";
import { useRouter } from "next/navigation";
import { languages } from "@/app/i18n/settings";

export const PageHeader: React.FC<{ lng: string }> = observer(({ lng }) => {
  const router = useRouter();

  const changeLanguage = (lang: string) => {
    router.push(`/${lang}`);
  };

  return (
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
            icon={appSettings.darkModeOn ? <MoonFilled /> : <MoonOutlined />}
            size="large"
            onClick={() => appSettings.setDarkMode(!appSettings.darkModeOn)}
          />
        </Flex>
      </Flex>
    </ConfigProvider>
  );
});
