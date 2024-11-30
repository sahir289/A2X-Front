import React, { useEffect } from 'react';
import ReportComponent from '../../../components/reports/reportComponent';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';

const Report = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <ReportComponent />
  )
}

export default Report;
