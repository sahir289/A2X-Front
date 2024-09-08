import React, { useContext, useEffect } from 'react';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const Completed = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Completed" }))
  }, [])
  const AllowedRoles = ["MERCHANT", "ADMIN", "OPERATIONS","VENDOR","TRANSACTIONS"]
  const context = useContext(PermissionContext)

  return (
    <>
      {AllowedRoles.includes(context.role) && <Withdraw type="Completed" />}
    </>
  )
}

export default Completed;
