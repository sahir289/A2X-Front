import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useState } from 'react';
import { postApi } from '../../redux/api';
import { formatDate, payoutInOutStatusOptions } from '../../utils/utils';
import PayDesign from './index';


const PayoutComponent = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();

  //handlePayInFunction
  const handlePayOut = async (data) => {
    const formattedDates = data.range.map(date =>  new Date(date).toLocaleDateString('en-CA'));
    const startDate = formattedDates[0];
    const endDate = formattedDates[1];
    delete data.range;
    const completeData = {
      ...data,
      startDate,
      endDate
    }
    setLoading(true);
    const res = await postApi('/get-all-payouts', completeData);
    setLoading(false);
    if (res.error) {
      api.error({ description: res.error.message });
      return;
    }
    if (!res.data.data?.length) {
      api.warning({ description: 'No data found!' });
      return;
    }
    const formatSetting = res.data.data.map((el) => ({
      'ID': el.sno || '',
      'Status': el.status || '',
      'User Amount': el.amount || '',
      'Commission': el.payout_commision || '',
      'UTR': el.utr_id || '',
      'Merchant': el?.Merchant?.code || '',
      'Merchant Order Id': el.merchant_order_id || '',
      'User': el.user_id || '',
      'Account Number': el.acc_no || '',
      'Account Holder Name': el.acc_holder_name || '',
      'IFSC': el.ifsc_code || '',
      'Initiated At': formatDate(el.createdAt) || '',
      'Confirmed At': formatDate(el.updatedAt) || '',
    }))
    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `payout-${data.status}-${formatDate(Date.now())}`.toLowerCase();
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
        handleFinish={handlePayOut}
        title='Payouts'
        loading={loading}
        statusOptions={payoutInOutStatusOptions}
      />
    </>
  )
}

export default PayoutComponent;
