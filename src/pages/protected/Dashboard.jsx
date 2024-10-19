import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { PermissionContext } from '../../components/AuthLayout/AuthLayout'
import Dashboard from '../../features/dashboard'
import { setPageTitle } from '../../redux/slice/headerSlice'

function InternalPage() {
  const dispatch = useDispatch()
  const AllowedRoles = ["ADMIN", "OPERATIONS", "MERCHANT", "MERCHANT_ADMIN", "TRANSACTIONS", "MERCHANT_OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dashboard" }))
  }, [])


  return (
    <>
      {AllowedRoles.includes(context.role) && <Dashboard />}
    </>
  )
}

export default InternalPage
