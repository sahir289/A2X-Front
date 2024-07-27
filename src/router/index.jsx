// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const InProgress = lazy(() => import('../pages/protected/deposit/InProgress'))
const Completed = lazy(() => import('../pages/protected/deposit/Completed'))
const Dropped = lazy(() => import('../pages/protected/deposit/Dropped'))
const All = lazy(() => import('../pages/protected/deposit/All'))
const UserRoles = lazy(()=>import('../pages/protected/user/Roles'))
const SettlementsAccounts = lazy(()=>import("../pages/protected/settlements/Accounts"))
const Merchant = lazy(()=>import("../pages/protected/merchant/Merchant"))
const BankAccounts = lazy(()=>import("../pages/protected/bankAccounts/BankAccount"))


const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  },
  {
    path: '/deposit/progress',
    component: InProgress,
  },
  {
    path: '/deposit/completed',
    component: Completed,
  },
  {
    path: '/deposit/dropped',
    component: Dropped,
  },
  {
    path: '/deposit/all',
    component: All,
  },

  // withdrawal
  {
    path: '/withdrawal/progress',
    component: InProgress,
  },
  {
    path: '/withdrawal/completed',
    component: Completed,
  },
  {
    path: '/withdrawal/all',
    component: All,
  },
  //Settlement
  {
    path: '/settlements',
    component: SettlementsAccounts,
  },

  //Merchant
  {
    path: '/merchant',
    component: Merchant,
  },

  //Merchant
  {
    path: '/bank-accounts',
    component: BankAccounts,
  },

  // User
  {
    path: '/user',
    component: UserRoles,
  },


]

export default routes
