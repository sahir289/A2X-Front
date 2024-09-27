import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
} from "antd";
import React, { useState, useEffect } from "react";
import { putApi } from "../../../redux/api";


const UpdateMerchant = ({
  record,
  isAddMerchantModalOpen,
  setIsAddMerchantModalOpen,
  handleTableChange,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [minPayin, setMinPayin] = useState(0);
  const [minPayout, setMinPayout] = useState(0);
  const [fields, setFields] = useState([]);

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
    ])
  }, [record]);

  const handleModalCancel = () => {
    setIsAddMerchantModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    setLoading(true)
    const formData = {
      id: record?.id,
      // code: values.code,
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
      balance: Number(record?.balance),
    };

    const UpdateMerchant = await putApi("/update-merchant", formData).then((res) => {
      if (res.error) {
        api.error({
          description: `Error: ${res.error.message}`,
        });
        return;
      }
    }).catch((err) => {
      console.log("🚀 ~ UpdateMerchant ~ err:", err)
    }).finally(() => {
      setLoading(false)
      setIsAddMerchantModalOpen(false);
      handleTableChange({ current: 1, pageSize: 20 });
      form.resetFields();
    });
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
            <InputNumber className="w-full" min={1} onChange={setMinPayin} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
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
            <InputNumber className="w-full" min={minPayin} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
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
            <InputNumber className="w-full" min={1} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
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
            <InputNumber className="w-full" min={1} onChange={setMinPayout} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
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
            <InputNumber className="w-full" min={minPayout} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
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
            <InputNumber className="w-full" min={1} onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key)) {
                const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key);
                if (!isControlKey) {
                  e.preventDefault();
                }
              }
            }} />
          </Form.Item>

          <Form.Item
            label="Test Mode"
            name="is_test_mode"
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Update
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateMerchant;
