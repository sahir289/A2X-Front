// import { useDispatch, useSelector } from 'react-redux'
// import LeftSidebar from "./LeftSidebar"
// import PageContent from "./PageContent.jsx"
// import { useEffect } from "react"
// import { NotificationContainer, NotificationManager } from 'react-notifications'
// import 'react-notifications/lib/notifications.css'
// import { getApi } from '../redux/api.jsx'
// import { removeNotificationMessage } from "../redux/slice/headerSlice.jsx"
// import { initMerchants } from "../redux/slice/merchantSlice.jsx"
// import { useNavigate } from 'react-router-dom'

// function Layout() {
//   const dispatch = useDispatch()
//   const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header)
//   const navigate = useNavigate()


//   useEffect(() => {
//     if (newNotificationMessage !== "") {
//       if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success')
//       if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error')
//       dispatch(removeNotificationMessage())
//     }
//   }, [newNotificationMessage])

//   useEffect(() => {
//     handelGetMerchants();
//   }, []);

//   const handelGetMerchants = async () => {
//     const res = await getApi("/getall-merchant");
//     if (res.error?.error?.response?.status === 401) {
//       NotificationManager.error(res?.error?.message, 401);
//       localStorage.clear();
//       navigate('/')
//     }
//     if (Array.isArray(res.data?.data?.merchants)) {
//       dispatch(initMerchants(res.data.data.merchants));
//     }
//   }

//   return (
//     <>

//       { /* Left drawer - containing page content and side bar (always open) */}
//       <div className="drawer  lg:drawer-open">
//         <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
//         <PageContent />
//         <LeftSidebar />
//       </div>


//       {/** Notification layout container */}
//       <NotificationContainer />


//     </>
//   )
// }

// export default Layout

import { useDispatch, useSelector } from 'react-redux';
import LeftSidebar from './LeftSidebar';
import PageContent from './PageContent.jsx';
import { useContext, useEffect } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { getApi } from '../redux/api.jsx';
import { removeNotificationMessage } from '../redux/slice/headerSlice.jsx';
import { initMerchants } from '../redux/slice/merchantSlice.jsx';
import { useNavigate } from 'react-router-dom';
import { PermissionContext } from '../components/AuthLayout/AuthLayout.jsx';

function Layout() {
  const userData = useContext(PermissionContext);
  const dispatch = useDispatch();
  const { newNotificationMessage, newNotificationStatus } = useSelector(state => state.header);
  const navigate = useNavigate();

  useEffect(() => {
    if (newNotificationMessage !== "") {
      // Clear any previous notifications before showing a new one
      NotificationManager.listNotify = [];

      // Show the new notification based on status
      if (newNotificationStatus === 1) NotificationManager.success(newNotificationMessage, 'Success');
      if (newNotificationStatus === 0) NotificationManager.error(newNotificationMessage, 'Error');

      // Clear the message from the Redux store
      dispatch(removeNotificationMessage());
    }
  }, [newNotificationMessage]);

  useEffect(() => {
    const allowedRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN", "ADMIN", "TRANSACTIONS", "OPERATIONS"]
    if (userData.role && allowedRoles.includes(userData.role)) {
      handelGetMerchants();
    }
  }, [userData]);

  const handelGetMerchants = async () => {
    const merchantRoles = ["MERCHANT", "MERCHANT_OPERATIONS", "MERCHANT_ADMIN"];
    const res = await getApi(merchantRoles.includes(userData.role) ? `/getall-merchant?merchantCode=${userData.code[0]}` : "/getall-merchant");
    if (res.error?.error?.response?.status === 401) {
      // Clear previous notifications and show error notification
      NotificationManager.listNotify = [];
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate('/');
    }
    if (Array.isArray(res.data?.data?.merchants)) {
      dispatch(initMerchants(res.data.data.merchants));
    }
  };

  return (
    <>
      {/* Left drawer - containing page content and side bar (always open) */}
      <div className="drawer lg:drawer-open">
        <input id="left-sidebar-drawer" type="checkbox" className="drawer-toggle" />
        <PageContent />
        <LeftSidebar />
      </div>

      {/* Notification layout container */}
      <NotificationContainer />
    </>
  );
}

export default Layout;

