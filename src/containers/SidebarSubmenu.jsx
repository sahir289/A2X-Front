import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import { useEffect, useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PermissionContext } from '../components/AuthLayout/AuthLayout';

function SidebarSubmenu({ submenu, name, icon }) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const context = useContext(PermissionContext);

  /** Open Submenu list if path found in routes, this is for directly loading submenu routes  first time */
  useEffect(() => {
    if (submenu.some(m => m.path === location.pathname)) setIsExpanded(true);
  }, [submenu, location.pathname]);

  return (
    <div className="flex flex-col">
      {/** Route header */}
      <div className="w-full block" onClick={() => setIsExpanded(!isExpanded)}>
        {icon} {name}
        <ChevronDownIcon
          className={
            'w-5 h-5 mt-1 float-right delay-400 duration-500 transition-all ' +
            (isExpanded ? 'rotate-180' : '')
          }
        />
      </div>

      {/** Submenu list */}
      <div className={`w-full ` + (isExpanded ? '' : 'hidden')}>
        <ul className="menu menu-compact">
          {submenu
            .filter(m => {
              // Hide item if role is OPERATIONS and name is Accounts
              if (context?.role === 'OPERATIONS' && (m.name === 'Accounts' || (m.name === 'Vendor Accounts'))) {
                return false;
              }
              else if ((context?.role === 'MERCHANT' || context?.role === 'MERCHANT_ADMIN') && (m.name === 'Vendor Accounts' || m.name === 'Vendor Payins' || m.name === 'Vendor Payouts')) {
                return false;
              }
              else if ((context?.role === 'MERCHANT_OPERATIONS') && (m.name === 'Accounts' || m.name === 'Vendor Accounts' || m.name === 'Vendor Payins' || m.name === 'Vendor Payouts')) {
                return false;
              }
              else if ((context?.role === 'VENDOR') && ((m.name === 'Accounts' && m.path === '/app/report') || m.name === 'Payins' || m.name === 'Payouts')) {
                return false;
              }
              else if ((context?.role === 'VENDOR_OPERATIONS') && ((m.name === 'Accounts' && m.path === '/app/report') || m.name === 'Payins' || m.name === 'Payouts' || m.name === 'Vendor Accounts')) {
                return false;
              }
              return true;
            })
            .map((m, k) => (
              <li key={k}>
                <Link to={m.path}>
                  {m.icon} {m.name}
                  {location.pathname === m.path ? (
                    <span
                      className="absolute mt-1 mb-1 inset-y-0 left-0 w-1 rounded-tr-md rounded-br-md bg-primary"
                      aria-hidden="true"
                    ></span>
                  ) : null}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default SidebarSubmenu;
