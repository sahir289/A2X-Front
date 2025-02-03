import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import { formatDate1, payinMethods, statusOptions } from '../../utils/utils';
import PayDesign from './index';

const VendorPayInReports = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();

  const handlePayIn = async (data) => {
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const formattedDates = data.range.map((date) => new Date(date));
    delete data.range;

    const startDate = formattedDates[0];
    const endDate = formattedDates[1];

    const adjustedStartDate = new Date(startDate.getTime() - istOffset);
    const adjustedEndDate = new Date(endDate.getTime() - istOffset);

    adjustedStartDate.setUTCDate(adjustedStartDate.getUTCDate());
    adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);

    adjustedStartDate.setUTCHours(18, 30, 0, 0);
    adjustedEndDate.setUTCHours(18, 29, 59, 999);

    const vendorCodes = Array.isArray(data.vendorCode) ? data.vendorCode.join(",") : data.vendorCode;
    let query = data.vendorCode
      .map((code) => "vendor_code=" + encodeURIComponent(code))
      .join("&");


    query += `&startDate=${encodeURIComponent(adjustedStartDate.toISOString())}&endDate=${encodeURIComponent(adjustedEndDate.toISOString())}`;

    setLoading(true);

    console.log("Requesting API with params:", query);

    try {
      const res = await getApi(`/payin-vendor-report?${query}`);
      setLoading(false);

      if (res.error) {
        console.log("Error from API:", res.error);
        api.error({ description: res.error.message });
        return;
      }

      if (!res.data.data) {
        api.warning({ description: 'No data found!' });
        return;
      }

      const formatSetting = [];
      res?.data?.data.forEach((el, index) => {
        formatSetting.push({
          'Created Date': formatDate1(el.createdAt) || '', // Use createdAt or any other relevant date field
          'Formated Date': formatDate1(el.updatedAt) || '',
          'Id': el.id || '', // Using vendor_code as merchant code
          'Amount': el.amount || 0,

          'UTR': el.utr || 0,
          'Status': el.is_used ? "Used" : 'Unused', // Use status or any relevant field for Payin Status

          'Bank Name': el.bankName || '', // Assuming net balance is same as balance for now



        });
      });


      try {
        const csv = await json2csv(formatSetting);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        const fileName = `TrustPay-Accounts-File`.toLowerCase(); // File name
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error converting data to CSV:', error);
      }
    } catch (error) {
      setLoading(false); // Set loading to false if error occurs
      console.error("Error fetching data:", error); // Log error
      api.error({ description: 'An error occurred while fetching the data' });
    }
  };


  const options = statusOptions.map((el) => {
    if (el.label === "All") {
      return {
        label: "All",
        value: "All",
      };
    }
    return el;
  });

  return (
    <>
      {notificationContext}
      <PayDesign
        handleFinish={handlePayIn}
        title='Vendor Payin Report'
        loading={loading}
        vendorMethods={options}
      />
    </>
  );
};

export default VendorPayInReports;
