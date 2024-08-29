import React, { lazy, Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import initializeApp from "./app/init";
import AuthLayout from "./components/AuthLayout/AuthLayout"; // Adjust the path as necessary
import Layout from "./containers/Layout";
import SuspenseContent from "./containers/SuspenseContent";

const Login = lazy(() => import('./pages/Login'));
const Page404 = lazy(() => import('./pages/protected/404'));

initializeApp();

function App() {
  return (
    <Router>
      <Suspense fallback={<SuspenseContent/>}>
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
