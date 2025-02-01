import React, { useEffect } from 'react';
import VendorPayoutsComponent from '../../../components/reports/PayoutVendor';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';

const VendorPayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Vendor Payout Reports" }))
  }, [])

  return (
    <VendorPayoutsComponent />
  )
}

export default VendorPayout;
