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
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000; // IST offset (India Standard Time)
    const formattedDates = data.range.map((date) => new Date(date));
    delete data.range; // Remove range from data

    const startDate = formattedDates[0];
    const endDate = formattedDates[1];
    console.log("Data being processed:", data); // Log input data

    const adjustedStartDate = new Date(startDate.getTime() - istOffset); // Adjust start date for IST
    const adjustedEndDate = new Date(endDate.getTime() - istOffset); // Adjust end date for IST

    adjustedStartDate.setUTCDate(adjustedStartDate.getUTCDate());
    adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);

    adjustedStartDate.setUTCHours(18, 30, 0, 0);
    adjustedEndDate.setUTCHours(18, 29, 59, 999);

    let query = data.vendorCode
    .map((code) => "vendorCode=" + encodeURIComponent(code))
    .join("&");
  const completeData = {
    startDate: adjustedStartDate,
    endDate: adjustedEndDate,
  }
  setLoading(true);

    console.log("Requesting API with params:", query); // Log the query string
    const res = await getApi(`/payin-vendor-report?${query}`, completeData);
    setLoading(false);

    if (res.error) {
      console.log("Error from API:", res.error); // Log any error from API
      api.error({ description: res.error.message });
      return;
    }

    if (!res.data.data) {
      api.warning({ description: 'No data found!' });
      return;
    }
    const formatSetting = [];
    res?.data?.data.forEach((el, index, array) => {
      console.log("Processing element:", el); // Log each element in the loop

      formatSetting.push({
        'Date': formatDate1(el.date)  || '', // Use createdAt or any other relevant date field
        'Vendor Code': el.vendor_code || '', // Using vendor_code as merchant code
        'PayIn Count': el.payin_count || 0,
        'Payin Amount': el.min_payin || 0, // Use min_payin or any relevant field for Payin Amount
        'Current Balance': el.balance || '',
        'Net Balance': el.balance || '', // Assuming net balance is same as balance for now

        'Name': el.name || '',
        'Account Number': el.ac_no || '',
        'Account Name': el.ac_name || '',
        'IFSC': el.ifsc || '',
        'Bank Name': el.bank_name || '',
        'Is QR': el.is_qr !== undefined ? el.is_qr : '', // Check if value exists
        'Is Bank': el.is_bank !== undefined ? el.is_bank : '', // Check if value exists
        'Min PayIn': el.min_payin || '',
        'Max PayIn': el.max_payin || '',
        'Is Enabled': el.is_enabled !== undefined ? el.is_enabled : '',
        'Bank Used For': el.bank_used_for || '',
        'Allow Intent': el.allow_intent !== undefined ? el.allow_intent : '',
      });

      // Add a blank row if the vendor_code changes and it's not the last element
      // if (array[index + 1] && el.vendor_code !== array[index + 1].vendor_code) {
      //   formatSetting.push({
      //     'Date': '',
      //     'Merchant Code': '',
      //     'PayIn Count': '',
      //     'Payin Amount': '',
      //     'PayIn Commission': '',
      //     'Settlement Count': '',
      //     'Settlement Amount': '',
      //     'Lien Count': '',
      //     'Lien Amount': '',
      //     'Current Balance': '',
      //     'Net Balance': '',
      //     'Name': '',
      //     'Account Number': '',
      //     'Account Name': '',
      //     'IFSC': '',
      //     'Bank Name': '',
      //     'Is QR': '',
      //     'Is Bank': '',
      //     'Min PayIn': '',
      //     'Max PayIn': '',
      //     'Is Enabled': '',
      //     'Bank Used For': '',
      //     'Allow Intent': '',
      //   });
      // }
    });

    console.log("Formatted data for CSV:", formatSetting); // Log the formatted data

    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `TrustPay-Accounts-File`.toLowerCase();
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error converting data to CSV:', error);
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
