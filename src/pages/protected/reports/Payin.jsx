import React, { useEffect } from 'react';
import PayinComponent from '../../../components/reports/PayinComponent';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../redux/slice/headerSlice';

const Payin = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Reports" }))
  }, [])

  return (
    <PayinComponent />
  )
}

export default Payin;
