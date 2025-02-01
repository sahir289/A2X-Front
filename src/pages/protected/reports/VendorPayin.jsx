import React, { useEffect, useContext } from 'react';
import ReportComponent from '../../../components/reports/vendorReportComponent.jsx';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'
import VendorPayInReports from '../../../components/reports/VendorPayInReports.jsx';

const VendorReport = () => {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","TRANSACTIONS","VENDOR"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "VendorPay" }))
  }, [])

  return (
    <>{
      AllowedRoles.includes(context.role) && <VendorPayInReports />} </>
  )
}

export default VendorReport;
