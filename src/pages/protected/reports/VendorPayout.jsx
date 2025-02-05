import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import VendorPayoutComponent from '../../../components/reports/VendorPayoutComponent';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout';

const VendorPayout = () => {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","TRANSACTIONS","VENDOR","VENDOR_OPERATIONS","OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <>{AllowedRoles.includes(context.role) && <VendorPayoutComponent />} </>
  )
}

export default VendorPayout;
