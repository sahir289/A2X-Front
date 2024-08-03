import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Withdraw from '../../../features/withdraw/index.jsx';
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx';

const Completed = () => {

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Completed" }))
  }, [])

  return (
    <>
      <Withdraw type="Completed" />
    </>
  )
}

export default Completed;
