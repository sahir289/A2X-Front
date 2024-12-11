import { DownloadOutlined } from '@ant-design/icons';
import { Button, DatePicker, Form, Select, Spin, Checkbox } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { PermissionContext } from '../AuthLayout/AuthLayout';
import { getApi } from '../../redux/api';

const { RangePicker } = DatePicker;

const PayDesign = ({ handleFinish, setIncludeSubMerchantFlag, title, loading, statusOptions }) => {
  const userData = useContext(PermissionContext);
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);
  const [merchantOptions, setMerchantOptions] = useState([]);

  useEffect(() => {
    const fetchMerchantCodes = async () => {
      let merchantCodes = [];
      try {
        if (
          userData.role === 'ADMIN' ||
          userData.role === 'TRANSACTIONS' ||
          userData.role === 'OPERATIONS'
        ) {
          merchantCodes = await getApi(
            includeSubMerchant ? '/getall-merchant' : '/getall-merchant-grouping'
          );
        } else {
          merchantCodes = await getApi('/getall-merchant');
        }

        const formattedMerchantCodes = merchantCodes?.data?.data?.merchants
          ?.filter(
            (merchant) =>
              (!merchant.is_deleted && !userData?.code?.length) ||
              userData?.code.includes(merchant.code)
          )
          .map((merchant) => ({
            label: merchant.code,
            value: merchant.code,
          }));

        setMerchantOptions(
          [...formattedMerchantCodes].sort((a, b) =>
            a.label.localeCompare(b.label)
          )
        );
      } catch (error) {
        console.error('Error fetching merchant codes:', error);
      }
    };

    fetchMerchantCodes();
  }, [includeSubMerchant, userData]);

  return (
    <div className="bg-white p-4">
      <p className="font-bold text-lg">{title}</p>
        <Form className="mt-6 w-[270px]" layout="vertical" onFinish={handleFinish}>
          <Form.Item
            name="merchantCode"
            label="Merchant Codes"
            rules={[{ required: true, message: 'Please select merchant code!' }]}
          >
            <Select
              placeholder="Please select"
              options={merchantOptions}
              mode="multiple"
              allowClear
            />
          </Form.Item>
          {(userData.role === 'ADMIN' || userData.role === 'TRANSACTIONS' || userData.role === 'OPERATIONS') && (
            <Checkbox
              onClick={() => {
                setIncludeSubMerchant((prevState) => !prevState);
                setIncludeSubMerchantFlag((prevState) => !prevState);
              }}
            >
              <span style={{ color: 'cornflowerblue' }}>Include Sub Merchant</span>
            </Checkbox>
          )}
          {statusOptions && (
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: 'Please select status!' }]}
            >
              <Select placeholder="Please select" options={statusOptions} />
            </Form.Item>
          )}
          <div className="my-2 px-3 py-2 rounded shadow-md">
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
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Download
          </Button>
        </Form>
    </div>
  );
};

export default PayDesign;
