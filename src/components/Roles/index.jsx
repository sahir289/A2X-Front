import React, { useContext, useEffect, useState } from "react";
import { getApi, putApi } from "../../redux/api";
import TableComponent from "./components/Table";
import { PermissionContext } from "../AuthLayout/AuthLayout";

const RolesComponent = () => {
  const [tableData, setTableData] = useState([]);
  const context = useContext(PermissionContext)
  const [filterValues, setFilterValues] = useState({
    name: "",
    userName: "",
    role: context?.role == 'ADMIN' ? "" : `${context?.role}`,
    userRole: `${context?.role}`,
    createdBy:`${context?.userId}`,
    page: 1,
    pageSize: 20,
  });
  const [isFetchUsersLoading, setIsFetchUsersLoading] = useState(false);

  useEffect(() => {
    fetchUsersData();
  }, [filterValues]);

  const fetchUsersData = async () => {
    setIsFetchUsersLoading(true);
    const usersApiRes = await getApi("/getall-users", filterValues);
    setIsFetchUsersLoading(false);
    if (usersApiRes.error) {
      return;
    }
    setTableData(usersApiRes?.data?.data);
  };

  const handleUserStatusChange = async (data) => {
    setIsFetchUsersLoading(true);
    const usersApiRes = await putApi("/update-status", {
      id: data.id,
      status: data.status,
    });
    setIsFetchUsersLoading(false);
    if (usersApiRes.error) {
      return;
    }
    fetchUsersData();
  };
  return (
    <div className="">
      <TableComponent
        data={tableData}
        handleUserStatusChange={handleUserStatusChange}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        isFetchUsersLoading={isFetchUsersLoading}
      />
    </div>
  );
};

export default RolesComponent;
