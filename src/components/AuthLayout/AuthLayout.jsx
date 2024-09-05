import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { createContext, useState } from 'react';
import {jwtDecode} from 'jwt-decode'


export const PermissionContext = createContext ({
  role: null,
  userName: null,
  userId: null,
  code:null
});
const AuthLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userId,setUserId]=useState('')
  const [userName, setUserName] = useState('')
  const [role, setRole] = useState('')
  const [code,setCode]=useState('')



  // // To change the title.
  const { pathname } = useLocation();
  const token = localStorage.getItem("accessToken");
  
  const path = window.location.pathname;
  useEffect(() => {
    if (token) {
      if (path === "/") {
        navigate("/app/dashboard");
      }
    } else {
      if (
        !(
          path === "/forgot-password" ||
          path === "/reset-password" ||
          path === "/on-boarding"
        )
      ) {
        navigate("/"); //For Verify Email
      }
    }
  }, [pathname]);
useEffect(()=>{
  if (token) {
    try {
      const userData = jwtDecode(token);
      if (userData) {
        setRole(userData?.role);
        setUserId(userData?.id);
        setUserName(userData?.userName);
        setCode(userData?.code)
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      navigate('/');
    }
  }
}, [token])

  const permissionHandle=(userId,userName,role,code)=>{
    setUserId(userId)
    setUserName(userName)
    setRole(role)
    setCode(code)

  }

  return <PermissionContext.Provider
    value={{
      userId,
      userName,
      role,
      code,
      permissionHandle
    }}
  >
    <Outlet />
  </PermissionContext.Provider>;
};

export default AuthLayout



