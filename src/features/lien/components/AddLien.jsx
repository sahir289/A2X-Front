import { Button, Form, Input, InputNumber, notification, Select, DatePicker, Checkbox } from "antd";
import React, { useEffect, useState, useContext } from "react";
import { getApi, postApi } from "../../../redux/api";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const AddLien = ({ handleTableChange, includeSubMerchant }) => {
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
      NotificationManager.success("ChargeBack added successfully");
      handleTableChange({ current: 1, pageSize: 20 });
    }
  }

  const resetForm = () => {
    form.resetFields();
  };

  useEffect(() => {
    const handleGetMerchants = async () => {
      let merchant;
      const groupingRoles = ["TRANSACTIONS", "OPERATIONS", "ADMIN"];
      const merchantRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN"];
      const options = { page: 1, pageSize: 1000 };

      let endpoint = "";

      const merchantCodeParam = userData.code?.[0] ? `?merchantCode=${userData.code[0]}` : "";

      if (!includeSubMerchant) {
        endpoint = groupingRoles.includes(userData.role)
          ? "/getall-merchant-grouping"
          : `/getall-merchant${userData.role === "MERCHANT_ADMIN" ? `-grouping${merchantCodeParam}` : merchantCodeParam}`;
      } else {
        endpoint = merchantRoles.includes(userData.role)
          ? `/getall-merchant${merchantCodeParam}`
          : "/getall-merchant";
      }

      merchant = await getApi(endpoint, options);

      if (merchant.error?.error?.response?.status === 401) {
        NotificationManager.error(merchant?.error?.message, 401);
        localStorage.clear();
        navigate("/");
      }

      setMerchants(merchant.data?.data?.merchants || []);
    };

    handleGetMerchants();
  }, [includeSubMerchant]);

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
      <div>
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
            label="Reference Date"
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
      </div>
      {/* <div className="flex ml-5" style={{ alignItems: "center", justifySelf: "end" }}>
        {(userData.role === "ADMIN" || userData.role === "TRANSACTIONS" || userData.role === "OPERATIONS") && <Checkbox
          onClick={() => {
            setIncludeSubMerchant((prevState) => !prevState);
          }}
        >
          <span style={{ color: "cornflowerblue" }}>Include Sub Merchant</span>
        </Checkbox>}
      </div> */}
    </>
  );
};

export default AddLien;
