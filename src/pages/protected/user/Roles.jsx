import React from 'react'
import RolesComponent from '../../../components/Roles'
import { useContext } from 'react';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx';

const Roles = () => {
  const AllowedRoles=["ADMIN"]
  const context=useContext(PermissionContext)

  return (
    <>
      {AllowedRoles.includes(context.role)  &&<div><RolesComponent /></div>}
    </>
  );

}

export default Roles
