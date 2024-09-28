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
import { appSettings } from "@/contract-interface/model/AppModel";
import styles from "./PageHeader.module.css";

export const PageHeader: React.FC = observer(() => {
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
          <Image src="/logo.png" height="98%" preview={false} />
          <Typography.Title
            level={3}
            style={{ marginBottom: 0 }}
            className={styles.logoTitle}
          >
            SmartPortal
          </Typography.Title>
        </Flex>
        <Flex gap={20}>
          <Select defaultValue="ru" size="large">
            <Select.Option value="ru">RU</Select.Option>
            <Select.Option value="en">EN</Select.Option>
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
