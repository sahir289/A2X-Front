import React, { useState } from 'react';
import { getApi } from '../../redux/api';
import PayDesign from './index';
const PayinComponent = () => {
  const [loading, setLoading] = useState(false);
  //handlePayInFunction
  const handlePayIn = async (data) => {
    console.log(data);
    const startDate = data.range[0];
    const endDate = data.range[1];
    const completeData = {
      ...data,
      startDate,
      endDate
    }
    console.log(completeData);

    setLoading(true);
    const res = await getApi('/get-all-payins', completeData);
    setLoading(false);
    console.log(res);

  }
  return (
    <div className='h-full'>
      <PayDesign handleFinish={handlePayIn} title='Payins' loading={loading} />
    </div>
  )
}

export default PayinComponent;
