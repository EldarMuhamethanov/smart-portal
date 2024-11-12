import {
  Button,
  Form,
  FormProps,
  Input,
  InputNumber,
  notification,
  Radio,
} from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { MouseEventHandler, useLayoutEffect, useState } from "react";
import { copyToClipboard } from "@/core/clipboard";
import { observer } from "mobx-react-lite";
import { ContractCardModel } from "@/app/client/contract-interface/model/ContractCard/ContractCardModel";
import { useTranslationContext } from "../../TranslationContext";

type ContractStorageTabProps = {
  contractModel: ContractCardModel;
};

export const ContractStorageTab: React.FC<ContractStorageTabProps> = observer(
  ({ contractModel }) => {
    const [form] = Form.useForm();
    const [api, contextHolder] = notification.useNotification();
    const { t } = useTranslationContext();
    const [isHashInput, setIsHashInput] = useState(false);

    const onFinish: FormProps["onFinish"] = async (values) => {
      const result = await contractModel.getDataFromStorage(values.slotNumber);
      form.setFieldValue("result", result);
    };

    const onCopyResult: MouseEventHandler<HTMLElement> = (e) => {
      e.preventDefault();
      copyToClipboard(form.getFieldValue("result"));
      api.info({
        message: t("contract-card.storage.result-copied"),
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
          <Form.Item>
            <Radio.Group 
              onChange={(e) => setIsHashInput(e.target.value)} 
              value={isHashInput}
            >
              <Radio value={false}>{t("contract-card.storage.number-input")}</Radio>
              <Radio value={true}>{t("contract-card.storage.hash-input")}</Radio>
            </Radio.Group>
          </Form.Item>
          
          <Form.Item
            label={t("contract-card.storage.number-slot")}
            name="slotNumber"
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(t("contract-card.storage.slot-required"));
                  }
                  if (isHashInput) {
                    if (!value.startsWith('0x')) {
                      return Promise.reject(t("contract-card.storage.invalid-hash"));
                    }
                  } else {
                    if (isNaN(Number(value)) || Number(value) < 0) {
                      return Promise.reject(t("contract-card.storage.invalid-number"));
                    }
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            {isHashInput ? (
              <Input placeholder="0x..." />
            ) : (
              <InputNumber min={0} defaultValue={0} style={{ width: '100%' }} />
            )}
          </Form.Item>

          <Form.Item
            label={t("contract-card.storage.result")}
            name="result"
            style={{ width: "100%" }}
          >
            <Input
              suffix={<Button onClick={onCopyResult} icon={<CopyOutlined />} />}
              readOnly
            />
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              {t("contract-card.storage.get-value")}
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
);
