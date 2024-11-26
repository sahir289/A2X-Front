import React, { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import All from "../../../features/lien/all";
import { setPageTitle } from "../../../redux/slice/headerSlice";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const Lien = () => {
  const dispatch = useDispatch();
  const AllowedRoles = ["ADMIN","TRANSACTIONS","OPERATIONS"]
  const context = useContext(PermissionContext)

  useEffect(() => {
    dispatch(setPageTitle({ title: "Lien" }));
  }, []);

  return <>{AllowedRoles?.includes(context.role) && < All />}</>
};

export default Lien;
