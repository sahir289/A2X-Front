import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import { formatDate1, formatDateToISTString } from '../../utils/utils';
import PayDesign from './index';

const VendorReportComponent = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();

  //handlePayInFunction
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
    let query = data.vendorCode
      .map((code) => "vendorCode=" + encodeURIComponent(code))
      .join("&");
    const completeData = {
      startDate: formatDateToISTString(adjustedStartDate),
      endDate: formatDateToISTString(adjustedEndDate),
    }
    setLoading(true);
    const res = await getApi(`/weekly-vendor-report?${query}`, completeData);
    setLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    if (!res.data.data) {
      api.warning({ description: 'No data found!' });
      return;
    }
    const formatSetting = [];
    res?.data?.data.forEach((el, index, array) => {
      // Add the current element to the formatted array
      formatSetting.push({
        'Date': formatDate1(el.date) || '',
        'Vendor Code': el.vendor_code || '',
        'PayIn Count': el.payInCount || 0,
        'Payin Amount': el.totalPayinAmount || 0,
        'PayIn Commission': 0,
        'PayOut Count': el.payOutCount || 0,
        'PayOut Amount': el.totalPayoutAmount || 0,
        'PayOut Commission': 0,
        'Reversed PayOut Count': el.reversedPayOutCount || 0,
        'Reversed PayOut Amount': el.reversedTotalPayoutAmount || 0,
        'Reversed PayOut Commission': 0,
        'Settlement Count': el.settlementCount || 0,
        'Settlement Amount': el.totalSettlementAmount || 0,
        'Current Balance': el.netBalance || '',
        'Net Balance': el.totalBalance || '',
      });

      // Add a blank row if the vendor_code changes and it's not the last element
      if (array[index + 1] && el.vendor_code !== array[index + 1].vendor_code) {
        formatSetting.push({
          'Date': '',
          'Vendor Code': '',
          'PayIn Count': '',
          'Payin Amount': '',
          'PayIn Commission': '',
          'PayOut Count': '',
          'PayOut Amount': '',
          'PayOut Commission': '',
          'Reversed PayOut Count': '',
          'Reversed PayOut Amount': '',
          'Reversed PayOut Commission': '',
          'Settlement Count': '',
          'Settlement Amount': '',
          'Lien Count': '',
          'Lien Amount': '',
          'Current Balance': '',
          'Net Balance': '',
        });
      }
    });
    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `TrustPay-Vendor-Accounts-File`.toLowerCase();
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error converting data to CSV:', error);
    }
  }

  return (
    <>
      {notificationContext}
      <PayDesign
        handleFinish={handlePayIn}
        title='Vendor Report'
        loading={loading}
      />
    </>
  )
}

export default VendorReportComponent;
