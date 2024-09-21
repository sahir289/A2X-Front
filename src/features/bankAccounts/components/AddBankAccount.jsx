import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Switch,
} from "antd";
import axios from "axios";
import React, { useContext, useState } from "react";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { postApi } from "../../../redux/api";

const AddBankAccount = ({
  isAddBankAccountModelOpen,
  setIsAddBankAccountModelOpen,
  handleTableChange,
}) => {
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  const handleModalOk = () => {
    setIsAddBankAccountModelOpen(false);
    form.resetFields();
  };

  const handleModalCancel = () => {
    setIsAddBankAccountModelOpen(false);
    form.resetFields();
  };

  const userData = useContext(PermissionContext)

  // Function to validate IFSC code using an API
  const validateIfscCode = async (ifsc) => {
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      return response.data;
    } catch (error) {
      return null; // If invalid IFSC or error in API request
    }
  };

  const onFinish = async (values) => {
    setLoading(true)
    // Validate the IFSC code before proceeding
    const ifscValidation = await validateIfscCode(values?.ifsc);
    if (!ifscValidation) {
      setLoading(false)
      api.error({
        message: "Invalid IFSC Code",
        description: "Please enter a valid IFSC code.",
      });
      return;
    }

    // Proceed with form data submission after IFSC validation
    const formData = {
      upi_id: values.upi_id,
      upi_params: "",
      name: values.name,
      ac_no: values.ac_no,
      ac_name: values.ac_name,
      ifsc: values.ifsc,
      bank_name: values.bank_name,
      is_qr: !!values.is_qr,
      is_bank: !!values.is_bank,
      min_payin: values.min_payin,
      max_payin: values.max_payin,
      is_enabled: !!values.status,
      payin_count: 0,
      balance: 0,
      createdBy: `${userData?.userId}`,
      code: `${userData?.code}`,
      vendor_code: `${userData?.vendorCode}`,
    };

    const AddBankAcc = await postApi("/create-bank", formData).then((res) => {
      if (res?.error) {
        api.error({
          description: `Error: ${res?.error.message}`,
        });
        return;
      }
    }).catch((err) => {

    }).finally(() => {
      setLoading(false)
      setIsAddBankAccountModelOpen(false);
      handleTableChange({ current: 1, pageSize: 20 });
      form.resetFields();
    });
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Add Bank Account"
        open={isAddBankAccountModelOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        footer={false}
      >
        <Form
          form={form}
          name="add_bank_account"
          className="py-5"
          onFinish={onFinish}
          labelAlign="left"
          labelCol={{ span: 11 }}
          autoComplete="off"
          initialValues={{
            status: true,
            is_qr: true,
            is_bank: true,
          }}
        >
          <Form.Item
            label="Bank Account Nick Name"
            name="ac_name"
            rules={[
              {
                required: true,
                message: "Please input your bank account nick name!",
              },
            ]}
            
          >
            <Input
             onKeyDown={(e) => {
              if (!/[A-Za-z\s]/.test(e.key)) {
                e.preventDefault(); 
              }
            }}
            
            />
          </Form.Item>
          <Form.Item
            label="Bank Name"
            name="bank_name"
            rules={[
              {
                required: true,
                message: "Please input your bank name!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bank Account Holder Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your bank account holder name!",
              },
            ]}
          >
            <Input
             onKeyDown={(e) => {
              if (!/[A-Za-z\s]/.test(e.key)) {
                e.preventDefault(); 
              }
            }}
            
            />
          </Form.Item>

          <Form.Item
            label="Account Number"
            name="ac_no"
            rules={[
              {
                required: true,
                message: "Please input your account number!",
              },
            ]}
          >
            <Input
            type="number" onKeyUp={(e)=>{
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault(); 
              }
            }}/>
          </Form.Item>

          <Form.Item
            label="IFSC Code"
            name="ifsc"
            rules={[
              {
                required: true,
                message: "Please input your IFSC code!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="UPI ID"
            name="upi_id"
            rules={[
              {
                required: true,
                message: "Please input your UPI ID!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <div className="grid grid-rows-1 grid-cols-3 gap-2">
            <Form.Item
              label="Enabled"
              name="status"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Please input your status!",
                },
              ]}
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label="QR?"
              name="is_qr"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Please input your QR!",
                },
              ]}
            >
              <Switch />
            </Form.Item>

            <Form.Item
              label="Bank?"
              name="is_bank"
              valuePropName="checked"
              rules={[
                {
                  required: true,
                  message: "Please input your Bank!",
                },
              ]}
            >
              <Switch />
            </Form.Item>
          </div>
          <Form.Item
            label="Min Payin"
            name="min_payin"
            rules={[
              {
                required: true,
                message: "Please input your min payin!",
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
              <Button type="primary" htmlType="submit" loading={loading}>
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
