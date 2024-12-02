import { Button, Form, Input, notification, Select } from "antd";
import Modal from "antd/es/modal/Modal";
import React, { useContext, useEffect, useState } from "react";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { useNavigate } from "react-router-dom";
import { getApi, postApi } from "../../../redux/api";
import { PermissionContext } from "../../AuthLayout/AuthLayout";
import { roleOptionsMap } from "../../../utils/utils";


const AddUser = ({ isAddModelOpen, setIsAddModelOpen, handleTableChange }) => {
  const [api, contextHolder] = notification.useNotification();
  const [merchantCodeOptions, setMerchantCodeOptions] = useState([]);
  const [loading, setLoading] = useState(false)
  const [vendorCodeOptions, setVendorCodeOptions] = useState([]);
  const [form] = Form.useForm();
  const selectedRole = Form.useWatch("role", form);
  const userData = useContext(PermissionContext)
  const navigate = useNavigate()

  const context = useContext(PermissionContext)

  // We are adding roles options acc to role.
  const roleOptions = roleOptionsMap[context?.role] || roleOptionsMap.DEFAULT;

  const fetchMerchantData = async () => {
    const merchantApiRes = await getApi("/getall-merchant");
    if (merchantApiRes.error?.error?.response?.status === 401) {
      NotificationManager.error(merchantApiRes?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    //Remove logged in in merchant from the user merchant selection

    const removedLoggedInMerchant = merchantApiRes?.data?.data?.merchants
    ?.filter(merchant => merchant?.is_merchant_Admin === false)

    const dropdownOptions = removedLoggedInMerchant
      ?.filter(
        (merchant) =>
          !userData?.code.length || userData?.code.includes(merchant.code)
      )
      .map((merchant) => ({
        label: merchant.code,
        value: merchant.code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label

    setMerchantCodeOptions(dropdownOptions);
  };

  const fetchVendorData = async () => {
    const vendorApiRes = await getApi("/getall-vendor");
    if (vendorApiRes.error?.error?.response?.status === 401) {
      NotificationManager.error(vendorApiRes?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }
    const dropdownOptions = vendorApiRes?.data?.data
      ?.filter((vendor) =>
        userData?.vendorCode ? userData.vendorCode === vendor.vendor_code : vendor.vendor_code
      )
      .map((vendor) => ({
        label: vendor.vendor_code,
        value: vendor.vendor_code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label

    setVendorCodeOptions(dropdownOptions);
  };

  useEffect(() => {
    fetchMerchantData();
    fetchVendorData();
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
    setLoading(true)
    const formData = {
      fullName: values.fullName?.trim(),
      userName: values.userName?.trim(),
      password: values.password,
      role: values.role,
      code: typeof values.code === "string" ? [values.code] : values.code,
      createdBy: context?.userId,
      vendor_code: values?.vendor_code
    };

    const addUser = await postApi("/create-user", formData).then((res) => {
      if (res.error) {
        api.error({
          description: `Error: ${addUser.error.message}`,
        });
        return;
      }
    }).catch((err) => {
    }).finally(() => {
      setLoading(false)
      setIsAddModelOpen(false);
      handleTableChange({ current: 1, pageSize: 20 });
      form.resetFields();
    });


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
        {/* {JSON.stringify(merchantCodeOptions)} */}
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

          {(selectedRole === "MERCHANT" || selectedRole === "MERCHANT_ADMIN") && (
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
              {/* {JSON.stringify(selectedRole)} */}
              <Select
                placeholder="Please select"
                options={merchantCodeOptions}
                showSearch={true}
              />
            </Form.Item>
          )}
          {/* {(selectedRole === "OPERATIONS") && (
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
                mode="multiple"
                showSearch={true}
              />
            </Form.Item>
          )} */}
          {(selectedRole === "MERCHANT_OPERATIONS") && (
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
                showSearch={true}
              />
            </Form.Item>
          )}
          {(selectedRole === "VENDOR" || selectedRole === "VENDOR_OPERATIONS") && (
            <Form.Item
              label="Vendor Code"
              name="vendor_code"
              rules={[
                {
                  required: true,
                  message: "Please select your code!",
                },
              ]}
            >
              <Select
                placeholder="Please select"
                options={vendorCodeOptions}
                showSearch={true}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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
