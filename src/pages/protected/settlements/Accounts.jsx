
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import All from '../../../features/settlement/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'

function VendorAccounts() {
  const dispatch = useDispatch()

  const AllowedRoles = ["ADMIN","MERCHANT","VENDOR","OPERATIONS","TRANSACTIONS","MERCHANT_OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Settlements" }))
  }, [])


  return (
    <>{
      AllowedRoles.includes(context.role) && <All />} </>
  )
}

export default VendorAccounts;
