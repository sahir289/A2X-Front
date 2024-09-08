import React, { useEffect } from 'react'
import RolesComponent from '../../../components/Roles'
import { useContext } from 'react';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const Roles = () => {
  const AllowedRoles = ["ADMIN", "MERCHANT","VENDOR","TRANSACTIONS"]
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
