import React, { useEffect } from 'react';
<<<<<<< HEAD
import VendorPayoutsComponent from '../../../components/reports/PayoutVendor';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
=======
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import VendorPayoutComponent from '../../../components/reports/VendorPayoutComponent';
>>>>>>> d2e35d4b584be7d5bc7e2f45950832e6455e21e1

const VendorPayout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
<<<<<<< HEAD
    dispatch(setPageTitle({ title: "Vendor Payout Reports" }))
  }, [])

  return (
    <VendorPayoutsComponent />
=======
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <VendorPayoutComponent />
>>>>>>> d2e35d4b584be7d5bc7e2f45950832e6455e21e1
  )
}

export default VendorPayout;
