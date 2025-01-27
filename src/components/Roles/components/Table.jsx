import { Button, Input, Switch, Table, Modal, Form } from "antd";
import { EyeTwoTone, EyeInvisibleOutlined } from "@ant-design/icons";
import Column from "antd/es/table/Column";
import React, { useState, useContext } from "react";
import { formatDate } from "../../../../src/utils/utils.js";
import { PlusIcon, Reload } from "../../../utils/constants.jsx";
import AddUser from "./AddUser.jsx";
import { PermissionContext } from "../../AuthLayout/AuthLayout.jsx";
import { postApi } from "../../../redux/api.jsx";
import { NotificationManager } from "react-notifications";

const TableComponent = ({
  data,
  isFetchUsersLoading,
  handleUserStatusChange,
  filterValues,
  setFilterValues,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  // Password verification while enabling or disabling users
  const [verification, setVerification] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [dataId, setId] = useState();
  const [dataStatus, setStatus] = useState();
  const userData = useContext(PermissionContext)
  const [form] = Form.useForm();
  const labelCol = { span: 10 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]

  const handleStatusChange = (e, data) => {
    setId(data.id);
    setStatus(e);
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const paginationConfig = {
    current: filterValues?.page ?? 1,
    pageSize: filterValues?.pageSize ?? 20,
    total: data?.totalRecords ?? 0,
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

  let text = `${filterValues.userRole}`;
  let convertedText = text.charAt(0) + text.slice(1).toLowerCase();
  const title = text !== "ADMIN" ? `${convertedText} User List` : "User List"; //Showing different user list Name while user is logged in from different roles
  const titleBoxName = `${convertedText}User Name`;

  // Password verification while enabling or disabling users
  const handleToggleModal = () => {
    setVerification(!verification);
    form.resetFields();
    handleTableChange({ current: 1, pageSize: 20 })
  };

  const verifyPassword = async (data) => {
    setAddLoading(true)
    const verifyPasswordData = {
      userName: userData.userName,
      password: data.password,
    }
    const res = await postApi("/verify-password", verifyPasswordData);
    setAddLoading(false)
    if (res?.data?.statusCode === 200) {
      handleUserStatusChange({ id: dataId, status: dataStatus });
      handleToggleModal();
    }
    else {
      NotificationManager.error(res?.error?.message)
    }
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">{title}</p>
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
              <span>{titleBoxName}</span>
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
              {filterValues.userRole == "ADMIN" &&
                <Input
                  value={filterValues.role}
                  onChange={(e) => { handleFilterValuesChange(e.target.value, 'role') }}
                />
              }
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
                checked={value}
                onChange={(e) => {
                  setVerification(true); // Password verification while enabling or disabling users
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

      {/* Password verification Modal */}
      <Modal
        title="Password Verification"
        onCancel={handleToggleModal}
        open={verification}
        footer={false}>
        <Form
          form={form}
          className='pt-[10px]'
          labelAlign='left'
          labelCol={labelCol}
          onFinish={verifyPassword}
        >
          <Form.Item
            name="password"
            label="Enter your password"
            rules={RequiredRule}
          >
            <Input.Password
              type="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className='flex justify-end'>
            <Button type='primary'
              loading={addLoading}
              htmlType='submit'
            >
              Verify
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TableComponent;
