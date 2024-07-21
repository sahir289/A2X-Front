
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import Dropped from '../../../features/deposit/dropped/index.jsx'

function InternalPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dropped" }))
  }, [])


  return (
    <Dropped />
  )
}

export default InternalPage
