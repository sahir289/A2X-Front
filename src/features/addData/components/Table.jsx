import { Button, Input, Select, Table, Tag, Modal, Form } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import Column from "antd/es/table/Column";
import React, { useState, useContext } from "react";
import { Reload } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/utils";
import AddTelegramResponse from "./AddTelegramResponse";
import CheckUTR from "./CheckUTR";
import ResetEntry from "./ResetEntry";
import { postApi, putApi } from "../../../redux/api";
import { NotificationManager } from "react-notifications";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [modal, contextHolder] = Modal.useModal();
  const [verification, setVerification] = useState(false);
  const [entryResetData, setEntryResetData] = useState();
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const userData = useContext(PermissionContext)
  const labelCol = { span: 10 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]
  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const paginationConfig = {
    current: data?.pagination?.page ?? 1,
    pageSize: data?.pagination?.pageSize ?? 20,
    total: data?.pagination?.total ?? 0,
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
  //reset search fields
  const handleResetSearchFields = () => {
    setFilterValues({
      loggedInUserRole: userData.role,
      sno: "",
      status: "/success",
      amount: "",
      amount_code: "",
      utr: "",
      bankName:"",
      page: 1,
      pageSize: 20,
    })
  }

  const passwordVerificationModal = async (record) => {
    setVerification(true); //Password verification while edit and delete merchant
    setEntryResetData(record);
  };

  const handleToggleModal = () => {
    setVerification(!verification);
    form.resetFields();
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
      handleEntryReset(entryResetData);
      handleToggleModal();
    }
    else {
      NotificationManager.error(res?.error?.message)
    }
  };

  const handleEntryReset = async (data) => {
    const isReset = await modal.confirm({
      title: "Confirmation",
      type: "confirm",
      content: "Are you sure you want to reset this Entry?",
    });

    const apiData = {
      id: data.id,
    }

    if (isReset) {
      const res = await putApi("/reset-message",apiData);
      if (res.error) {
        NotificationManager.error(res?.error?.message)
      }
      else {
        NotificationManager.success(res?.data?.message);
        handleTableChange({ current: 1, pageSize: 20 });
      }
    }
  }

  return (
    <>
      {contextHolder}
      <div className="font-serif p-3 bg-zinc-50 rounded-lg mb-2">
        <div className="flex">
          <AddTelegramResponse handleTableChange={handleTableChange} />
        </div>
        <div className="flex">
          <CheckUTR handleTableChange={handleTableChange} />
        </div>
        <div className="flex">
          <ResetEntry handleTableChange={handleTableChange} />
        </div>
      </div>
      <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
        <div className="flex">
          <div className=" w-full h-12  pb-3">
            <p className="pt-4 ps-4 text-xl "> Response</p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Button className='' onClick={handleResetSearchFields}>Reset</Button>
            <Button
              className="mr-5 hover:bg-slate-300"
              icon={<Reload />}
              onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
            />
          </div>
        </div>
        <Table
          dataSource={data.botRes}
          rowKey={(item) => item.id}
          scroll={{
            // y: 240,
            x: "70vw",
          }}
          className="font-serif px-3"
          loading={isFetchBanksLoading}
          pagination={paginationConfig}
        >
          <Column
            title={
              <>
                <span className="whitespace-nowrap">SNO</span>
                <br />
                <Input
                  value={filterValues?.sno}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "sno")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="sno"
            key="sno"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Status </span>
                <br />
                <Select
                  className="flex"
                  value={filterValues?.status}
                  onChange={(value) =>
                    handleFilterValuesChange(value, "status")
                  }
                  allowClear
                >
                  <Select.Option value="">Select</Select.Option>
                  <Select.Option value="/success">Success</Select.Option>
                </Select>
              </>
            }
            dataIndex="status"
            key="status"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Amount</span>
                <br />
                <Input
                  value={filterValues?.amount}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "amount")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="amount"
            key="amount"
            className="bg-white"
            width={"1%"}
            render={(text) => formatCurrency(text)}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Amount Code</span>
                <br />
                <Input
                  value={filterValues?.amount_code}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "amount_code")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="amount_code"
            key="amount_code"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">UTR</span>
                <br />
                <Input
                  value={filterValues?.utr}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value.trim(), "utr")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="utr"
            key="utr"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Bank Name</span>
                <br />
                <Input
                  value={filterValues?.bankName}
                  onChange={(e) =>
                    handleFilterValuesChange(e.target.value, "bankName")
                  }
                  allowClear
                />
              </>
            }
            dataIndex="bankName"
            key="bankName"
            className="bg-white"
            width={"1%"}
          />
          <Column
            title={
              <>
                <span className="whitespace-nowrap">Used</span>
                <br />
                <Select
                  className="flex"
                  onChange={(value) =>
                    handleFilterValuesChange(value, "is_used")
                  }
                  allowClear
                >
                  <Select.Option value="Used">Used</Select.Option>
                  <Select.Option value="Unused">Un-Used</Select.Option>
                </Select>
              </>
            }
            dataIndex="is_used"
            key="is_used"
            className="bg-white"
            width={"1%"}
            render={(text) => {
              return <Tag color={text ? "green" : "red"}>{`${text=== true ? "Used" : "Un-Used"}`}</Tag>;
            }}
          />
          <Column
          title="Action"
          hidden={
            filterValues?.loggedInUserRole === "ADMIN"
              ? false
              : true
          }
          className="bg-white"
          width={"1%"}
          render={(text, record) =>
            record.is_used ? (
              <Button
              onClick={() => passwordVerificationModal(record)}
                style={{ marginLeft: "8px" }}
              >
                Reset
              </Button>
            ) : null
          }
        />
        </Table>
      </div>

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
    </>
  );
};

export default TableComponent;
