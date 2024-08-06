import { notification } from 'antd';
import { json2csv } from 'json-2-csv';
import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import { formatDate, statusOptions } from '../../utils/utils';
import PayDesign from './index';

const PayinComponent = () => {
  const [loading, setLoading] = useState(false);
  const [api, notificationContext] = notification.useNotification();

  //handlePayInFunction
  const handlePayIn = async (data) => {
    const startDate = data.range[0];
    const endDate = data.range[1];
    const completeData = {
      ...data,
      startDate,
      endDate
    }
    setLoading(true);
    const res = await getApi('/get-all-payins', completeData);
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
      'Short Code': el.upi_short_code || '',
      'User Amount': el.amount || '',
      'UTR': el.utr || '',
      'Received Amount': el.confirmed || '',
      'Status': el.status || '',
      'Bank': getBankCode(el) || '',
      'Merchant': el?.Merchant?.code || '',
      'User': el.user_id || '',
      'Merchant Order Id': el.merchant_order_id || '',
      'Initiated At': formatDate(el.createdAt) || '',
      'Confirmed At': formatDate(el.updatedAt) || '',
    }))
    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `payin-${data.status}-${Date.now()}`.toLowerCase();
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error converting data to CSV:', error);
    }

  }
  const getBankCode = (record) => {
    return record?.Merchant?.Merchant_Bank[0]?.bankAccount?.bank_name || 'N/A';
  };
  return (
    <>
      {notificationContext}
      <PayDesign
        handleFinish={handlePayIn}
        title='Payins'
        loading={loading}
        statusOptions={statusOptions}
      />
    </>
  )
}

export default PayinComponent;
