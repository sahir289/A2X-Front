import React, { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import VendorPayinComponent from '../../../components/reports/VendorPayinComponent';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout';

const VendorPayin = () => {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","TRANSACTIONS","MERCHANT","MERCHANT_ADMIN"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <>{AllowedRoles.includes(context.role) && <VendorPayinComponent />} </>
  )
}

export default VendorPayin;
