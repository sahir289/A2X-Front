
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import Completed from '../../../features/deposit/completed/index.jsx'
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'


function InternalPage() {
  const dispatch = useDispatch()
  const AllowedRoles = ["MERCHANT", "ADMIN","OPERATIONS","TRANSACTIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Completed" }))
  }, [])


  return (<>
    {
      AllowedRoles.includes(context.role) &&  <Completed />
    }
  </>
  )
}

export default InternalPage
