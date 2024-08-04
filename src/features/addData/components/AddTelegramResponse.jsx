import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import React from "react";
import { postApi } from "../../../redux/api";

const AddTelegramResponse = ({
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
    const formData = {
      message: {
        text: `${values.status} ${values.amount} ${values.amount_code ?? "nill"} ${values.utr} ${values.is_used}`,
      },
    };

    console.log(formData, "formData");
    const AddData = await postApi("/create-message", formData);
    if (AddData.error) {
      api.error({
        description: `Error: ${AddData.error.message}`,
      });
      return;
    }

    console.log(AddData, "post");
    setIsAddModelOpen(false);
    handleTableChange({ current: 1, pageSize: 10 });
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add New Data"
        open={isAddModelOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={false}
      >
        <Form
          form={form}
          name="add_data"
          className="py-5"
          onFinish={onFinish}
          autoComplete="off"
          initialValues={{
            is_used: true,
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
            <Select className="flex flex-1" >
              <Select.Option value="/success">Success</Select.Option>
            </Select>
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
            label="Amount Code"
            name="amount_code"
            rules={[
              {
                // required: true,
                message: "Please input your amount code!",
              },
              {
                min: 5,
                message: "Minimum 5 characters required",
              },
              {
                max: 5,
                message: "Maximum 5 characters required",
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
              {
                min: 12,
                message: "Minimum 12 characters required",
              },
              {
                max: 12,
                message: "Maximum 12 characters required",
              },
            ]}
          >
            <Input />
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

export default AddTelegramResponse;
