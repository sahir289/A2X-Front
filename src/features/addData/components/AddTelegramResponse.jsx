import { Button, Form, Input, InputNumber, notification, Select } from "antd";
import React, { useState } from "react";
import { postApi } from "../../../redux/api";

const AddTelegramResponse = ({ handleTableChange }) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    const formData = {
      message: {
        text: `${values.status} ${values.amount} ${
          values.amount_code ?? "nill"
        } ${values.utr}`,
      },
    };

    const AddData = await postApi("/create-message", formData)
      .then((res) => {
        if (res?.error) {
          api.error({
            description: `Error: ${
              res?.error?.error?.response?.data?.error?.code == "P2002"
                ? "Duplicate amount code"
                : res?.error?.message
            }`,
          });
        }
      })
      .catch((err) => {})
      .finally(() => {
        setIsLoading(false);

        handleTableChange({ current: 1, pageSize: 20 });
        form.resetFields();
      });
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="add_data"
        className="grid grid-rows-1 md:grid-cols-5 gap-2"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          status: "/success",
        }}
      >
        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please input your status!",
            },
          ]}
        >
          <Select>
            <Select.Option value="/success">Success</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please input your amount!",
            },
          ]}
        >
          <InputNumber min={1} className="w-full" />
        </Form.Item>

        <Form.Item
          label="Amount Code"
          name="amount_code"
          rules={[
            {
              // required: true,
              message: "Please input your amount code!",
            },
            {
              min: 5,
              message: "Minimum 5 characters required",
            },
            {
              max: 5,
              message: "Maximum 5 characters required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="UTR"
          name="utr"
          rules={[
            {
              required: true,
              message: "Please input your UTR!",
            },
            {
              pattern: /^\d{12}$/,
              message: "Please input 12 digit UTR!",
            },
            {
              pattern: /^(?:\d*)$/,
              message: "Please input only numbers!",
            },
          ]}
        >
          <InputNumber min={1} maxLength={12} className="w-full" />
        </Form.Item>

        <div className="flex flex-row justify-end items-end gap-1">
          <Form.Item>
            <Button key="back" onClick={resetForm}>
              Reset
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Data
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default AddTelegramResponse;
