
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import Completed from '../../../features/deposit/completed/index.jsx'


function InternalPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Completed" }))
  }, [])


  return (
    <Completed />
  )
}

export default InternalPage
