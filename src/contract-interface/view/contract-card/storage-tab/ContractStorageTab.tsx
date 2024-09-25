import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  notification,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { MouseEventHandler, useLayoutEffect } from "react";
import { copyToClipboard } from "@/core/clipboard";
import { observer } from "mobx-react-lite";
import { environmentModel } from "@/contract-interface/model/AppModel";

type ContractStorageTabProps = {
  address: string;
};

export const ContractStorageTab: React.FC<ContractStorageTabProps> = observer(
  ({ address }) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();

    const onFinish: FormProps["onFinish"] = async (values) => {
      const web3 = environmentModel.web3!;
      const result = await web3.eth.getStorageAt(address, values.slotNumber);
      form.setFieldValue("result", result);
    };

    const onCopyResult: MouseEventHandler<HTMLElement> = (e) => {
      e.preventDefault();
      copyToClipboard(form.getFieldValue("result"));
      api.info({
        message: "Результат скопирован",
      });
    };

    useLayoutEffect(() => {
      form.setFieldValue("slotNumber", 0);
    }, [form]);

    return (
      <>
        {contextHolder}
        <Form
          name="method"
          form={form}
          labelCol={{ span: 8 }}
          style={{ maxWidth: 800 }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item label="Номер слота" name="slotNumber">
            <InputNumber min={0} defaultValue={0} />
          </Form.Item>
          <Form.Item label="Результат" name="result" style={{ width: "100%" }}>
            <Input
              suffix={<Button onClick={onCopyResult} icon={<CopyOutlined />} />}
              readOnly
            />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Получить данные
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
);
