import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
} from "antd";
import React, { useContext } from "react";
import { postApi } from "../../../redux/api";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const AddVendor = ({
  isAddModelOpen,
  setIsAddModelOpen,
  handleTableChange,
}) => {
  const context = useContext(PermissionContext);
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const handleModalOk = () => {
    setIsAddModelOpen(false);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsAddModelOpen(false);
    form.resetFields();
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);
    const formData = {
      vendor_code: values.vendor_code,
      vendor_commission: `${values.vendor_commission}`,
      createdBy: `${context?.userId}`,
    };

    const AddVendor = await postApi("/create-vendor", formData);
    if (AddVendor.error) {
      api.error({
        description: `Error: ${AddVendor.error.message}`,
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
        title="New Vendor"
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
        >
          <Form.Item
            label="Vendor Code"
            name="vendor_code"
            rules={[
              {
                required: true,
                message: "Please input your vendor code",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vendor Commission"
            name="vendor_commission"
            rules={[
              {
                required: true,
                message: "Please input your vendor commission!",
              },
              {
                type: "number",
                message: "Please input a valid number!",
              },
            ]}
          >
            <InputNumber className="w-full" />
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

export default AddVendor;
