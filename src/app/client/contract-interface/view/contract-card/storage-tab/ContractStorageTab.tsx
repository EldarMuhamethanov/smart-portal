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
          <Form.Item
            label={t("contract-card.storage.number-slot")}
            name="slotNumber"
          >
            <InputNumber min={0} defaultValue={0} />
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
