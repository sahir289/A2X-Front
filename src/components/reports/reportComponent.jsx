import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useContext, useState } from 'react';
import { getApi } from '../../redux/api';
import { formatDate1 } from '../../utils/utils';
import PayDesign from './index';
import { PermissionContext } from '../AuthLayout/AuthLayout';

const ReportComponent = () => {
  const userData = useContext(PermissionContext)
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();
  const [includeSubMerchant, setIncludeSubMerchant] = useState(false);

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
    let query = data.merchantCode
      .map((code) => "merchantCode=" + encodeURIComponent(code))
      .join("&");
      let completeData;
      if (userData.role === "ADMIN" || userData.role === "TRANSACTIONS" || userData.role === "OPERATIONS" || userData.role === 'MERCHANT_ADMIN') {
        completeData = {
          startDate: adjustedStartDate,
          endDate: adjustedEndDate,
          includeSubMerchant
        }
      }
      else {
        completeData = {
          startDate: adjustedStartDate,
          endDate: adjustedEndDate,
          includeSubMerchant: true,
        }
      }
    setLoading(true);
    const res = await getApi(`/weekly-report?${query}`, completeData);
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
        'Merchant Code': el.merchant_code || '',
        'PayIn Count': el.payInCount || 0,
        'Payin Amount': el.totalPayinAmount || 0,
        'PayIn Commission': el.payinCommission || 0,
        'PayOut Count': el.payOutCount || 0,
        'PayOut Amount': el.totalPayoutAmount || 0,
        'PayOut Commission': el.payoutCommission || 0,
        'Reversed PayOut Count': el.reversedPayOutCount || 0,
        'Reversed PayOut Amount': el.reversedTotalPayoutAmount || 0,
        'Reversed PayOut Commission': el.reversedPayoutCommission || 0,
        'Settlement Count': el.settlementCount || 0,
        'Settlement Amount': el.totalSettlementAmount || 0,
        'Lien Count': el.lienCount || 0,
        'Lien Amount': el.totalLienAmount || 0,
        'Current Balance': el.netBalance || '',
        'Net Balance': el.totalBalance || '',
      });

      // Add a blank row if the merchant_code changes and it's not the last element
      if (array[index + 1] && el.merchant_code !== array[index + 1].merchant_code) {
        formatSetting.push({
          'Date': '',
          'Merchant Code': '',
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
      const fileName = `TrustPay-Accounts-File`.toLowerCase();
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
        setIncludeSubMerchantFlag={setIncludeSubMerchant}
        title='Report'
        loading={loading}
      />
    </>
  )
}

export default ReportComponent;
