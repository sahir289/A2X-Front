import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import PayDesign from './index';
const PayinComponent = () => {
  const [loading, setLoading] = useState(false);
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

  }
  return (
    <>
      <PayDesign handleFinish={handlePayIn} title='Payins' loading={loading} />
    </>
  )
}

export default PayinComponent;
