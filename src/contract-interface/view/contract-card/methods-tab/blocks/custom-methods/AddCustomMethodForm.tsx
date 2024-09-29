import { CustomMethodData } from "@/contract-interface/model/ContractCard/ContractCustomMethodsModel";
import { Button, Card, Flex, Form, FormProps, Input, Select } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { MethodType } from "../../../types";
import { v4 as uuidv4 } from "uuid";

const METHOD_TYPES: MethodType[] = ["pure", "view", "transaction"];

type AddCustomMethodFormProps = {
  onCancel: () => void;
  onAddMethod: (methodData: CustomMethodData) => void;
};

export const AddCustomMethodForm: React.FC<AddCustomMethodFormProps> = ({
  onCancel,
  onAddMethod,
}) => {
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
      title="Добавление метода"
      extra={<Button onClick={onCancel}>Отмена</Button>}
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
          label="Тип метода"
          name="methodType"
          rules={[
            {
              required: true,
              message: "Поле обязательное",
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
          label="Название метода"
          name="name"
          rules={[
            {
              required: true,
              message: "Поле обязательное",
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
                  label={index === 0 ? "Входные значения" : ""}
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
                          message: "Пожалуйста введите значение",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Тип входного значения"
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
                  Добавить входное значение
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
                  label={index === 0 ? "Выходные значения" : ""}
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
                          message: "Пожалуйста введите значение",
                        },
                      ]}
                      noStyle
                    >
                      <Input
                        placeholder="Тип выходного значения"
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
                  Добавить выходное значение
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Flex gap={10}>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Добавить
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
