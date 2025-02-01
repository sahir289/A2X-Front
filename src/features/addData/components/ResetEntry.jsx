import { Button, Form, Input, Select } from "antd";
import React, { useState } from "react";
import { postApi } from "../../../redux/api";
import {
  NotificationManager,
} from "react-notifications";

const ResetEntry = ({ handleTableChange }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false)

  const onFinish = async (values) => {
    setIsLoading(true)
    const formData = {
      merchant_order_id: `${values.merchant_order_id}`,
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
      form.resetFields(["merchant_order_id"]);
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
        className="grid grid-rows-1 md:grid-cols-3 gap-2"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Merchant Order ID"
          name="merchant_order_id"
          rules={[
            {
              required: true,
              message: "Please input your Mercahant Order ID!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="flex flex-row justify-start items-end gap-1">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Reset Deposit
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
