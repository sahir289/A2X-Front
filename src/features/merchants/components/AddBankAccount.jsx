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
import React from "react";
import { postApi } from "../../../redux/api";

const AddBankAccount = ({
  isAddModelOpen,
  setIsAddModelOpen,
  handleTableChange,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const handleModalOk = () => {
    setIsAddModelOpen(false);
  };

  const handleModalCancel = () => {
    setIsAddModelOpen(false);
  };

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log(values, "values");
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

    console.log(formData, "formData");

    const AddMerchant = await postApi("/create-merchant", formData);
    if (AddMerchant.error) {
      api.error({
        description: `Error: ${AddMerchant.error.message}`,
      });
      return;
    }

    console.log(AddMerchant, "post");
    setIsAddModelOpen(false);
    handleTableChange({ current: 1, pageSize: 10 });
    form.resetFields();

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
          layout="vertical"
          className="py-5"
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

          <div className="flex gap-2">
            <Form.Item
              label="Url"
              name="site_url_protocol"
              rules={[
                {
                  required: true,
                  message: "Please input your return url",
                },
              ]}
            >
              <Select>
                <Select.Option value="http://">http://</Select.Option>
                <Select.Option value="https://">https://</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="site_url"
              className="flex-1 place-content-end"
              rules={[
                {
                  required: true,
                  message: "Please input your site url",
                },
              ]}
            >
              <Input placeholder="example.com" />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Form.Item
              label="Return"
              name="return_url_protocol"
              rules={[
                {
                  required: true,
                  message: "Please input your return url",
                },
              ]}
            >
              <Select>
                <Select.Option value="http://">http://</Select.Option>
                <Select.Option value="https://">https://</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="return_url"
              className="flex-1 place-content-end"
              rules={[
                {
                  required: true,
                  message: "Please input your return url",
                },
              ]}
            >
              <Input placeholder="example.com" />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Form.Item
              label="Callback"
              name="notify_url_protocol"
              rules={[
                {
                  required: true,
                  message: "Please input your return url",
                },
              ]}
            >
              <Select>
                <Select.Option value="http://">http://</Select.Option>
                <Select.Option value="https://">https://</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="notify_url"
              className="flex-1 place-content-end"
              rules={[
                {
                  required: true,
                  message: "Please input your callback url",
                },
              ]}
            >
              <Input placeholder="example.com" />
            </Form.Item>
          </div>

          <div className="grid grid-rows-1 grid-cols-2 gap-2">
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
              <InputNumber className="w-full" />
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
              <InputNumber className="w-full" />
            </Form.Item>
          </div>

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
            <InputNumber className="w-full" />
          </Form.Item>

          <div className="grid grid-rows-1 grid-cols-2 gap-2">
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
              <InputNumber className="w-full" />
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
              <InputNumber className="w-full" />
            </Form.Item>
          </div>

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
            <InputNumber className="w-full" />
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
              <Button type="primary" htmlType="submit">
                Ok
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default AddBankAccount;
