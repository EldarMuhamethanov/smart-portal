import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { Button, Card, Divider, Flex, Typography } from "antd";
import { Fragment, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import classNames from "classnames";
import styles from "./CustomMethodsBlock.module.css";
import { AddCustomMethodForm } from "./AddCustomMethodForm";
import { MethodForm, MethodFormProps } from "../../method-form/MethodForm";
import { observer } from "mobx-react-lite";
import { useTranslationContext } from "../../../../TranslationContext";

export const CustomMethodsBlock: React.FC<{
  contractModel: ContractCardModel;
  onCopyCalldata: MethodFormProps["onCopyCalldata"];
  onCopyParameters: MethodFormProps["onCopyParameters"];
}> = observer(({ contractModel, onCopyCalldata, onCopyParameters }) => {
  const { t } = useTranslationContext();
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);

  return (
    <Flex vertical>
      <Card
        type="inner"
        title={
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            {t("contract-card.methods.custom-methods")}
          </Typography.Title>
        }
        extra={
          <Flex gap={20}>
            <Button
              shape="circle"
              icon={
                contractModel.customMethodsExpanded ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              onClick={() =>
                contractModel.setCustomMethodsExpanded(
                  !contractModel.customMethodsExpanded
                )
              }
            />
          </Flex>
        }
        className={classNames(
          !contractModel.customMethodsExpanded && styles.Card__collapsed
        )}
      >
        <Flex vertical gap={20}>
          {!showAddMethodForm && (
            <Button type="primary" onClick={() => setShowAddMethodForm(true)}>
              {t("contract-card.methods.add-custom-method")}
            </Button>
          )}
          {showAddMethodForm && (
            <AddCustomMethodForm
              onCancel={() => setShowAddMethodForm(false)}
              onAddMethod={(methodData) => {
                setShowAddMethodForm(false);
                contractModel.addCustomMethod(methodData);
              }}
            />
          )}
          {!contractModel.customMethods.length ? (
            <Typography.Paragraph>
              {t("contract-card.methods.custom-methods-placeholder")}
            </Typography.Paragraph>
          ) : null}
          <Flex vertical>
            {contractModel.customMethods.map((method, index) => (
              <Fragment key={method.name}>
                <MethodForm
                  type={method.type}
                  name={method.name}
                  fields={method.fields}
                  result={null}
                  onCall={(_, type, fields) =>
                    contractModel.callCustomMethod(method.id, type, fields)
                  }
                  onRemove={() => contractModel.removeCustomMethod(method.id)}
                  onCopyCalldata={onCopyCalldata}
                  onCopyParameters={onCopyParameters}
                />
                {index < contractModel.customMethods.length - 1 && <Divider />}
              </Fragment>
            ))}
          </Flex>
        </Flex>
      </Card>
    </Flex>
  );
});
