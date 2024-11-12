import { Modal, Typography, Steps, Divider } from "antd";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../TranslationContext";

const { Paragraph } = Typography;

export const DocumentationModal: React.FC<{
  open: boolean;
  onClose: () => void;
}> = observer(({ open, onClose }) => {
  const translation = useTranslationContext();

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      title={translation.t("documentation.title")}
      className="documentation-modal"
    >
      <Typography>
        <Steps
          direction="vertical"
          current={-1}
          items={[
            {
              title: translation.t("documentation.step1.title"),
              description: (
                <>
                  <Paragraph>
                    {translation.t("documentation.step1.description")}
                  </Paragraph>
                  <Divider orientation="left">
                    {translation.t("documentation.step1.metamask.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step1.metamask.description")}
                  </Paragraph>
                  <Divider orientation="left">
                    {translation.t("documentation.step1.local.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step1.local.description")}
                  </Paragraph>
                  <ul>
                    <li>
                      <strong>Hardhat:</strong>{" "}
                      {translation.t("documentation.step1.local.hardhat")}
                    </li>
                    <li>
                      <strong>Foundry:</strong>{" "}
                      {translation.t("documentation.step1.local.foundry")}
                    </li>
                  </ul>
                  <Paragraph>
                    {translation.t("documentation.step1.local.rpc_description")}
                  </Paragraph>
                  <ul>
                    <li>
                      <strong>Hardhat:</strong> http://127.0.0.1:8545
                    </li>
                    <li>
                      <strong>Foundry:</strong> http://127.0.0.1:8545
                    </li>
                  </ul>
                </>
              ),
            },
            {
              title: translation.t("documentation.step2.title"),
              description: (
                <Paragraph>
                  {translation.t("documentation.step2.description")}
                </Paragraph>
              ),
            },
            {
              title: translation.t("documentation.step3.title"),
              description: (
                <>
                  <Paragraph>
                    {translation.t("documentation.step3.description")}
                  </Paragraph>
                  <Divider orientation="left">
                    {translation.t("documentation.step3.tabs.methods.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step3.tabs.methods.description")}
                  </Paragraph>
                  <ul>
                    <li>
                      {translation.t(
                        "documentation.step3.tabs.methods.verification"
                      )}
                    </li>
                    <li>
                      {translation.t(
                        "documentation.step3.tabs.methods.constructor"
                      )}
                    </li>
                    <li>
                      {translation.t(
                        "documentation.step3.tabs.methods.custom_methods"
                      )}
                    </li>
                  </ul>

                  <Divider orientation="left">
                    {translation.t("documentation.step3.tabs.storage.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step3.tabs.storage.description")}
                  </Paragraph>

                  <Divider orientation="left">
                    {translation.t("documentation.step3.tabs.code.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step3.tabs.code.description")}
                  </Paragraph>

                  <Divider orientation="left">
                    {translation.t("documentation.step3.tabs.abi.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step3.tabs.abi.description")}
                  </Paragraph>

                  <Divider orientation="left">
                    {translation.t("documentation.step3.tabs.events.title")}
                  </Divider>
                  <Paragraph>
                    {translation.t("documentation.step3.tabs.events.description")}
                  </Paragraph>
                </>
              ),
            },
          ]}
        />
      </Typography>
    </Modal>
  );
});
