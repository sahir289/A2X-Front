import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon'
import { Tooltip } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Logout } from '../utils/constants'




function Header() {

  const { pageTitle } = useSelector(state => state.header)
  const [userData, setUserData] = useState({ name: " ", role: " " })
  console.log("🚀 ~ Header ~ userData:", userData)



  function logoutUser() {
    localStorage.clear();
    window.location.href = '/'
  }

  useEffect(() => {
    const getUserData = JSON.parse(localStorage.getItem("userData"))
    console.log("🚀 ~ useEffect ~ getUserData:", getUserData)
    setUserData(getUserData)
  }, [])

  return (

    <>
      <div className="navbar sticky top-0 bg-base-100  z-10 shadow-md ">


        {/* Menu toogle for mobile view or small screen */}
        <div className="flex-1">
          <label htmlFor="left-sidebar-drawer" className="btn btn-primary drawer-button lg:hidden">
            <Bars3Icon className="h-5 inline-block w-5" /></label>
          <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1>
        </div>



        <div className="flex-none ">
          <div className="w-10 rounded-full">
            <img src="https://cdn-icons-png.flaticon.com/512/9203/9203764.png" alt="profile" />
          </div>

          <div className='font-serif px-4'>
            <p className='font-semibold'>{userData?.name}</p>
            <p className=' text-sm'>{userData?.role}</p>
          </div>
          <Tooltip title="Logout">
            <span  onClick={logoutUser}>
              <Logout />
            </span>
          </Tooltip>
        </div>
      </div>

    </>
  )
}

export default Header
