import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { postApi } from "../../../redux/api";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

const ResetEntry = ({ handleTableChange }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = async (values) => {
    setIsLoading(true)
    const formData = {
      amount_code: `${values.amount_code}`,
    };

    await postApi("/reset-payment", formData).then((res) => {
      if (res?.error) {
        NotificationManager.error(res?.error?.message);
      }
      else{
        NotificationManager.success("Transaction Reset Successfully");
        handleTableChange({ current: 1, pageSize: 20 });
      }
      setIsLoading(false)
      form.resetFields(["amount_code"]);
    })
  };

  const resetForm = () => {
    form.resetFields();
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="add_data"
        className="grid grid-rows-1 md:grid-cols-6 gap-2"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Amount Code"
          name="amount_code"
          rules={[
            {
              required: true,
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

        <div className="flex flex-row justify-end items-end gap-1">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Reset Diposit
            </Button>
          </Form.Item>
          <Form.Item>
            <Button key="back" onClick={resetForm}>
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default ResetEntry;
