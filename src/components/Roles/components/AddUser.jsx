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
  const [merchantCodeOptions1, setMerchantCodeOptions1] = useState([]);
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
    const merchantRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN"];
    const merchantApiRes = await getApi(merchantRoles.includes(userData.role) ? `/getall-merchant?merchantCode=${userData.code[0]}` : "/getall-merchant");
    if (merchantApiRes.error?.error?.response?.status === 401) {
      NotificationManager.error(merchantApiRes?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    //Remove logged in in merchant from the user merchant selection

    const removedLoggedInMerchant = merchantApiRes?.data?.data?.merchants
      ?.filter(merchant => merchant?.is_merchant_Admin === false)

    const getDropdownOptions = (merchants, addMerchant = null) => {
      // Map merchants to dropdown options
      const options = merchants?.map((merchant) => ({
        label: merchant.code,
        value: merchant.code,
      })) || [];

      // Optionally add a merchant
      if (addMerchant) {
        options.push({ label: addMerchant.code, value: addMerchant.code });
      }

      // Sort alphabetically by label
      return options.sort((a, b) => a.label.localeCompare(b.label));
    };

    const isMerchantAdmin = userData.role === "MERCHANT_ADMIN";
    const merchants = isMerchantAdmin
      ? merchantApiRes?.data?.data?.merchants[0]?.subMerchants
      : removedLoggedInMerchant;

    // If role is MERCHANT_ADMIN, add the parent merchant code to the dropdown
    const addMerchant = isMerchantAdmin
      ? merchantApiRes?.data?.data?.merchants[0]
      : null;

    const dropdownOptions = getDropdownOptions(merchants);
    const dropdownOptions1 = getDropdownOptions(merchants, addMerchant);

    // Set the dropdown options
    setMerchantCodeOptions(dropdownOptions);
    setMerchantCodeOptions1(dropdownOptions1);
  };

  const fetchVendorData = async () => {
    let vendorApiRes = "";

    if (userData.role === "VENDOR" || userData.role === "VENDOR_OPERATION") {
      vendorApiRes = await getApi(`/getall-vendor?vendor_code=${userData.vendorCode}`)
    }
    else {
      vendorApiRes = await getApi("/getall-vendor")
    }
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
    const allowedRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRoles.includes(userData.role)) {
      fetchMerchantData();
    }
    const allowedRoles1 = ["VENDOR", "VENDOR_OPERATIONS", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRoles1.includes(userData.role)) {
      fetchVendorData();
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
                options={merchantCodeOptions1}
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
