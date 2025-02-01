import { DownloadOutlined } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Select } from 'antd';
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from 'react';
import { getApi } from '../../redux/api';
import { withdrawlMethods } from '../../utils/utils';
import { PermissionContext } from '../AuthLayout/AuthLayout';

const { RangePicker } = DatePicker;

const PayDesign = ({ handleFinish, setIncludeSubMerchantFlag, title, loading, statusOptions }) => {
  const userData = useContext(PermissionContext);
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);
  const [merchantOptions, setMerchantOptions] = useState([]);
  // const [methodOptions, setMethodOptions] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  useEffect(() => {
    const fetchMerchantCodes = async () => {
      let merchantCodes = [];
      try {
        if (title !== "Vendor Report" && title !== "Vendor Payouts") {
          const groupingRoles = ["TRANSACTIONS", "OPERATIONS", "ADMIN"];
          const merchantRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN"];

          let endpoint = "";

          const merchantCodeParam = userData.code?.[0] ? `?merchantCode=${userData.code[0]}` : "";

          if (!includeSubMerchant) {
            endpoint = groupingRoles.includes(userData.role)
              ? "/getall-merchant-grouping"
              : `/getall-merchant${userData.role === "MERCHANT_ADMIN" ? `-grouping${merchantCodeParam}` : merchantCodeParam}`;
          } else {
            endpoint = merchantRoles.includes(userData.role)
              ? `/getall-merchant${merchantCodeParam}`
              : "/getall-merchant";
          }

          merchantCodes = await getApi(endpoint);

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
        }
        else {
          console.log(title,"title")
          const vendorCodes = await getApi("/getall-vendor");
        const formattedVendorCodes = Array.isArray(vendorCodes?.data?.data)
          ? vendorCodes?.data?.data?.map((vendor) => ({
              label: vendor.vendor_code,
              value: vendor.vendor_code,
            }))
          : [];

        setVendorOptions([...formattedVendorCodes].sort((a, b) =>
          a.label.localeCompare(b.label)
        ));
        }
      } catch (error) {
        if (title !== "Vendor Report") {
          console.error('Error fetching merchant codes:', error);
        } else {
          console.error('Error fetching vendor codes:', error);
        }
      }
    };

    fetchMerchantCodes();
  }, [includeSubMerchant, userData,title]);

  const onCalendarChange = (dates) => {
    setSelectedDates(dates);
  };

  const disabledDate = (current) => {
    const today = dayjs();

    // Disable dates in the future
    if (current && current.isAfter(today, "day")) {
      return true;
    }

    // If no start date is selected, allow dates up to today
    if (!selectedDates || selectedDates.length === 0) {
      return false;
    }

    // Restrict range to 15 days from the start date
    const [startDate] = selectedDates;
    if (startDate) {
      const maxDate = startDate.add(15, "day");
      const minDate = startDate.subtract(15, "day");
      return (
        current &&
        (current.isAfter(maxDate, "day") || current.isBefore(minDate, "day"))
      );
    }

    return false;
  };

  return (
    <div className="bg-white p-4">
      <p className="font-bold text-lg">{title}</p>
      <Form className="mt-6 w-[270px]" layout="vertical" onFinish={handleFinish}>
        {(title !== "Vendor Report" && title !== "Vendor Payouts") && (<Form.Item
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

        </Form.Item>)}
        {(title === "Vendor Report" || title === "Vendor Payouts") && (<Form.Item
          name="vendorCode"
          label="Vendor Codes"
          rules={[{ required: true, message: 'Please select vendor code!' }]}
        >
          <Select
            placeholder="Please select"
            options={vendorOptions}
            mode="multiple"
            allowClear
          />

        </Form.Item>)}
        {((userData.role === 'ADMIN' || userData.role === 'TRANSACTIONS' || userData.role === 'OPERATIONS' || userData.role === 'MERCHANT_ADMIN') && (title !== "Vendor Report" && title !== "Vendor Payouts")) && (
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

        {((title === "Payouts") && (userData.role === 'ADMIN' || userData.role === 'TRANSACTIONS' || userData.role === 'OPERATIONS')) && (<Form.Item
          name="method"
          label="Methods"
        >
          <Select
  placeholder="Please select"
  options={withdrawlMethods}
  mode="single"
  allowClear
/>
        </Form.Item>)}
        <div className="my-2 px-3 py-2 rounded shadow-md">
          <Form.Item
            name="range"
            rules={[{ required: true, message: 'Please select duration!' }]}
            label="Select Duration"
          >
            {statusOptions && (
              <RangePicker
                onCalendarChange={onCalendarChange}
                disabledDate={disabledDate}
              />
            )}
            {!statusOptions && (
              <RangePicker
                disabledDate={disabledDate}
              />
            )}
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
