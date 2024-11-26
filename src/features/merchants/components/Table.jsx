import { CaretDownOutlined, CaretRightOutlined, CopyOutlined, DeleteOutlined, EditOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Form, Input, Modal, Switch, Table, Select } from "antd";
import Column from "antd/es/table/Column";
import React, { useContext, useState } from "react";
import { NotificationManager } from 'react-notifications';
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { postApi } from "../../../redux/api";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/utils";
import AddMerchant from "./AddMerchant";
import DeleteModal from "./DeleteModal";
import UpdateMerchant from "./UpdateMerchant";
import { useSelector } from "react-redux";
import { formatDate } from "../../../utils/utils";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState();
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false);
  const [updateRecord, setUpdateRecord] = useState(null);
  // Password verification while edit and delete merchant
  const [verification, setVerification] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [actionValue, setActionValue] = useState();
  const [form] = Form.useForm();
  const userData = useContext(PermissionContext)
  const labelCol = { span: 10 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]

  const paginationConfig = {
    current: data?.pagination?.page ?? 1,
    pageSize: data?.pagination?.pageSize ?? 100,
    total: data?.pagination?.total ?? 0,
    showSizeChanger: true,
    pageSizeOptions: ["100"],
    onChange: (page, size) =>
      handleTableChange({ current: page, pageSize: size }),
    onShowSizeChange: (current, size) =>
      handleTableChange({ current, pageSize: size }),
    showTotal: (total) => `Total ${total} items`,
  };

  const merchantData = useSelector((state) => state.merchant.data);
  const merchantOptions = merchantData
    ?.filter(
        (merchant) =>
            (!merchant.is_deleted && !userData?.code?.length) ||
            userData?.code.includes(merchant.code)
    )
    .map((merchant) => ({
        label: merchant.code,
        value: merchant.code,
    }))
    .sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by the label


  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleTableChange = ({ current, pageSize }) => {
    setFilterValues((prev) => ({ ...prev, page: current, pageSize }));
  };

  const deleteMerchantData = async (record) => {
    setVerification(true); //Password verification while edit and delete merchant

    const deleteData = {
      merchantId: record?.id,
      merchantCode: record?.code,
    };

    setDeleteRecord(deleteData);
  };

  const showModal = async (record) => {
    setVerification(true); //Password verification while edit and delete merchant
    setUpdateRecord(record);
  };

  // added handle copy functionality for merchant code and API key column
  const handleCopy = (values) => {
    navigator.clipboard.writeText(values);
    NotificationManager.success("Copied to clipboard")
  };

  //Password verification while edit and delete merchant
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
      if (actionValue === "DELETE") {
        setIsDeletePanelOpen(true);
      } else if (actionValue === "UPDATE") {
        setIsAddMerchantModalOpen(true);
      }
      handleToggleModal();
    }
    else {
      NotificationManager.error(res?.error?.message)
    }
  };

  const rowClassName = (record) => {
    if (record.is_deleted) {
      return 'ant-table-row-disabled';
    }

    return '';
  };

  const rowStyles = (record) => {
    if (record.is_deleted) {
      return {
        opacity: 0.5,           // Grayed out appearance
        pointerEvents: 'none',  // Disable user interaction
        backgroundColor: '#f5f5f5', // Light gray background
      };
    }

    return {}; // Default styles
  };

  const createdAT = (record) => {
    return formatDate(record?.createdAt) || "N/A"; // Safely access nested property
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Merchants</p>
        </div>
        <div className="pt-2 flex">
          <Button
            className="mr-3 flex bg-green-600 hover:!bg-green-600 text-white hover:!text-white"
            icon={<PlusIcon />}
            onClick={() => setIsAddModelOpen(true)}
          >
            <p>Add Merchant</p>
          </Button>
          <AddMerchant
            isAddModelOpen={isAddModelOpen}
            setIsAddModelOpen={setIsAddModelOpen}
            handleTableChange={handleTableChange}
          />
          <Button
            className="mr-5 hover:bg-slate-300"
            icon={<Reload />}
            onClick={() => handleTableChange({ current: 1, pageSize: 100 })}
          />
        </div>
      </div>

      <Table
        dataSource={data?.transformedData}
        rowKey={(item) => item.id}
        scroll={{
          x: "80vw",
        }}
        rowClassName={(record) => rowClassName(record)}
        onRow={(record) => ({
          style: rowStyles(record),
        })}
        className="font-serif px-3 "
        loading={isFetchBanksLoading}
        pagination={paginationConfig}
        expandable={{
          columnTitle: "Sub Merchant",
          columnWidth: "10px",
          indentSize: 2,
          rowExpandable: (record) => record.is_merchant_Admin === true && record.childrenData?.length > 0,
          expandedRowRender: (record) => {
            return (
              <>
                <Table
                  dataSource={record.childrenData}
                  rowKey="id"
                  pagination={false}
                  scroll={{
                    x: "80vw",
                  }}
                  bordered
                  className="mb-10 mt-5"
                >
                  <Column
                    title="Code"
                    dataIndex="code"
                    key="code"
                    className="bg-white"
                    width={"1%"}
                    // added copy button
                    render={(text) => (
                      <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
                    )}
                  />
                  <Column
                    title="Site"
                    dataIndex="site_url"
                    key="site_url"
                    className="bg-white"
                    width={"3%"}
                  />
                  <Column
                    title="API Key"
                    dataIndex="api_key"
                    key="api_key"
                    className="bg-white"
                    width={"12%"}
                    // added copy button
                    render={(text) => (
                      <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
                    )}
                  />
                  <Column
                    title="Public API Key"
                    dataIndex="public_api_key"
                    key="public_api_key"
                    className="bg-white"
                    width={"12%"}
                    // added copy button
                    render={(text) => (
                      <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
                    )}
                  />
                  <Column
                    title="Balance"
                    dataIndex="balance"
                    key="balance"
                    className="bg-white"
                    width={"4%"}
                    render={(_, record) => {
                      return formatCurrency(record?.balance)
                    }}
                  />
                  <Column
                    title="Payin"
                    dataIndex="payin"
                    key="payin"
                    className="bg-white"
                    width={"4%"}
                    render={(text, record) => {
                      return (
                        <>
                          {formatCurrency(record?.min_payin)} -{" "}
                          {formatCurrency(record?.max_payin)}
                        </>
                      );
                    }}
                  />
                  <Column
                    title="Payin Commission"
                    dataIndex="payin_commission"
                    key="payin_commission"
                    className="bg-white"
                    width={"2%"}
                    render={(text) => {
                      return <>{text} %</>;
                    }}
                  />
                  <Column
                    title="Max Payout"
                    dataIndex="max_payout"
                    key="max_payout"
                    className="bg-white"
                    width={"3%"}
                    render={(text, record) => {
                      return (
                        <>
                          {formatCurrency(record?.min_payout)} -{" "}
                          {formatCurrency(record?.max_payout)}
                        </>
                      );
                    }}
                  />
                  <Column
                    title="Payout Commission"
                    dataIndex="payout_commission"
                    key="payout_commission"
                    className="bg-white"
                    width={"2%"}
                    render={(text) => {
                      return <>{text} %</>;
                    }}
                  />
                  <Column
                    title="Test mode?"
                    dataIndex="is_test_mode"
                    key="is_test_mode"
                    className="bg-white"
                    width={"2%"}
                    render={(_, record) => {
                      return <Switch checked={record?.is_test_mode} />;
                    }}
                  />
                  <Column
                    title="Created at (IST)"
                    dataIndex="Merchant"
                    key="Merchant"
                    className="bg-white"
                    width={"24px"}
                    render={(text, record) => createdAT(record)}
                  />
                  <Column
                    title={
                      <>
                        Actions
                      </>
                    }
                    dataIndex="merchants"
                    key="merchants"
                    className="bg-white"
                    width={"6%"}
                    render={(_, record) => {
                      return (
                        <div className="whitespace-nowrap flex gap-2">
                          <Button
                            type="text"
                            icon={<EditOutlined />}
                            title="Edit"
                            onClick={() => { setActionValue("UPDATE"); showModal(record) }} // Password verification while edit and delete merchant
                          />

                          <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            title="Delete"
                            onClick={() => { setActionValue("DELETE"); deleteMerchantData(record) }} // Password verification while edit and delete merchant
                          />
                        </div>
                      );
                    }}
                  />

                </Table>
              </>
            );
          },

          expandIcon: ({ onExpand, expanded, record }) => {
            if (!record.is_merchant_Admin || !record.childrenData?.length) return null;
            return (
              <div
                onClick={e => {
                  e.stopPropagation();
                  onExpand(record);
                }}
                className="expand-icon cursor-pointer"
              >
                {expanded ? <CaretDownOutlined /> : <CaretRightOutlined />}
              </div>
            );
          },
        }}

      >
        <Column
          title={
            <>
              <span>Code</span>
              <br />
              <Select
                value={filterValues?.merchantCode}
                showSearch
                options={merchantOptions}
                className="flex"
                onChange={(value) =>
                  handleFilterValuesChange(value, "code")
                }
                allowClear
              />
            </>
          }
          dataIndex="code"
          key="code"
          className="bg-white"
          width={"1%"}
          // added copy button
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
          )}
        />
        <Column
          title="Site"
          dataIndex="site_url"
          key="site_url"
          className="bg-white"
          width={"3%"}
        />
        <Column
          title="API Key"
          dataIndex="api_key"
          key="api_key"
          className="bg-white"
          width={"12%"}
          // added copy button
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
          )}
        />
        <Column
          title="Public API Key"
          dataIndex="public_api_key"
          key="public_api_key"
          className="bg-white"
          width={"12%"}
          // added copy button
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
          )}
        />
        <Column
          title="Balance"
          dataIndex="balance"
          key="balance"
          className="bg-white"
          width={"4%"}
          render={(_, record) => {
            return formatCurrency(record?.balance)
          }}
        />
        <Column
          title="Payin"
          dataIndex="payin"
          key="payin"
          className="bg-white"
          width={"4%"}
          render={(text, record) => {
            return (
              <>
                {formatCurrency(record?.min_payin)} -{" "}
                {formatCurrency(record?.max_payin)}
              </>
            );
          }}
        />
        <Column
          title="Payin Commission"
          dataIndex="payin_commission"
          key="payin_commission"
          className="bg-white"
          width={"2%"}
          render={(text) => {
            return <>{text} %</>;
          }}
        />
        <Column
          title="Max Payout"
          dataIndex="max_payout"
          key="max_payout"
          className="bg-white"
          width={"3%"}
          render={(text, record) => {
            return (
              <>
                {formatCurrency(record?.min_payout)} -{" "}
                {formatCurrency(record?.max_payout)}
              </>
            );
          }}
        />
        <Column
          title="Payout Commission"
          dataIndex="payout_commission"
          key="payout_commission"
          className="bg-white"
          width={"2%"}
          render={(text) => {
            return <>{text} %</>;
          }}
        />
        <Column
          title="Test mode?"
          dataIndex="is_test_mode"
          key="is_test_mode"
          className="bg-white"
          width={"2%"}
          render={(_, record) => {
            return <Switch checked={record?.is_test_mode} />;
          }}
        />
        <Column
          title="Created at (IST)"
          dataIndex="Merchant"
          key="Merchant"
          className="bg-white"
          width={"24px"}
          render={(text, record) => createdAT(record)}
        />
        <Column
          title={
            <>
              Actions
            </>
          }
          dataIndex="merchants"
          key="merchants"
          className="bg-white"
          width={"6%"}
          render={(_, record) => {
            return (
              <div className="whitespace-nowrap flex gap-2">
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  title="Edit"
                  onClick={() => { setActionValue("UPDATE"); showModal(record) }} // Password verification while edit and delete merchant
                />

                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  title="Delete"
                  onClick={() => { setActionValue("DELETE"); deleteMerchantData(record) }} // Password verification while edit and delete merchant
                />
              </div>
            );
          }}
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

      <UpdateMerchant
        record={updateRecord}
        isAddMerchantModalOpen={isAddMerchantModalOpen}
        setIsAddMerchantModalOpen={setIsAddMerchantModalOpen}
        handleTableChange={handleTableChange}
      />

      <DeleteModal
        record={deleteRecord}
        isDeletePanelOpen={isDeletePanelOpen}
        setIsDeletePanelOpen={setIsDeletePanelOpen}
        modalTitle="Delete Merchant"
        deleteMessage="Are you sure you want to delete this merchant "
        displayItem={`${deleteRecord?.merchantCode}?`}
        handleTableChange={handleTableChange}
      />
    </div >
  );
};

export default TableComponent;
