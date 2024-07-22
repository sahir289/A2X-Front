// import React, { lazy, useEffect } from "react";
// import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
// import { themeChange } from 'theme-change';
// import initializeApp from "./app/init";
// import Layout from "./containers/Layout";
// import checkAuth from "./app/auth";

// const Login = lazy(() => import('./pages/Login'))

// initializeApp()

// const token = checkAuth()
// console.log("🚀 ~ token:", token)

// function App() {




//   return (
//     <>
//       <Router>
//         <Routes>
//           <Route path="/login" element={<Login />} />

//           {/* Place new routes over this */}
//           <Route path="/app/*" element={<Layout />} />

//           <Route path="*" element={<Navigate to={token ? "/app/dashboard" : "/login"} replace />} />

//         </Routes>
//       </Router>
//     </>
//   )
// }

// export default App;




import React, { lazy, Suspense } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { themeChange } from 'theme-change';
import initializeApp from "./app/init";
import Layout from "./containers/Layout";
import checkAuth from "./app/auth";
import AuthLayout from "./components/AuthLayout/AuthLayout"; // Adjust the path as necessary

const Login = lazy(() => import('./pages/Login'));
const Page404 = lazy(() => import('./pages/protected/404'));

initializeApp();

// const token = checkAuth();
// console.log("🚀 ~ token:", token);

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>

          {/* Authenticated Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path="/app/*" element={<Layout />} />
          </Route>

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
