
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import All from '../../../features/settlement/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'

function Accounts() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setPageTitle({ title: "Settlements" }))
  }, [])


  return (
    <All />
  )
}

export default Accounts;
