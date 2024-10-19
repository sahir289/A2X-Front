
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import All from '../../../features/deposit/All/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'

function InternalPage() {
  const dispatch = useDispatch()
  const AllowedRoles = ["MERCHANT", "MERCHANT_ADMIN", "ADMIN","OPERATIONS","TRANSACTIONS","VENDOR","MERCHANT_OPERATIONS","VENDOR_OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }))
  }, [])


  return (
    <>
    {
      AllowedRoles.includes(context.role) && <All />
    }
    </>
  )
}

export default InternalPage
