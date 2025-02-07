import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import VendorPayoutsComponent from '../../../components/reports/PayoutVendor';
import { setPageTitle } from '../../../redux/slice/headerSlice';
<<<<<<< HEAD

const VendorPayout = () => {
  const dispatch = useDispatch()
=======
import VendorPayoutComponent from '../../../components/reports/VendorPayoutComponent';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout';

const VendorPayout = () => {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","TRANSACTIONS","VENDOR","VENDOR_OPERATIONS","OPERATIONS"]
  const context = useContext(PermissionContext)

>>>>>>> a3e5167482190782a5fa058c270ffdee14f05c9f
  useEffect(() => {
    dispatch(setPageTitle({ title: "Vendor Payout Reports" }))
  }, [])

  return (
<<<<<<< HEAD
    <VendorPayoutsComponent />

=======
    <>{AllowedRoles.includes(context.role) && <VendorPayoutComponent />} </>
>>>>>>> a3e5167482190782a5fa058c270ffdee14f05c9f
  )
}

export default VendorPayout;
