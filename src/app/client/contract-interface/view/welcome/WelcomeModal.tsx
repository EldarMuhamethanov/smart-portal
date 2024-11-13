import { Modal, Typography, Steps, Divider, Card, Space } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../TranslationContext";
import { LocalStorage } from "@/core/localStorage";
import {
  GlobalOutlined,
  CodeOutlined,
  DatabaseOutlined,
  ApiOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import styles from "./WelcomeModal.module.css";

const { Paragraph, Title, Text } = Typography;

const WELCOME_MODAL_SHOWN_KEY = "welcome-modal-shown";

export const WelcomeModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = observer(({ open, onClose }) => {
  const translation = useTranslationContext();

  const handleClose = () => {
    LocalStorage.setValue(WELCOME_MODAL_SHOWN_KEY, true);
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      width={900}
      title={
        <Title level={3} style={{ margin: 0 }}>
          {translation.t("welcome.title")}
        </Title>
      }
      className={styles.modal}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card className={styles.introCard}>
          <Title level={4}>{translation.t("welcome.intro.title")}</Title>
          <Paragraph>{translation.t("welcome.intro.description")}</Paragraph>
        </Card>

        <Divider orientation="left">
          <Space>
            <GlobalOutlined />
            <Text strong>{translation.t("welcome.features.title")}</Text>
          </Space>
        </Divider>

        <div className={styles.featuresGrid}>
          <Card className={styles.featureCard}>
            <Space>
              <ApiOutlined className={styles.featureIcon} />
              <Title level={5}>{translation.t("welcome.features.metamask.title")}</Title>
            </Space>
            <Paragraph>{translation.t("welcome.features.metamask.description")}</Paragraph>
          </Card>

          <Card className={styles.featureCard}>
            <Space>
              <CodeOutlined className={styles.featureIcon} />
              <Title level={5}>{translation.t("welcome.features.local.title")}</Title>
            </Space>
            <Paragraph>{translation.t("welcome.features.local.description")}</Paragraph>
          </Card>

          <Card className={styles.featureCard}>
            <Space>
              <ExperimentOutlined className={styles.featureIcon} />
              <Title level={5}>{translation.t("welcome.features.methods.title")}</Title>
            </Space>
            <Paragraph>{translation.t("welcome.features.methods.description")}</Paragraph>
          </Card>

          <Card className={styles.featureCard}>
            <Space>
              <DatabaseOutlined className={styles.featureIcon} />
              <Title level={5}>{translation.t("welcome.features.storage.title")}</Title>
            </Space>
            <Paragraph>{translation.t("welcome.features.storage.description")}</Paragraph>
          </Card>
        </div>

        <Divider orientation="left">
          <Space>
            <ExperimentOutlined />
            <Text strong>{translation.t("welcome.getStarted.title")}</Text>
          </Space>
        </Divider>

        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: translation.t("welcome.getStarted.step1.title"),
              description: translation.t("welcome.getStarted.step1.description"),
            },
            {
              title: translation.t("welcome.getStarted.step2.title"),
              description: translation.t("welcome.getStarted.step2.description"),
            },
            {
              title: translation.t("welcome.getStarted.step3.title"),
              description: translation.t("welcome.getStarted.step3.description"),
            },
          ]}
        />
      </Space>
    </Modal>
  );
}); 