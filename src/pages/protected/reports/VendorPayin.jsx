import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';
import VendorPayinComponent from '../../../components/reports/VendorPayinComponent';

const VendorPayin = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <VendorPayinComponent />
  )
}

export default VendorPayin;
