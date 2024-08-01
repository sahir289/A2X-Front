import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import All from "../../../features/bankAccounts/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";

const BankAccount = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }));
  }, []);

  return <All />;
};

export default BankAccount;
