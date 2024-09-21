import { Button, Input, Switch, Table } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { formatDate } from "../../../../src/utils/utils.js";
import { PlusIcon, Reload } from "../../../utils/constants.jsx";
import AddUser from "./AddUser.jsx";

const TableComponent = ({
  data,
  isFetchUsersLoading,
  handleUserStatusChange,
  filterValues,
  setFilterValues,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  const handleStatusChange = (e, data) => {
    handleUserStatusChange({ id: data.id, status: e });
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const paginationConfig = {
    current: data?.totalRecords?.page ?? 1,
    pageSize: data?.totalRecords?.pageSize ?? 20,
    total: data?.totalRecords?.total ?? 0,
    showSizeChanger: true,
    pageSizeOptions: ["20", "50", "100"],
    onChange: (page, size) =>
      handleTableChange({ current: page, pageSize: size }),
    onShowSizeChange: (current, size) =>
      handleTableChange({ current, pageSize: size }),
    showTotal: (total) => `Total ${total} items`,
  };

  const handleTableChange = ({ current, pageSize }) => {
    setFilterValues((prev) => ({ ...prev, page: current, pageSize }));
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Admin User List</p>
        </div>
        <div className="pt-2 flex">
          <Button
            className="mr-3 flex bg-green-600 hover:!bg-green-600 text-white hover:!text-white"
            icon={<PlusIcon />}
            onClick={() => setIsAddModelOpen(true)}
          >
            <p>Add Users</p>
          </Button>
          <AddUser
            isAddModelOpen={isAddModelOpen}
            setIsAddModelOpen={setIsAddModelOpen}
            handleTableChange={handleTableChange}
          />
          <Button
            className="mr-5 hover:bg-slate-300"
            icon={<Reload />}
            onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
          />
        </div>
      </div>
      <Table
        dataSource={data?.users}
        rowKey="id"
        className="font-serif px-3"
        loading={isFetchUsersLoading}
        pagination={paginationConfig}
      >
        <Column
          title={
            <>
              <span>AdminUser name</span>
              <br />
              <Input
                value={filterValues.name}
                onChange={(e) => {
                  handleFilterValuesChange(e.target.value, "name");
                }}
              />
            </>
          }
          dataIndex="fullName"
          key="fullName"
          className="bg-white"
          width={"15%"}
        />
        <Column
          title={
            <>
              <span>User Name</span>
              <br />
              <Input
                value={filterValues.userName}
                onChange={(e) => {
                  handleFilterValuesChange(e.target.value, "userName");
                }}
              />
            </>
          }
          dataIndex="userName"
          key="userName"
          className="bg-white"
          width={"10%"}
        />
        <Column
          title={
            <>
              <span>Role</span>
              <br />
              {filterValues.role == "ADMIN" || filterValues.role == "" && <Input
            value={filterValues.role}
            onChange={(e) => { handleFilterValuesChange(e.target.value, 'role') }} />}
            </>
          }
          dataIndex="role"
          key="role"
          className="bg-white"
          width={"10%"}
        />
        <Column
          title="Enabled"
          dataIndex="isEnabled"
          key="isEnabled"
          className="bg-white"
          width={"10%"}
          render={(value, data) => {
            return (
              <Switch
                defaultValue={value}
                onChange={(e) => {
                  handleStatusChange(e, data);
                }}
              />
            );
          }}
        />
        <Column
          title="Last logged in (IST)"
          dataIndex="createdAt"
          key="createdAt"
          className="bg-white"
          width={"10%"}
          render={(value) => formatDate(value)}
        />
      </Table>
    </div>
  );
};

export default TableComponent;
