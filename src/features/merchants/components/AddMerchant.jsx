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
import React, { useState } from "react";
import { postApi } from "../../../redux/api";

const selectBefore = (name) => {
  return (
    <Form.Item
      name={name}
      noStyle
      rules={[
        {
          required: true,
          message: "Please select protocol",
        },
      ]}
      defaultValue="http://"
    >
      <Select>
        <Select.Option value="http://">http://</Select.Option>
        <Select.Option value="https://">https://</Select.Option>
      </Select>
    </Form.Item>
  );
};

const AddMerchant = ({
  isAddModelOpen,
  setIsAddModelOpen,
  handleTableChange,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [minPayin, setMinPayin] = useState(0);
  const [minPayout, setMinPayout] = useState(0);
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
      code: values.code,
      site_url: `${values.site_url_protocol}${values.site_url}`,
      return_url: `${values.return_url_protocol}${values.return_url}`,
      notify_url: `${values.notify_url_protocol}${values.notify_url}`,
      payin_commission: `${values.payin_commission}`,
      payout_commission: `${values.payout_commission}`,
      min_payin: `${values.min_payin}`,
      max_payin: `${values.max_payin}`,
      min_payout: `${values.min_payout}`,
      max_payout: `${values.max_payout}`,
      is_test_mode: !!values.is_test_mode,
      balance: Number(0).toPrecision(3),
    };

    const AddMerchant = await postApi("/create-merchant", formData).then((res) => {
      if (res.error) {
        api.error({
          description: `Error: ${res.error.message}`,
        });
        return;
      }
    }).catch((err) => {
      console.log("🚀 ~ AddMerchant ~ err:", err)
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
        title="New Merchant"
        open={isAddModelOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={false}
      >
        <Form
          form={form}
          name="add_merchant"
          className="py-5"
          labelAlign="left"
          labelCol={{ span: 8 }}
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            site_url_protocol: "http://",
            return_url_protocol: "http://",
            notify_url_protocol: "http://",
            is_test_mode: true,
          }}
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
            <Input />
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
              addonBefore={selectBefore("site_url_protocol")}
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
              addonBefore={selectBefore("return_url_protocol")}
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
              addonBefore={selectBefore("notify_url_protocol")}
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
              <Button type="primary" htmlType="submit" loading={loading}>
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddMerchant;
