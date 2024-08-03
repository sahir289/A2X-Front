import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const InProgress = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "In Progress Data" }))
  }, [])

  return (
    <>
      <Withdraw type="In Progress" />
    </>
  )
}

export default InProgress;
