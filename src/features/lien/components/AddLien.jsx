import { Button, Form, Input, InputNumber, notification, Select, DatePicker } from "antd";
import React, { useEffect, useState, useContext } from "react";
import { getApi, postApi } from "../../../redux/api";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const AddLien = ({ handleTableChange }) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userData = useContext(PermissionContext);
  const [isLoading, setIsLoading] = useState(false)
  const [merchants, setMerchants] = useState([]);

  const onFinish = async (values) => {
    setIsLoading(true)
    const lien = {
      amount: values.amount,
      code: values.code,
      merchant_order_id: values.merchant_order_id,
      user_id: values.user_id,
      when: values.when.toISOString(),
    }

    const lienData = await postApi("/create-lien", lien);
    setIsLoading(false)
    form.resetFields();
    if (lienData.error) {
      NotificationManager.error(lienData.error.message);
      return;
    }
    else {
      NotificationManager.success("Lien created successfully");
      handleTableChange({ current: 1, pageSize: 20 });
    }
  }

  const resetForm = () => {
    form.resetFields();
  };

  const handleGetMerchants = async () => {
    const res = await getApi("/getall-merchant");
    if (res.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }

    setMerchants(res.data?.data?.merchants || []);
  };

  useEffect(() => {
    handleGetMerchants();
  }, []);

  const merchantOptions = merchants
    ?.filter(
      (merchant) =>
        !merchant.is_deleted &&
        (!userData?.code?.length || userData?.code?.includes(merchant?.code))
    )
    .map((merchant) => ({
      label: merchant.code,
      value: merchant.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label


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
      >

        <Form.Item
          label="Merchant"
          name="code"

          rules={[
            {
              required: true,
              message: "Please select the Merchant!",
            },
          ]}
        >
          <Select placeholder="Please select"
            showSearch={true}
            options={merchantOptions}
          />
        </Form.Item>

        <Form.Item
          label="Merchant Order ID"
          name="merchant_order_id"
          rules={[
            {
              required: true,
              message: "Please input your Merchant Order ID!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="User ID"
          name="user_id"
          rules={[
            {
              required: true,
              message: "Please input your User ID!",
            },
          ]}
        >
          <Input />
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
          <InputNumber className="w-full" />
        </Form.Item>

        <Form.Item
          label="When"
          name="when"
          rules={[
            {
              required: true,
              message: "Please select date!",
            },
          ]}
        >
          <DatePicker className="h-8" />
        </Form.Item>

        <div className="flex flex-row items-end gap-1">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add ChargeBack
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

export default AddLien;
