import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../redux/slice/headerSlice";
import All from "../../../features/merchants/All";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const Merchant = () => {
  const dispatch = useDispatch();

  const AllowedRoles = ["ADMIN"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }));
  }, []);

  return <>{
    AllowedRoles.includes(context.role) && <All />}
  </>;
};

export default Merchant;
