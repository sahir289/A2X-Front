import { DownloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { payoutInOutStatusOptions } from '../../utils/utils';

const { RangePicker } = DatePicker;

const PayDesign = ({ handleFinish, title, loading }) => {
  const merchantCodes = useSelector((state) => state.merchant.data)
  //make options list
  const merchantOptions = merchantCodes.map((el) => ({
    key: el.code,
    value: el.code,
  }))
  return (
    <div className='bg-white p-4'>
      <p className='font-bold text-lg'>{title}</p>
      <Form className='mt-6 w-[270px]' layout='vertical' onFinish={handleFinish}>
        <Form.Item
          name="merchantCode"
          label="Merchant Codes"
          rules={[{ required: true, message: "Please select merchant code!" }]}
        >
          <Select placeholder="Please select" options={merchantOptions} />
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: "Please select status!" }]}
        >
          <Select placeholder="Please select" options={payoutInOutStatusOptions} />
        </Form.Item>
        <div className='my-2 px-3 py-2 rounded shadow-md'>
          <Form.Item
            name="range"
            rules={[{ required: true, message: 'Please select duration!' }]}
            label="Select Duration"
          >
            <RangePicker />
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
