import { Button, Card, Form, Input, FormProps } from "antd";
import { useTranslationContext } from "../TranslationContext";

type AddContractCardProps = {
  onCancel: () => void;
  onSubmit: (address: string) => void;
};

export const AddContractCard: React.FC<AddContractCardProps> = ({
  onCancel,
  onSubmit,
}) => {
  const { t } = useTranslationContext();
  const onFinish: FormProps["onFinish"] = (values) => {
    onSubmit(values.address);
  };

  const onFinisFailed: FormProps["onFinishFailed"] = (errorInfo) => {
    console.log("errorInfo", errorInfo);
  };

  const ethereumAddressValidator = (_: unknown, value: string) => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!value || ethereumAddressRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(t("adding-contract-card.incorrect-contract-address"));
  };

  return (
    <Card
      title={t("adding-contract-card.title")}
      extra={<Button onClick={onCancel}>{t("common.cancel")}</Button>}
    >
      <Form
        name="adding-contract"
        onFinish={onFinish}
        onFinishFailed={onFinisFailed}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        layout="vertical"
      >
        <Form.Item
          label={t("adding-contract-card.contract-address")}
          name="address"
          rules={[
            {
              required: true,
              message: t("common-form.required-field"),
            },
            {
              validator: ethereumAddressValidator,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 16 }}>
          <Button type="primary" htmlType="submit">
            {t("adding-contract-card.add-button")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
