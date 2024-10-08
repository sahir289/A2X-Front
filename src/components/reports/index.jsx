import { DownloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select } from 'antd';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { PermissionContext } from '../AuthLayout/AuthLayout';

const { RangePicker } = DatePicker;

const PayDesign = ({ handleFinish, title, loading, statusOptions }) => {
  const merchantCodes = useSelector((state) => state.merchant.data)
  const userData = useContext(PermissionContext);
  const merchantOptions = merchantCodes
    ?.filter(merchant => !userData?.code?.length || userData?.code.includes(merchant.code))
    .map(merchant => ({
      label: merchant.code,
      value: merchant.code,
    }));

  return (
    <div className='bg-white p-4'>
      <p className='font-bold text-lg'>{title}</p>
      <Form className='mt-6 w-[270px]' layout='vertical' onFinish={handleFinish}>
        <Form.Item
          name="merchantCode"
          label="Merchant Codes"
          rules={[{ required: true, message: "Please select merchant code!" }]}
        >
          <Select placeholder="Please select" options={merchantOptions} mode='multiple' />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Please select" options={statusOptions} />
        </Form.Item>
        <div className='my-2 px-3 py-2 rounded shadow-md'>
          <Form.Item
            name="range"
            rules={[{ required: true, message: 'Please select duration!' }]}
            label="Select Duration"
          >
            <RangePicker  />
          </Form.Item>
        </div>
        <Button
          icon={<DownloadOutlined />}
          type='primary'
          htmlType='submit'
          loading={loading}
        >
          Download
        </Button>
      </Form>
    </div>
  );
}

export default PayDesign;
