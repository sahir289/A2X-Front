import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import All from "../../../features/bankAccounts/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const BankAccount = () => {
  const dispatch = useDispatch();
  const AllowedRoles = ["ADMIN"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }));
  }, []);

  return <>
    {AllowedRoles.includes(context.role) &&< All />}
  </>;
};

export default BankAccount;
