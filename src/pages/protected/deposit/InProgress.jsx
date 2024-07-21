
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import InProgress from '../../../features/deposit/inProgress/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'

function InternalPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "In Progress" }))
  }, [])


  return (
    <InProgress />
  )
}

export default InternalPage
