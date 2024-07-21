
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import All from '../../../features/deposit/All/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'

function InternalPage() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }))
  }, [])


  return (
    <All />
  )
}

export default InternalPage
