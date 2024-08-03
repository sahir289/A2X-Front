import { useDispatch, useSelector } from 'react-redux'
import LeftSidebar from "./LeftSidebar"
import PageContent from "./PageContent.jsx"
// import RightSidebar from './RightSidebar'
import { useEffect } from "react"
import { NotificationContainer, NotificationManager } from 'react-notifications'
import 'react-notifications/lib/notifications.css'
import WebSockets from "../components/WebSockets/WebSockets.jsx"
import { getApi } from '../redux/api.jsx'
import { removeNotificationMessage } from "../redux/slice/headerSlice.jsx"
import { initMerchants } from "../redux/slice/merchantSlice.jsx"
// import ModalLayout from "./ModalLayout"

function Layout() {
  const dispatch = useDispatch()
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header)


  useEffect(() => {
    if (newNotificationMessage !== "") {
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success')
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error')
      dispatch(removeNotificationMessage())
    }
  }, [newNotificationMessage])

  useEffect(() => {
    handelGetMerchants();
  }, []);

  const handelGetMerchants = async () => {
    try {
      const res = await getApi("/getall-merchant");
      if (Array.isArray(res.data?.data?.merchants)) {
        dispatch(initMerchants(res.data.data.merchants));
      }
    } catch (err) { }
  }

  return (
    <>
      <WebSockets />  {/*  to get the message from backend when the api is hit. */}
      { /* Left drawer - containing page content and side bar (always open) */}
      <div className="drawer  lg:drawer-open">
        <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <PageContent />
        <LeftSidebar />
      </div>

      { /* Right drawer - containing secondary content like notifications list etc.. */}
      {/* <RightSidebar /> */}


      {/** Notification layout container */}
      <NotificationContainer />

      {/* Modal layout container */}
      {/* <ModalLayout /> */}

    </>
  )
}

export default Layout
