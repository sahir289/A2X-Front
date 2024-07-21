  import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Dashboard from '../../features/dashboard'
import { setPageTitle } from '../../redux/slice/headerSlice'

function InternalPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }))
  }, [])


  return (
    <Dashboard />
  )
}

export default InternalPage
