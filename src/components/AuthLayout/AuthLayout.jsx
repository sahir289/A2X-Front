import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";


const AuthLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();



  // // To change the title.
  const { pathname } = useLocation();
  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   const check = window.location.pathname.split("/").reverse();
  //   const url = check.filter(
  //     (item) =>
  //       item !== "localhost:3000" && item !== "" && item !== "http:"
  //   );
  //   if (url.length !== 0) {
  //     if (url.length < 3) {
  //       if (url.length < 2) {
  //         document.title = `${
  //           capitalizeFirstLetter(url[0]) + " | " + "SyncTools"
  //         }`;
  //       } else {
  //         document.title = `${
  //           capitalizeFirstLetter(url[0]) +
  //           " | " +
  //           capitalizeFirstLetter(url[1]) +
  //           " | " +
  //           "SyncTools"
  //         }`;
  //       }
  //     } else {
  //       document.title = `${
  //         capitalizeFirstLetter(url[1]) +
  //         " | " +
  //         capitalizeFirstLetter(url[0]) +
  //         " | " +
  //         "SyncTools"
  //       }`;
  //     }
  //   } else {
  //     document.title = `SyncTools`;
  //   }

  //   if (!authpath.includes(path) && !token) {
  //     navigate("/login");
  //   }
  // }, [pathname]);

  const path = window.location.pathname;
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    // const firstLogin = localStorage.getItem("isFirstLogin")
    if (token) {
      if (path === "/login") {
        navigate("/app/dashboard");  // /app/dashboard
      }
    } else {
      if (
        !(
          path === "/forgot-password" ||
          path === "/reset-password" ||
          path === "/on-boarding"
        )
      ) {
        navigate("/login"); //For Verify Email
      }
    }
  }, [pathname]);

  return <Outlet />;
};

export default AuthLayout



