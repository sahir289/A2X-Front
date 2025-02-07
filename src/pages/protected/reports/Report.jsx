import React, { useEffect, useContext } from 'react';
import ReportComponent from '../../../components/reports/reportComponent';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'

const Report = () => {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","TRANSACTIONS","MERCHANT","MERCHANT_ADMIN"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <>{AllowedRoles.includes(context.role) && <ReportComponent />} </>
  )
}

export default Report;
