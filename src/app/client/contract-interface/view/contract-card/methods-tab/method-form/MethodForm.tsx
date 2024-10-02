"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./MethodForm.module.css";
import {
  Flex,
  Button,
  ButtonProps,
  Form,
  FormProps,
  Input,
  Space,
  notification,
  Typography,
} from "antd";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import { FieldData, MethodType } from "../../types";
import { getValueByCheckedKey } from "@/core/typings";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { copyToClipboard } from "@/core/clipboard";
import { useTranslationContext } from "../../../TranslationContext";
import ReactJson from "react-json-view";
import { appSettings } from "@/app/client/contract-interface/model/AppModel";

type FieldDataWithValue = FieldData & {
  value: string;
};

const parseResult = (result: string) => {
  try {
    return JSON.parse(result);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return result;
  }
};

const ErrorBlock: React.FC<{
  error: string;
  onErrorClear: () => void;
}> = ({ error, onErrorClear }) => {
  return (
    <Flex gap={10} vertical align="flex-start">
      <Input readOnly value={error} status="error" variant="filled" />
      <Button size="small" icon={<DeleteOutlined />} onClick={onErrorClear}>
        Очистить
      </Button>
    </Flex>
  );
};

const ResultBlock: React.FC<{
  result: string[];
  onResultClear: () => void;
}> = ({ result, onResultClear }) => {
  return (
    <Flex gap={10} vertical align="flex-start">
      {result.map((item, index) => {
        const parsedRes = parseResult(item);
        return (
          <Flex key={item} gap={10}>
            <Typography.Text strong style={{ flexShrink: 0 }}>
              {index}:
            </Typography.Text>
            {typeof parsedRes === "object" ? (
              <ReactJson
                src={JSON.parse(item)}
                theme={appSettings.darkModeOn ? "twilight" : undefined}
              />
            ) : (
              <Flex gap={10} className={styles.resultRow}>
                <Typography.Text>{item}</Typography.Text>
                <Button
                  size="small"
                  className={styles.copyResultButton}
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(item)}
                ></Button>
              </Flex>
            )}
          </Flex>
        );
      })}
      <Button size="small" icon={<DeleteOutlined />} onClick={onResultClear}>
        Очистить
      </Button>
    </Flex>
  );
};

const TransactionResultBlock: React.FC<{
  transactionResult: object;
  onResultClear: () => void;
}> = ({ transactionResult, onResultClear }) => {
  return (
    <Flex gap={10} vertical align="flex-start">
      <ReactJson
        src={transactionResult}
        style={{ maxWidth: "100%", overflow: "auto" }}
        theme={appSettings.darkModeOn ? "twilight" : undefined}
      />
      <Button size="small" icon={<DeleteOutlined />} onClick={onResultClear}>
        Очистить
      </Button>
    </Flex>
  );
};

const MethodField: React.FC<
  FieldData & { onCopyResult: (name: string) => void }
> = ({ name, type, onCopyResult }) => {
  return (
    <Form.Item
      label={name}
      name={name}
      className={styles.methodField}
      rules={[{ required: true, message: "Поле обязательное к заполнению" }]}
    >
      <Input
        placeholder={type}
        suffix={
          <Button onClick={() => onCopyResult(name)} icon={<CopyOutlined />} />
        }
      />
    </Form.Item>
  );
};

export type MethodFormProps = {
  type: MethodType;
  name: string;
  fields: FieldData[];
  result: string[] | null;
  transactionResult: object | null;
  error: string | null;
  onRemove?: () => void;
  onCall: (
    methodName: string,
    type: MethodType,
    fields: FieldDataWithValue[]
  ) => void;
  onCopyCalldata: (methodName: string, fields: FieldDataWithValue[]) => void;
  onCopyParameters: (fields: FieldDataWithValue[]) => void;
  onResultClear: () => void;
  onTransactionResultClear: () => void;
  onErrorClear: () => void;
};

export const MethodForm: React.FC<MethodFormProps> = observer(
  ({
    type,
    name,
    fields,
    onRemove,
    onCall,
    error,
    result,
    transactionResult,
    onCopyCalldata,
    onCopyParameters,
    onResultClear,
    onTransactionResultClear,
    onErrorClear,
  }) => {
    const [form] = Form.useForm();
    const [isDisabled, setIsDisabled] = useState(false);
    const [api, contextHolder] = notification.useNotification();
    const { t } = useTranslationContext();

    const onCopyFieldData = (fieldName: string) => {
      copyToClipboard(form.getFieldValue(fieldName));
      api.info({
        message: t("contract-card.methods.copy-field-value", {
          fieldName: fieldName,
        }),
      });
    };

    const values = Form.useWatch([], form);

    useEffect(() => {
      if (!fields.length) {
        setIsDisabled(false);
        return;
      }
      form
        .validateFields({ validateOnly: true })
        .then(() => setIsDisabled(false))
        .catch(() => setIsDisabled(true));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, values]);

    const buttonProps = useMemo<Partial<ButtonProps>>(() => {
      return getValueByCheckedKey(type, {
        view: {
          color: "default",
          variant: "solid",
        },
        pure: {
          color: "default",
          variant: "outlined",
        },
        transaction: {
          type: "primary",
        },
      });
    }, [type]);

    const prepareFieldsData = (): FieldDataWithValue[] => {
      return fields.map((field) => ({
        name: field.name,
        type: field.type,
        value: form.getFieldValue(field.name),
      }));
    };

    const onSend: FormProps["onFinish"] = () => {
      onCall(name, type, prepareFieldsData());
    };

    const onSendFailed: FormProps["onFinishFailed"] = (errorInfo) => {
      console.log("onSendFailed", errorInfo);
    };

    return (
      <Form
        name={`method_${name}`}
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        onFinish={onSend}
        onFinishFailed={onSendFailed}
        layout="vertical"
      >
        {contextHolder}
        <Flex vertical gap={20}>
          <Flex align="center" gap={30}>
            <Button
              {...buttonProps}
              size="large"
              className={classNames(
                styles.methodButton,
                isDisabled && styles.methodButton__disabled
              )}
              htmlType={isDisabled ? undefined : "submit"}
            >
              <span className={styles.methodButton__text}>{name}</span>
            </Button>

            {onRemove && (
              <Button
                icon={<DeleteOutlined />}
                onClick={onRemove}
                shape="circle"
              />
            )}
          </Flex>
          {fields.length
            ? fields.map((field) => (
                <MethodField
                  key={field.name}
                  name={field.name}
                  type={field.type}
                  onCopyResult={onCopyFieldData}
                />
              ))
            : null}

          {fields.length ? (
            <Form.Item wrapperCol={{ span: 8 }} className={styles.methodField}>
              <Space>
                <Button
                  type="default"
                  icon={<CopyOutlined />}
                  onClick={() => onCopyCalldata(name, prepareFieldsData())}
                >
                  {t("common.calldata")}
                </Button>
                <Button
                  type="default"
                  icon={<CopyOutlined />}
                  onClick={() => onCopyParameters(prepareFieldsData())}
                >
                  {t("common.parameters")}
                </Button>
              </Space>
            </Form.Item>
          ) : null}
          {error && <ErrorBlock error={error} onErrorClear={onErrorClear} />}
          {result && (
            <ResultBlock result={result} onResultClear={onResultClear} />
          )}
          {transactionResult && (
            <TransactionResultBlock
              transactionResult={transactionResult}
              onResultClear={onTransactionResultClear}
            />
          )}
        </Flex>
      </Form>
    );
  }
);
