import { Button, Form, Input, InputNumber, notification, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getApi, postApi } from "../../../redux/api";

const AddTelegramResponse = ({ handleTableChange }) => {
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false)
  const [bankOptions, setBankOptions] = useState([])
  const fetchAllPayInBank = async () => {
    const data = await getApi("/getAll-Payin-bank").then((res) => {
      setBankOptions(res?.data?.data)
    }).catch((err) => {
    })

  }

  useEffect(() => {
    fetchAllPayInBank()
  }, [])

  const onFinish = async (values) => {
    setIsLoading(true)
    const formData = {
      message: {
        text: `${values.status} ${values.amount} ${values.amount_code ?? "nil"
          } ${values.utr} ${values.bank}`,
      },
    };

    const AddData = await postApi("/create-message", formData).then((res) => {
      if (res?.error) {
        api.error({
          description: `Error: ${res?.error?.error?.response?.data?.error?.code == "P2002" ? "Duplicate amount code" : res?.error?.message}`,
        });
      }
    }).catch((err) => {
    }).finally(() => {
      setIsLoading(false)

      handleTableChange({ current: 1, pageSize: 20 });
      form.resetFields(["amount", "amount_code", "utr"]);
    })
  };

  const resetForm = () => {
    form.resetFields();
  };

  const bankOptionsData = bankOptions.map(bank => ({
    label: bank?.ac_name,
    value: bank?.ac_name,
  }))


  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        name="add_data"
        className="grid grid-rows-1 md:grid-cols-6 gap-2"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          status: "/success",
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
          <Select>
            <Select.Option value="/success">Success</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Bank"
          name="bank"

          rules={[
            {
              required: true,
              message: "Please select the bank!",
            },
          ]}
        >
          <Select placeholder="Please select"
            showSearch={true}
            options={bankOptionsData}
          />
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
              pattern: /^\d{12}$/,
              message: "Please input 12 digit UTR!",
            },
            {
              pattern: /^(?:\d*)$/,
              message: "Please input only numbers!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <div className="flex flex-row justify-end items-end gap-1">
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Add Data
            </Button>
          </Form.Item>
          <Form.Item>
            <Button key="back" onClick={resetForm}>
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
};

export default AddTelegramResponse;
