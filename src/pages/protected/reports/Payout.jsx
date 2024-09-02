import React, { useEffect } from 'react';
import PayoutComponent from '../../../components/reports/PayoutComponent';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';

const Payout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])
  
  return (
    <PayoutComponent />
  )
}

export default Payout;
