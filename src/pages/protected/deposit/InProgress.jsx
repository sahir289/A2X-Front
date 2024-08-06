
import { useContext, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import InProgress from '../../../features/deposit/inProgress/index.jsx'
import { setPageTitle } from '../../../redux/slice/headerSlice.jsx'
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout.jsx'

function InternalPage() {
  const dispatch = useDispatch()


  const AllowedRoles = ["MERCHANT", "ADMIN","OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "In Progress" }))
  }, [])


  return (<>
    {
      AllowedRoles.includes(context.role) &&  <InProgress />
    }
  </>
  )
}

export default InternalPage
