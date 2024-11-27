import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CheckBadgeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  GlobeAltIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import {
  CreditCardIcon,
  DocumentPlusIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import Squares2X2Icon from "@heroicons/react/24/outline/Squares2X2Icon";
import { Vendor } from "../utils/constants";

const iconClasses = `h-6 w-6`;
const submenuIconClasses = `h-5 w-5`;


const routes = [
  {
    path: "/app/dashboard",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Dashboard",
  },
  {
    path: "/app/vendor-board",
    icon: <Squares2X2Icon className={iconClasses} />,
    name: "Vendor Board",
  },
  {
    path: "/app/add-data",
    icon: <DocumentPlusIcon className={iconClasses} />,
    name: "Add data",
  },
  {
    path: "",
    icon: <CurrencyDollarIcon className={`${iconClasses} inline`} />, // icon component
    name: "Deposit", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/deposit/progress",
        icon: <ArrowTrendingUpIcon className={submenuIconClasses} />,
        name: "In Progress",
      },
      {
        path: "/app/deposit/completed",
        icon: <CheckBadgeIcon className={submenuIconClasses} />,
        name: "Completed",
      },
      {
        path: "/app/deposit/dropped",
        icon: <TrashIcon className={submenuIconClasses} />,
        name: "Dropped",
      },
      {
        path: "/app/deposit/all",
        icon: <GlobeAltIcon className={submenuIconClasses} />,
        name: "All",
      },
    ],
  },
  {
    path: "",
    icon: <ArrowRightCircleIcon className={`${iconClasses} inline`} />, // icon component
    name: "Withdrawals", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/withdrawal/progress", //url
        icon: <ArrowTrendingUpIcon className={submenuIconClasses} />, // icon component
        name: "In Progress", // name that appear in Sidebar
      },
      {
        path: "/app/withdrawal/completed",
        icon: <CheckBadgeIcon className={submenuIconClasses} />,
        name: "Completed",
      },
      {
        path: "/app/withdrawal/all",
        icon: <GlobeAltIcon className={submenuIconClasses} />,
        name: "All",
      },
    ],
  },
  {
    path: "",
    icon: <BanknotesIcon className={`${iconClasses} inline`} />, // icon component
    name: "Settlements", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/settlements",
        icon: <UserCircleIcon className={submenuIconClasses} />,
        name: "Accounts",
      },
    ],
  },
  {
    path: "",
    icon: <BanknotesIcon className={`${iconClasses} inline`} />, // icon component
    name: "Vendor Settlements", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/vendorsettlements",
        icon: <UserCircleIcon className={submenuIconClasses} />,
        name: "Accounts",
      },
    ],
  },
  {
    path: "/app/lien",
    icon: <ArrowLeftCircleIcon className={iconClasses} />,
    name: "ChargeBack",
  },
  {
    path: "/app/merchant",
    icon: <CreditCardIcon className={iconClasses} />,
    name: "Merchant",
  },
  {
    path: "/app/bank-accounts",
    icon: <BuildingLibraryIcon className={iconClasses} />,
    name: "Bank Accounts",
  },
  {
    path: "/app/vendor",
    icon: <Vendor />,
    name: "Vendor",
  },
  {
    path: "",
    icon: <UsersIcon className={`${iconClasses} inline`} />, // icon component
    name: "User", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/user",
        icon: <UserGroupIcon className={submenuIconClasses} />, // icon component
        name: "Roles", // name that appear in Sidebar
      },
    ],
  },
  {
    path: "",
    icon: <ExclamationTriangleIcon className={`${iconClasses} inline`} />, // icon component
    name: "Reports", // name that appear in Sidebar
    submenu: [
      {
        path: "/app/payin",
        icon: <BanknotesIcon className={submenuIconClasses} />, // icon component
        name: "Payins", // name that appear in Sidebar
      },
      {
        path: "/app/payout",
        icon: <BanknotesIcon className={submenuIconClasses} />, // icon component
        name: "Payouts", // name that appear in Sidebar
      },
    ],
  },
];

export default routes;
