import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import All from "../../../features/merchants/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";

const Merchant = () => {
  const dispatch = useDispatch();

  const AllowedRoles = ["ADMIN", "TRANSACTIONS", "MERCHANT_ADMIN"]
  const context = useContext(PermissionContext)
  useEffect(() => {
    dispatch(setPageTitle({ title: "Merchant" }));
  }, []);

  return <>{
    AllowedRoles.includes(context.role) && <All />}
  </>;
};

export default Merchant;
