import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const All = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }))
  }, [])

  return (
    <>
      <Withdraw type="All" />
    </>
  )
}

export default All;
