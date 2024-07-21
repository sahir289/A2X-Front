// All components mapping with path for internal routes

import { lazy } from 'react'

const Dashboard = lazy(() => import('../pages/protected/Dashboard'))
const InProgress = lazy(() => import('../pages/protected/deposit/InProgress'))
const Completed = lazy(() => import('../pages/protected/deposit/Completed'))
const Dropped = lazy(() => import('../pages/protected/deposit/Dropped'))
const All = lazy(() => import('../pages/protected/deposit/All'))


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

]

export default routes
