import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const Completed = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Completed" }))
  }, [])
  const AllowedRoles = ["MERCHANT", "ADMIN", "MERCHANT_ADMIN", "OPERATIONS", "VENDOR", "TRANSACTIONS", "MERCHANT_OPERATIONS", "VENDOR_OPERATIONS"]
  const context = useContext(PermissionContext)

  return (
    <>
      {AllowedRoles.includes(context.role) && <Withdraw type="Completed" />}
    </>
  )
}

export default Completed;
