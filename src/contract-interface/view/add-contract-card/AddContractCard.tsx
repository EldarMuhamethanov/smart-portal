import { Button, Card, Form, Input, FormProps } from "antd";

type AddContractCardProps = {
  onCancel: () => void;
  onSubmit: (address: string) => void;
};

export const AddContractCard: React.FC<AddContractCardProps> = ({
  onCancel,
  onSubmit,
}) => {
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
    return Promise.reject(
      "Пожалуйста, введите корректный адрес смарт-контракта"
    );
  };

  return (
    <Card
      title="Добавление контракта"
      extra={<Button onClick={onCancel}>Отмена</Button>}
    >
      <Form
        name="adding-contract"
        onFinish={onFinish}
        onFinishFailed={onFinisFailed}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="Адрес контракта"
          name="address"
          rules={[
            {
              required: true,
              message: "Поле обязательное",
            },
            {
              validator: ethereumAddressValidator,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Добавить
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
