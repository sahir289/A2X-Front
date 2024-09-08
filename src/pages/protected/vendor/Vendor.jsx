import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import All from "../../../features/vendors/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";

const Vendor = () => {
  const dispatch = useDispatch();

  const AllowedRoles = ["ADMIN","TRANSACTIONS"];
  const context = useContext(PermissionContext);

  useEffect(() => {
    dispatch(setPageTitle({ title: "Vendor" }));
  }, []);

  return <>{AllowedRoles.includes(context.role) && <All />}</>;
};

export default Vendor;
