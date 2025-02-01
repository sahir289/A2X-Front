import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { PermissionContext } from '../components/AuthLayout/AuthLayout.jsx';
import routes from '../router/sidebar.jsx';
import SidebarSubmenu from './SidebarSubmenu.jsx';

function LeftSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [filteredRoutes, setFilteredRoutes] = useState(routes)

  const dispatch = useDispatch()
  const context = useContext(PermissionContext)
  const close = (e) => {
    document.getElementById('left-sidebar-drawer').click()
  }
  useEffect(() => {
    const filterRoutes = routes.filter(route => {
      if (context.role === "MERCHANT" && (route.name === "Bank Accounts" || route.name === "Vendor" || route.name === "Merchant" || route.name === "Add data" || route.name === "Vendor Board" || route.name === "Vendor Settlements"))
        return false;

      if (context.role === "MERCHANT_ADMIN" && (route.name === "Bank Accounts" || route.name === "Vendor" || route.name === "Add data" || route.name === "Vendor Board" || route.name === "Vendor Settlements"))
        return false;

      if ((context?.role === "MERCHANT_OPERATIONS") &&
        (route.name === "Add data" || route.name === "Bank Accounts" || route.name === "Merchant" || route.name === "User" || route.name === "Vendor" || route.name === "Vendor Board" || route.name === "Vendor Settlements" || route.name === "Settlements" || route.name === "ChargeBack"))
        return false;

      if ((context?.role === "OPERATIONS") &&
        (route.name === "Merchant" || route.name === "Settlements" || route.name === "User" || route.name === "ChargeBack" || route.name === "Vendor" || route.name === "Vendor Board" || route.name === "Vendor Settlements"))
        return false;

      if (context?.role === "VENDOR" &&
        (route.name === "Dashboard" || route.name === "Merchant" || route.name === "Vendor" || route.name === "Add data" || route.name === "Reports" || route.name === "Settlements" || route.name === "ChargeBack"))
        return false;

      if (context?.role === "VENDOR_OPERATIONS" &&
        (route.name === "Dashboard" || route.name === "Merchant" || route.name === "Vendor" || route.name === "Add data" || route.name === "Reports" || route.name === "Settlements" || route.name === "User" || route.name === "ChargeBack"))
        return false;

      // Allow "Add data" for all other roles, including ADMIN
      return true;
    });

    setFilteredRoutes(filterRoutes);
  }, [routes, context]);

  const navigateToDashboard = () => {
    if (context.role === "VENDOR_OPERATIONS" || context.role === "VENDOR") {
      navigate("/app/vendor-board");
    }
    else {
      navigate("/app/dashboard");
    }
  }

  return (
    <div className="drawer-side z-30  ">
      <label htmlFor="left-sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu pt-2 w-30 bg-base-100 min-h-full text-base-content">
        <button className="btn btn-ghost bg-base-300  btn-circle z-50 top-0 right-0 mt-4 mr-2 absolute lg:hidden" onClick={() => close()}>
          <XMarkIcon className="h-5 inline-block w-5" />
        </button>

        <li className="mb-2 font-semibold text-xl">

          <p onClick={navigateToDashboard}><img className="mask mask-squircle w-10" src="/blueLogo.png" alt="A2X-PAY logo" />Trust-Pay</p> </li>
        {
          filteredRoutes.map((route, k) => {
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
