import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Switch
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { postApi, putApi } from "../../../redux/api";
// import {  Table, Select } from "antd";
const UpdateMerchant = ({
  record,
  isAddMerchantModalOpen,
  setIsAddMerchantModalOpen,
  handleTableChange,
}) => {
  const userData = useContext(PermissionContext);
  const [verification, setVerification] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [minPayin, setMinPayin] = useState(0);
  const [minPayout, setMinPayout] = useState(0);
  const [fields, setFields] = useState([]);
  const [Data,setdata]=useState();
  // const [actionValue, setActionValue] = useState();
  const labelCol = { span: 10 };
  const [addLoading, setAddLoading] = useState(false);
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]

  useEffect(() => {
    setFields([
      {
        name: ['code'],
        value: record?.code,
      },
      {
        name: ['site_url'],
        value: record?.site_url,
      },
      {
        name: ['return_url'],
        value: record?.return_url,
      },
      {
        name: ['notify_url'],
        value: record?.notify_url,
      },
      {
        name: ['payout_notify_url'],
        value: record?.payout_notify_url,
      },
      {
        name: ['min_payin'],
        value: Number(record?.min_payin),
      },
      {
        name: ['max_payin'],
        value: Number(record?.max_payin),
      },
      {
        name: ['payin_commission'],
        value: Number(record?.payin_commission),
      },
      {
        name: ['min_payout'],
        value: Number(record?.min_payout),
      },
      {
        name: ['max_payout'],
        value: Number(record?.max_payout),
      },
      {
        name: ['payout_commission'],
        value: Number(record?.payout_commission),
      },
      {
        name: ['is_test_mode'],
        value: record?.is_test_mode,
      },
      {
        name: ['allow_intent'],
        value: record?.allow_intent,
      },
    ])
    setMinPayin(record?.min_payin);
    setMinPayout(record?.min_payout);
  }, [record]);

  const handleModalCancel = () => {
    handleTableChange({ current: 1, pageSize: 100 });
    setIsAddMerchantModalOpen(false);

  };

  const handleToggleModal = () => {
    setVerification(!verification);
  };
  // const onFinish = async (values) => {
  //   setLoading(true);
  //   const formData = {
  //     id: record?.id,
  //     site_url: `${values.site_url}`,
  //     notify_url: `${values.notify_url}`,
  //     return_url: `${values.return_url}`,
  //     payout_notify_url: `${values.payout_notify_url}`,
  //     payin_commission: values.payin_commission,
  //     payout_commission: values.payout_commission,
  //     min_payin: `${values.min_payin}`,
  //     max_payin: `${values.max_payin}`,
  //     min_payout: `${values.min_payout}`,
  //     max_payout: `${values.max_payout}`,
  //     is_test_mode: !!values.is_test_mode,
  //     allow_intent: !!values.allow_intent,
  //     balance: Number(record?.balance),
  //   };

  //   // Call update API after password verification
  //   const res = await putApi("/update-merchant", formData);
  //   if (res.error) {
  //     api.error({
  //       description: `Error: ${res.error.message}`,
  //     });
  //     return;
  //   }

  //   notification.success({
  //     message: 'Merchant updated successfully!',
  //   });

  //   setLoading(false);
  //   setIsAddMerchantModalOpen(false);
  //   handleTableChange({ current: 1, pageSize: 100 });
  //   form.resetFields();
  // };

  // const verifyPassword = async (data) => {
  //   setAddLoading(true);
  //   const verifyPasswordData = {
  //     userName: userData.userName,
  //     password: data.password,
  //   };
  //   const res = await postApi("/verify-password", verifyPasswordData);
  //   setAddLoading(false);

  //   if (res?.data?.statusCode === 200) {
  //     // Password verified, now proceed with updating the merchant
  //     handleToggleModal(); // Close the password modal
  //     onFinish(form.getFieldsValue()); // Proceed to update the merchant
  //   } else {
  //     NotificationManager.error(res?.error?.message);
  //   }
  // };

  const onFinish = async (values) => {
    setVerification(true);
    const formData = {
      id: record?.id,
      site_url: `${values.site_url}`,
      notify_url: `${values.notify_url}`,
      return_url: `${values.return_url}`,
      payout_notify_url: `${values.payout_notify_url}`,
      payin_commission: values.payin_commission,
      payout_commission: values.payout_commission,
      min_payin: `${values.min_payin}`,
      max_payin: `${values.max_payin}`,
      min_payout: `${values.min_payout}`,
      max_payout: `${values.max_payout}`,
      is_test_mode: !!values.is_test_mode,
      allow_intent: !!values.allow_intent,
      balance: Number(record?.balance),
    };
    setdata(formData);
  };

  const verifyPassword = async (data) => {
    setAddLoading(true);
    const verifyPasswordData = {
      userName: userData.userName,
      password: data.password,
    };
    const res = await postApi("/verify-password", verifyPasswordData);

    setAddLoading(false);
    if (res?.data?.statusCode === 200) {
      setVerification(false);
      setIsAddMerchantModalOpen(false);
      const resp = await putApi("/update-merchant", Data);
      console.log(resp,"data")
      if (resp.error) {
        api.error({
          description: `Error: ${resp.error.message}`,
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      handleTableChange({ current: 1, pageSize: 100 })
      handleToggleModal();
      form.resetFields();
    } else {
      NotificationManager.error(res?.error?.message);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Update Merchant"
        open={isAddMerchantModalOpen}
        onCancel={handleModalCancel}
        footer={false}
      >
        <Form
          form={form}
          name="update_merchant"
          fields={fields}
          className="py-5"
          labelAlign="left"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Code"
            name="code"
            rules={[
              {
                required: true,
                message: "Please input your code",
              },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="Site"
            name="site_url"
            rules={[
              {
                required: true,
                message: "Please input your site url",
              },
            ]}
          >
            <Input
              placeholder="example.com"
            />
          </Form.Item>

          <Form.Item
            label="Return"
            name="return_url"
            rules={[
              {
                required: true,
                message: "Please input your return url",
              },
            ]}
          >
            <Input
              placeholder="example.com"
            />
          </Form.Item>

          <Form.Item
            label="Callback"
            name="notify_url"
            rules={[
              {
                required: true,
                message: "Please input your callback url",
              },
            ]}
          >
            <Input
              placeholder="example.com"
            />
          </Form.Item>

          {/* Added payout callback input field for payout feature */}
          <Form.Item
            label="PayOut Callback"
            name="payout_notify_url"
            rules={[
              {
                required: true,
                message: "Please input your callback url",
              },
            ]}
          >
            <Input
              placeholder="example.com"
            />
          </Form.Item>

          <Form.Item
            label="Min Payin"
            name="min_payin"
            rules={[
              {
                required: true,
                message: "Please input your min payin!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={1} onChange={setMinPayin} />
          </Form.Item>

          <Form.Item
            label="Max Payin"
            name="max_payin"
            rules={[
              {
                required: true,
                message: "Please input your max payin!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={minPayin} />
          </Form.Item>

          <Form.Item
            label="Commission"
            name="payin_commission"
            rules={[
              {
                required: true,
                message: "Please input your commission!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item
            label="Min Payout"
            name="min_payout"
            rules={[
              {
                required: true,
                message: "Please input your min payin!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={1} onChange={setMinPayout} />
          </Form.Item>

          <Form.Item
            label="Max Payout"
            name="max_payout"
            rules={[
              {
                required: true,
                message: "Please input your max payin!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={minPayout} />
          </Form.Item>

          <Form.Item
            label="Payout Commission"
            name="payout_commission"
            rules={[
              {
                required: true,
                message: "Please input your payout commission!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item
            label="Test Mode"
            name="is_test_mode"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label="Allow Intent"
            name="allow_intent"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <div className="flex flex-row gap-2 float-right">
            <Form.Item>
              <Button key="back" onClick={handleModalCancel}>
                Cancel
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit"  >
                Update
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Password Verification"
        onCancel={handleToggleModal}
        open={verification}
        footer={false}>
        <Form
          form={form}
          className='pt-[10px]'
          labelAlign='left'
          labelCol={labelCol}
          onFinish={verifyPassword}
        >
          <Form.Item
            name="password"
            label="Enter your password"
            rules={RequiredRule}
          >
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className='flex justify-end'>
            <Button type='primary'
              loading={addLoading}
              htmlType='submit'
            >
              Verify
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateMerchant;
