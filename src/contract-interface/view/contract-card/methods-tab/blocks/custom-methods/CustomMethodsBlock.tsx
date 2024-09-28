import { ContractCardModel } from "@/contract-interface/model/ContractCard/ContractCardModel";
import { Button, Card, Divider, Flex, Typography } from "antd";
import { Fragment, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import classNames from "classnames";
import styles from "./CustomMethodsBlock.module.css";
import { AddCustomMethodForm } from "./AddCustomMethodForm";
import { MethodForm, MethodFormProps } from "../../method-form/MethodForm";
import { observer } from "mobx-react-lite";

export const CustomMethodsBlock: React.FC<{
  contractModel: ContractCardModel;
  onCopyCalldata: MethodFormProps["onCopyCalldata"];
  onCopyParameters: MethodFormProps["onCopyParameters"];
}> = observer(({ contractModel, onCopyCalldata, onCopyParameters }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showAddMethodForm, setShowAddMethodForm] = useState(false);

  return (
    <Flex vertical>
      <Card
        type="inner"
        title={
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            Пользовательские методы
          </Typography.Title>
        }
        extra={
          <Flex gap={20}>
            <Button
              shape="circle"
              icon={collapsed ? <ArrowDownOutlined /> : <ArrowUpOutlined />}
              onClick={() => setCollapsed((v) => !v)}
            />
          </Flex>
        }
        className={classNames(collapsed && styles.Card__collapsed)}
      >
        <Flex vertical gap={20}>
          {!showAddMethodForm && (
            <Button type="primary" onClick={() => setShowAddMethodForm(true)}>
              Добавить метод
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
              Еще не добавлен ни один пользовательский метод. Вы можете добавить
              его с помощью кнопки &quot;Добавить метод&quot;
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
