"use client";

import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import styles from "./MethodForm.module.css";
import { Flex, Button, ButtonProps, Form, FormProps, Input, Space } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { FieldData, MethodType } from "../types";
import { getValueByCheckedKey } from "@/core/typings";
import classNames from "classnames";

type FieldDataWithValue = FieldData & {
  value: string;
};

const MethodField: React.FC<FieldData & { onInput: () => void }> = ({
  name,
  type,
  onInput,
}) => {
  return (
    <Form.Item label={name} name={name} className={styles.methodField}>
      <Input onInput={onInput} placeholder={type} />
    </Form.Item>
  );
};

export type MethodFormProps = {
  type: MethodType;
  name: string;
  fields: FieldData[];
  result: string | null;
  onCall: (
    methodName: string,
    type: MethodType,
    fields: FieldDataWithValue[]
  ) => void;
  onCopyCalldata: (methodName: string, fields: FieldDataWithValue[]) => void;
  onCopyParameters: (fields: FieldDataWithValue[]) => void;
};

export const MethodForm: React.FC<MethodFormProps> = ({
  type,
  name,
  fields,
  onCall,
  result,
  onCopyCalldata,
  onCopyParameters,
}) => {
  const [form] = Form.useForm();
  const [isDisabled, setIsDisabled] = useState(false);

  const onFieldUpdated = useCallback(() => {
    setIsDisabled(fields.some((field) => !form.getFieldValue(field)));
  }, [fields, form]);

  useLayoutEffect(() => {
    onFieldUpdated();
  }, [onFieldUpdated]);

  const buttonProps = useMemo<Partial<ButtonProps>>(() => {
    return getValueByCheckedKey(type, {
      view: {
        color: "default",
        variant: "solid",
      },
      pure: {
        color: "default",
        variant: "solid",
      },
      update: {
        type: "primary",
      },
    });
  }, [type]);

  const prepareFieldsData = (): FieldDataWithValue[] => {
    return fields.map((field) => ({
      name: field.name,
      type: field.type,
      value: form.getFieldValue(field),
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
      name="method"
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 500 }}
      onFinish={onSend}
      onFinishFailed={onSendFailed}
      layout="vertical"
    >
      <Flex vertical gap={20}>
        <Flex>
          <Button
            {...buttonProps}
            className={classNames(
              styles.methodButton,
              isDisabled && styles.methodButton__disabled
            )}
            htmlType={isDisabled ? undefined : "submit"}
          >
            <span className={styles.methodButton__text}>{name}</span>
          </Button>
        </Flex>
        {fields.length
          ? fields.map((field) => (
              <MethodField
                key={field.name}
                name={field.name}
                type={field.type}
                onInput={onFieldUpdated}
              />
            ))
          : null}

        {fields.length ? (
          <Form.Item wrapperCol={{ offset: 4, span: 8 }}>
            <Space>
              <Button
                type="default"
                icon={<CopyOutlined />}
                onClick={() => onCopyCalldata(name, prepareFieldsData())}
              >
                Calldata
              </Button>
              <Button
                type="default"
                icon={<CopyOutlined />}
                onClick={() => onCopyParameters(prepareFieldsData())}
              >
                Parameters
              </Button>
            </Space>
          </Form.Item>
        ) : null}
        {result && <span>{result}</span>}
      </Flex>
    </Form>
  );
};
