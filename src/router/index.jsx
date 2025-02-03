// All components mapping with path for internal routes

import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const VendorBoard = lazy(() => import("../pages/protected/VendorBoard"));
const AddData = lazy(() => import("../pages/protected/addData/AddData"));
const Lien = lazy(() => import("../pages/protected/lien/Lien"));
const InProgress = lazy(() => import("../pages/protected/deposit/InProgress"));
const Completed = lazy(() => import("../pages/protected/deposit/Completed"));
const Dropped = lazy(() => import("../pages/protected/deposit/Dropped"));
const All = lazy(() => import("../pages/protected/deposit/All"));
const UserRoles = lazy(() => import("../pages/protected/user/Roles"));
const SettlementsAccounts = lazy(() =>
  import("../pages/protected/settlements/Accounts")
);
const VendorSettlementsAccounts = lazy(() =>
  import("../pages/protected/vendorSettlements/Accounts")
);
const Merchant = lazy(() => import("../pages/protected/merchant/Merchant"));
const Vendor = lazy(() => import("../pages/protected/vendor/Vendor"));
const BankAccounts = lazy(() =>
  import("../pages/protected/bankAccounts/BankAccount")
);
const WithdrawAll = lazy(() => import("../pages/protected/withdraw/All"));
const WithdrawCompleted = lazy(() =>
  import("../pages/protected/withdraw/Completed")
);
const WithdrawInProgress = lazy(() =>
  import("../pages/protected/withdraw/InProgress")
);
const Payin = lazy(() => import("../pages/protected/reports/Payin"));
const Payout = lazy(() => import("../pages/protected/reports/Payout"));
const Report = lazy(() => import("../pages/protected/reports/Report"));
const VendorReport = lazy(() => import("../pages/protected/reports/VendorReport"));
const VendorPayin = lazy(() => import("../pages/protected/reports/VendorPayin"));
const VendorPayout = lazy(() => import("../pages/protected/reports/VendorPayout"));

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/vendor-board",
    component: VendorBoard,
  },
  {
    path: "/add-data",
    component: AddData,
  },

  {
    path: "/deposit/progress",
    component: InProgress,
  },
  {
    path: "/deposit/completed",
    component: Completed,
  },
  {
    path: "/deposit/dropped",
    component: Dropped,
  },
  {
    path: "/deposit/all",
    component: All,
  },

  // withdrawal
  {
    path: "/withdrawal/progress",
    component: WithdrawInProgress,
  },
  {
    path: "/withdrawal/completed",
    component: WithdrawCompleted,
  },
  {
    path: "/withdrawal/all",
    component: WithdrawAll,
  },
  //Settlement
  {
    path: "/settlements",
    component: SettlementsAccounts,
  },
  {
    path: "/vendorsettlements",
    component: VendorSettlementsAccounts,
  },

  // lien
  {
    path: "/lien",
    component: Lien,
  },

  //Merchant
  {
    path: "/merchant",
    component: Merchant,
  },

  //Merchant
  {
    path: "/bank-accounts",
    component: BankAccounts,
  },

  {
    path: "/vendor",
    component: Vendor,
  },

  // User
  {
    path: "/user",
    component: UserRoles,
  },
  {
    path: "/payin",
    component: Payin,
  },
  {
    path: "/vendorpayin",
    component: VendorPayin,
  },
  {
    path: "/payout",
    component: Payout,
  },
  {
    path: "/vendorpayout",
    component: VendorPayout,
  },
  {
    path: "/report",
    component: Report,
  },
  {
    path: "/vendorreport",
    component: VendorReport,
  },
];

export default routes;
