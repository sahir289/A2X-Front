  import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Dashboard from '../../features/dashboard'
import { setPageTitle } from '../../redux/slice/headerSlice'
import { PermissionContext } from '../../components/AuthLayout/AuthLayout'

function InternalPage() {
  const dispatch = useDispatch()
  const AllowedRoles = ["ADMIN","OPERATIONS","MERCHANT","VENDOR"]
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
