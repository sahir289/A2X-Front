import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const All = () => {

  const dispatch = useDispatch()
  const AllowedRoles = ["MERCHANT", "ADMIN", "MERCHANT_ADMIN", "OPERATIONS", "VENDOR", "TRANSACTIONS", "MERCHANT_OPERATIONS", "VENDOR_OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }))
  }, [])

  return (
    <>
      {AllowedRoles.includes(context.role) && <Withdraw type="All" />}
    </>
  )
}

export default All;
