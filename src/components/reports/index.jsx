import { DownloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { statusOptions } from '../../utils/utils';

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
      <Form className='mt-6' onFinish={handleFinish}>
        <div className='lg:w-1/3'>
          <Form.Item
            name="merchantCode"
            label="Merchant Codes"
            rules={[{ required: true, message: "Please select merchant code!" }]}
          >
            <Select placeholder="Please select" options={merchantOptions} />
          </Form.Item>
          <div className='lg:ml-[72px]'>
            <Form.Item
              name="status"
              label="Status"
            >
              <Select placeholder="Please select" options={statusOptions} />
            </Form.Item>
          </div>
        </div>
        <div className='p-4 rounded shadow-md lg:w-[50%]'>
          <Form.Item
            name="range"
            rules={[{ required: true, message: 'Please select duration!' }]}
            label="Select Duration"
          >
            <RangePicker />
          </Form.Item>
          <Button
            icon={<DownloadOutlined />}
            type='primary'
            htmlType='submit'
            loading={loading}
          >
            Download
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default PayDesign;
