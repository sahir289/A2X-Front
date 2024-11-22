import { Button, Form, Input, Select, notification } from "antd";
import React, { useState } from "react";
import { postApi } from "../../../redux/api";
import {
  NotificationManager,
} from "react-notifications";

const CheckUTR = ({ handleTableChange }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();

  const onFinish = async (values) => {
    setIsLoading(true)
    const formData = {
      message: {
        text: `${values.status} ${values.merchant_order_id} ${values.utr}`,
      },
      fromUI: true,
    };

    await postApi("/tele-check-utr", formData).then((res) => {
      setIsLoading(false)
      api.open({
        message: res?.data?.message,
      });
        // NotificationManager.success(res?.data?.message)
      form.resetFields(["merchant_order_id", "utr"]);
      handleTableChange({ current: 1, pageSize: 20 });
    })
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
        className="grid grid-rows-1 md:grid-cols-6 gap-2"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          status: "/checkutr",
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
            <Select.Option value="/checkutr">Check UTR</Select.Option>
          </Select>
        </Form.Item>

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

        <Form.Item
          label="UTR"
          name="utr"
          rules={[
            {
              required: true,
              message: "Please input your UTR!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="flex flex-row justify-end items-end gap-1">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Check UTR
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

export default CheckUTR;
