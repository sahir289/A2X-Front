import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import routes from '../router/sidebar.jsx';
import SidebarSubmenu from './SidebarSubmenu.jsx';
import { useContext, useEffect, useState } from 'react';
import { PermissionContext } from '../components/AuthLayout/AuthLayout.jsx';

function LeftSidebar() {
  const location = useLocation();
  const [filteredRoutes, setFilteredRoutes] = useState(routes)

  const dispatch = useDispatch()
  const context = useContext(PermissionContext)
  console.log("🚀 ~ LeftSidebar ~ context:", context)

  const close = (e) => {
    document.getElementById('left-sidebar-drawer').click()
  }
  useEffect(() => {
    const filterRoutes = routes.filter(route => {
      if (context.role === "MERCHANT" && (route.name === "Bank Accounts" || route.name === "Vendor" || route.name === "Merchant" || route.name === "Add data"))
        return false;

      if ((context?.role === "OPERATIONS" || context?.role === "MERCHANT_OPERATIONS") &&
        (route.name === "Add data" || route.name === "Bank Accounts" || route.name === "Merchant" || route.name === "User" || route.name === "Vendor"))
        return false;

      if (context?.role === "VENDOR" &&
        (route.name === "Dashboard" || route.name === "Merchant" || route.name === "Vendor" || route.name === "Add data" || route.name === "Reports" || route.name === "Settlements" ))
        return false;

      // Allow "Add data" for all other roles, including ADMIN
      return true;
    });

    setFilteredRoutes(filterRoutes);
  }, [routes, context]);


  return (
    <div className="drawer-side  z-30  ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu  pt-2 w-60 bg-base-100 min-h-full   text-base-content">
        <button className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden" onClick={() => close()}>
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">

          <p><img className="mask mask-squircle w-10" src="/logo192.png" alt="A2X-PAY logo" />Trust-Pay</p> </li>
        {
          filteredRoutes.map((route, k) => {
            console.log("🚀 ~ filteredRoutes.map ~ route:", route)
            return (
              <li className="" key={k}>
                {
                  route.submenu ?
                    <SidebarSubmenu {...route} />
                    :
                    (<NavLink
                      end
                      to={route.path}
                      className={({ isActive }) => `${isActive ? 'font-semibold  bg-base-200 ' : 'font-normal'}`} >
                      {route.icon} {route.name}
                      {
                        location.pathname === route.path ? (<span className="absolute inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary "
                          aria-hidden="true"></span>) : null
                      }
                    </NavLink>)
                }

              </li>
            )
          })
        }

      </ul>
    </div>
  )
}

export default LeftSidebar
