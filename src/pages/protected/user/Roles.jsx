import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import RolesComponent from '../../../components/Roles';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const Roles = () => {
  const AllowedRoles = ["ADMIN", "MERCHANT", "VENDOR", "TRANSACTIONS", "MERCHANT_ADMIN"]
  const context = useContext(PermissionContext)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "User" }))
  }, [])
  return (
    <>
      {AllowedRoles.includes(context.role) && <div><RolesComponent /></div>}
    </>
  );

}

export default Roles
