import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import All from "../../../features/addData/All";
import { setPageTitle } from "../../../redux/slice/headerSlice";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const AddData = () => {
  const dispatch = useDispatch();
  const AllowedRoles = ["ADMIN","TRANSACTIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Add Data" }));
  }, []);

  return <>{AllowedRoles?.includes(context.role) && < All />}</>
};

export default AddData;
