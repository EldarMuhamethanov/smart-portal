import { CustomMethodData } from "@/app/client/contract-interface/model/ContractCard/ContractCustomMethodsModel";
import { Button, Card, Flex, Form, FormProps, Input, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MethodType } from "../../../types";
import { v4 as uuidv4 } from "uuid";
import { useTranslationContext } from "../../../../TranslationContext";

const METHOD_TYPES: MethodType[] = ["pure", "view", "transaction"];

type AddCustomMethodFormProps = {
  onCancel: () => void;
  onAddMethod: (methodData: CustomMethodData) => void;
};

export const AddCustomMethodForm: React.FC<AddCustomMethodFormProps> = ({
  onCancel,
  onAddMethod,
}) => {
  const { t } = useTranslationContext();
  const onFinish: FormProps["onFinish"] = (values) => {
    const methodData: CustomMethodData = {
      id: uuidv4(),
      name: values.name,
      type: values.methodType,
      fields:
        values.inputs?.map((input: string) => ({
          name: "",
          type: input,
        })) || [],
      outputs:
        values.outputs?.map((input: string) => ({
          name: "",
          type: input,
        })) || [],
    };
    onAddMethod(methodData);
  };

  return (
    <Card
      type="inner"
      title={t("contract-card.methods.adding-custom-method")}
      extra={<Button onClick={onCancel}>{t("common.cancel")}</Button>}
    >
      <Form
        name="adding-custom-method"
        onFinish={onFinish}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        layout="vertical"
      >
        <Form.Item
          label={t("contract-card.methods.method-type")}
          name="methodType"
          rules={[
            {
              required: true,
              message: t("common-form.required-field"),
            },
          ]}
        >
          <Select>
            {METHOD_TYPES.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label={t("contract-card.methods.method-name")}
          name="name"
          rules={[
            {
              required: true,
              message: t("common-form.required-field"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.List name="inputs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, ...fieldProps }, index) => (
                <Form.Item
                  label={
                    index === 0 ? t("contract-card.methods.input-values") : ""
                  }
                  required={false}
                  key={key}
                  style={{ marginBottom: 12 }}
                >
                  <Flex gap={20}>
                    <Form.Item
                      {...fieldProps}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: t("common-form.please-input-value"),
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={t(
                          "contract-card.methods.input-value-type"
                        )}
                        style={{ width: "60%" }}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(fieldProps.name)}
                    />
                  </Flex>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  {t("contract-card.methods.add-input-value")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.List name="outputs">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, ...fieldProps }, index) => (
                <Form.Item
                  label={
                    index === 0 ? t("contract-card.methods.output-values") : ""
                  }
                  required={false}
                  key={key}
                  style={{ marginBottom: 12 }}
                >
                  <Flex gap={20}>
                    <Form.Item
                      {...fieldProps}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: t("common-form.please-input-value"),
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder={t(
                          "contract-card.methods.output-value-type"
                        )}
                        style={{ width: "60%" }}
                      />
                    </Form.Item>
                    <Button
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => remove(fieldProps.name)}
                    />
                  </Flex>
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  {t("contract-card.methods.add-output-value")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Flex gap={10}>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              {t("contract-card.methods.add-method-button")}
            </Button>
          </Form.Item>

          {/* <Button type="default" icon={<CopyOutlined />} onClick={() => {}}>
            Calldata
          </Button>
          <Button type="default" icon={<CopyOutlined />} onClick={() => {}}>
            Parameters
          </Button> */}
        </Flex>
      </Form>
    </Card>
  );
};
