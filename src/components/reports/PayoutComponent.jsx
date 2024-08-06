import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import PayDesign from './index';

const PayoutComponent = () => {
  const [loading, setLoading] = useState(false);
  //handlePayInFunction
  const handlePayOut = async (data) => {
    const startDate = data.range[0];
    const endDate = data.range[1];
    const completeData = {
      ...data,
      startDate,
      endDate
    }
    setLoading(true);
    const res = await getApi('/get-all-payouts', completeData);
    setLoading(false);
  }
  return (
    <>
      <PayDesign handleFinish={handlePayOut} title='Payouts' loading={loading} />
    </>
  )
}

export default PayoutComponent;
