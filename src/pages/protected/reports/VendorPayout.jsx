import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import VendorPayoutComponent from '../../../components/reports/VendorPayoutComponent';

const VendorPayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <VendorPayoutComponent />
  )
}

export default VendorPayout;
