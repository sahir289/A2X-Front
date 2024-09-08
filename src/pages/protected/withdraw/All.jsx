import React, { useContext, useEffect } from 'react';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const All = () => {

  const dispatch = useDispatch()
  const AllowedRoles = ["MERCHANT", "ADMIN", "OPERATIONS","VENDOR","TRANSACTIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }))
  }, [])

  return (
    <>
      {AllowedRoles.includes(context.role) && <Withdraw type="All" /> }
    </>
  )
}

export default All;
