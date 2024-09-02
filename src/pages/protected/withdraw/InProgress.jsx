import React, { useContext, useEffect } from 'react';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const InProgress = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "In Progress" }))
  }, [])
  const AllowedRoles = ["MERCHANT", "ADMIN", "OPERATIONS"]
  const context = useContext(PermissionContext)

  return (
    <>
        {AllowedRoles.includes(context.role) && <Withdraw type="In Progress" />}
    </>
  )
}

export default InProgress;
