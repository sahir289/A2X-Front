import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import { formatDate1 } from '../../utils/utils';
import PayDesign from './index';

const ReportComponent = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();

  //handlePayInFunction
  const handlePayIn = async (data) => {
    const istOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;
    const formattedDates = data.range.map((date) => new Date(date));
    delete data.range;

    const startDate = formattedDates[0];
    const endDate = formattedDates[1];

    const adjustedStartDate = new Date(startDate.getTime()-istOffset);
    const adjustedEndDate = new Date(endDate.getTime()-istOffset);

    adjustedStartDate.setUTCDate(adjustedStartDate.getUTCDate());
    adjustedEndDate.setUTCDate(adjustedEndDate.getUTCDate() + 1);

    adjustedStartDate.setUTCHours(18, 30, 0, 0);
    adjustedEndDate.setUTCHours(18, 29, 59, 999);
    let query = data.merchantCode
      .map((code) => "merchantCode=" + encodeURIComponent(code))
      .join("&");
    const completeData = {
      startDate: (adjustedStartDate),
      endDate: adjustedEndDate
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
    const formatSetting = res?.data?.data.map(el => ({
        'Date': formatDate1(el.date) || '',
        'Merchant Code': el.merchant_code || '',
        'PayIn Count': el.payInCount || 0,
        'Payin Amount': el.totalPayinAmount || 0,
        'PayIn Commission': el.payinCommission || 0,
        'PayOut Count': el.payOutCount || 0,
        'PayOut Amount': el.totalPayoutAmount || 0,
        'PayOut Commission': el.payoutCommission || 0,
        'Settlement Count': el.settlementCount || 0,
        'Settlement Amount': el.totalSettlementAmount || 0,
        'Lien Count': el.lienCount || 0,
        'Lien Amount': el.totalLienAmount || 0,
        'Current Balance': el.netBalance || '',
        'Net Balance': el.totalBalance || '',
      }));
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
        title='Report'
        loading={loading}
      />
    </>
  )
}

export default ReportComponent;