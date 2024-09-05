import { Button, Form, Input, notification, Select } from "antd";
import Modal from "antd/es/modal/Modal";
import React, { useContext, useEffect, useState } from "react";
import { getApi, postApi } from "../../../redux/api";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../AuthLayout/AuthLayout";


const AddUser = ({ isAddModelOpen, setIsAddModelOpen, handleTableChange }) => {
  const [api, contextHolder] = notification.useNotification();
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);
  const [form] = Form.useForm();
  const selectedRole = Form.useWatch("role", form);

  const navigate = useNavigate()

  const context = useContext(PermissionContext)

  const commonOptions = [
    { label: "Merchant", value: "MERCHANT" },
    { label: "Customer Service", value: "CUSTOMER_SERVICE" },
    { label: "Transactions", value: "TRANSACTIONS" },
    { label: "Operations", value: "OPERATIONS" },
    { label: 'Vendor', value: 'VENDOR' }
  ];
  const merchantOptions = [
    { label: "Customer Service", value: "CUSTOMER_SERVICE" },
    { label: "Transactions", value: "TRANSACTIONS" },
    { label: "Operations", value: "OPERATIONS" },
  ];

  const roleOptions = context?.role === "ADMIN"
    ? commonOptions
    : merchantOptions

  const fetchMerchantData = async () => {
    const merchantApiRes = await getApi("/getall-merchant");
    if (merchantApiRes.error?.error?.response?.status === 401) {
      NotificationManager.error(merchantApiRes?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    const dropdownOptions = merchantApiRes?.data?.data?.merchants?.map(
      (merchant) => ({
        label: merchant.code,
        value: merchant.code,
      })
    );
    setMerchantCodeOptions(dropdownOptions);
  };

  useEffect(() => {
    if (context?.role === "ADMIN") {
      fetchMerchantData();
    }
  }, []);

  const handleModalOk = () => {
    setIsAddModelOpen(false);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsAddModelOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    const formData = {
      fullName: values.fullName?.trim(),
      userName: values.userName?.trim(),
      password: values.password,
      role: values.role,
      code: values.code,
      createdBy: context?.userId
    };

    const addUser = await postApi("/create-user", formData);
    if (addUser.error) {
      api.error({
        description: `Error: ${addUser.error.message}`,
      });
      return;
    }
    setIsAddModelOpen(false);
    handleTableChange({ current: 1, pageSize: 20 });
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add User"
        open={isAddModelOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={false}
      >
        <Form
          form={form}
          name="add_data"
          layout="vertical"
          className="my-6"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="User Name"
            name="userName"
            rules={[
              {
                required: true,
                message: "Please input your full name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password type="password" placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message: "Please select your role!",
              },
            ]}
          >
            <Select placeholder="Please select" options={roleOptions} />
          </Form.Item>

          {(selectedRole === "MERCHANT" || selectedRole === "OPERATIONS") && (
            <Form.Item
              label="Merchant Code"
              name="code"
              rules={[
                {
                  required: true,
                  message: "Please select your code!",
                },
              ]}
            >
              <Select
                placeholder="Please select"
                options={merchantCodeOptions}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <NotificationContainer />
    </>
  );
};

export default AddUser;
