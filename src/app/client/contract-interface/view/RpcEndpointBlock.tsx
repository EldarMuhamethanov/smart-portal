import { Button, Flex, Form, Input } from "antd";
import { observer } from "mobx-react-lite";
import { environmentModel } from "../model/AppModel";
import { useEffect, useState } from "react";
import { FormProps } from "antd/lib";

export const RpcEndpointBlock: React.FC = observer(() => {
  const [form] = Form.useForm();
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [disabled, setIsDisabled] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form.setFieldValue("endpoint", environmentModel.rpcEndpoint);
  }, [environmentModel.rpcEndpoint]);

  useEffect(() => {
    setShowUpdateButton(values?.endpoint !== environmentModel.rpcEndpoint);
  }, [values]);

  useEffect(() => {
    if (environmentModel.rpcEndpointError) {
      form.setFields([
        {
          name: "endpoint",
          errors: [
            "При попытке подключения к локальному узлу произошла проблема",
          ],
        },
      ]);
    }
  }, [form, environmentModel.rpcEndpointError]);

  useEffect(() => {
    setIsDisabled((prev) => prev || environmentModel.rpcEndpointError);
  }, [environmentModel.rpcEndpointError]);

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setIsDisabled(false))
      .catch(() => setIsDisabled(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, values]);

  const onFinish: FormProps["onFinish"] = (values) => {
    environmentModel.updateRPCEndpoint(values.endpoint);
  };

  const rpcEndpointValidator = (_: unknown, value: string) => {
    const ethereumAddressRegex = /^http:\/\/localhost:\d+$/;
    if (!value || ethereumAddressRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject("Некорректный формат endpoint");
  };

  return (
    <Flex vertical>
      <Form
        form={form}
        name="rpc-endpoint"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="vertical"
      >
        <Form.Item
          label={"JSON RPC Endpoint"}
          name="endpoint"
          rules={[
            {
              required: true,
              message: "Поле обязательное",
            },
            {
              validator: rpcEndpointValidator,
            },
          ]}
          style={{
            marginBottom: 12,
          }}
        >
          <Input />
        </Form.Item>
        {
          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!showUpdateButton || disabled}
            >
              Изменить
            </Button>
          </Form.Item>
        }
      </Form>
    </Flex>
  );
});
