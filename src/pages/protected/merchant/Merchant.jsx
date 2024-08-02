import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../../redux/slice/headerSlice";
import All from "../../../features/merchants/All";

const Merchant = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "All Data" }));
  }, []);

  return <All />;
};

export default Merchant;
