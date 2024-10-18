
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import Dropped from '../../../features/deposit/dropped/index.jsx'
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'

function InternalPage() {
  const dispatch = useDispatch()
  const AllowedRoles = ["MERCHANT", "MERCHANT_ADMIN", "ADMIN","OPERATIONS","TRANSACTIONS","VENDOR","MERCHANT_OPERATIONS","VENDOR_OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Dropped" }))
  }, [])


  return (<>
    {
      AllowedRoles.includes(context.role) &&  <Dropped />
    }
  </>
  )
}

export default InternalPage
