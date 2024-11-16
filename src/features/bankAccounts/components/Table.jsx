import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Table,
  Tooltip,
} from "antd";
import Column from "antd/es/table/Column";
import axios from "axios";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { json2csv } from "json-2-csv";
import React, { useContext, useEffect, useState } from "react";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PermissionContext } from "../../../components/AuthLayout/AuthLayout";
import { getApi, postApi, putApi } from "../../../redux/api";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatCurrency, formatDate } from "../../../utils/utils";
import AddBankAccount from "./AddBankAccount";
import DeleteModal from "./DeleteModal";
import UpdateMerchant from "./UpdateMerchant";

dayjs.extend(utc);
dayjs.extend(timezone);

const { RangePicker } = DatePicker;
const rangePresets = [
  {
    label: "Today",
    value: [
      dayjs().tz("Asia/Kolkata").startOf("day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Yesterday",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(1, "day").startOf("day"),
      dayjs().tz("Asia/Kolkata").subtract(1, "day").endOf("day"),
    ],
  },
  {
    label: "Last 7 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(7, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Last 15 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(15, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "Last 30 days",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(30, "day"),
      dayjs().tz("Asia/Kolkata").endOf("day"),
    ],
  },
  {
    label: "This Month",
    value: [
      dayjs().tz("Asia/Kolkata").startOf("month"),
      dayjs().tz("Asia/Kolkata").endOf("month"),
    ],
  },
  {
    label: "Last Month",
    value: [
      dayjs().tz("Asia/Kolkata").subtract(1, "month").startOf("month"),
      dayjs().tz("Asia/Kolkata").subtract(1, "month").endOf("month"),
    ],
  },
];

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
  handleStatusChange,
}) => {
  const dispatch = useDispatch();
  const [isAddBankAccountModelOpen, setIsAddBankAccountModelOpen] =
    useState(false);
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [allMerchants, setAllMerchants] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const vendorOptions = allVendors.map((vendor) => ({
    label: vendor.vendor_code,
    value: vendor.vendor_code,
  }));
  const [updateRecord, setUpdateRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  // Password verification while deleting bank account
  const [verification, setVerification] = useState(false);
  const [downloadReport, setDownloadReport] = useState(false);
  const [bankName, setBankName] = useState();
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const labelCol = { span: 10 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    },
  ];
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().tz("Asia/Kolkata").startOf("day"),
    endDate: dayjs().tz("Asia/Kolkata").endOf("day"),
  });
  const navigate = useNavigate();
  const userData = useContext(PermissionContext);
  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const lastLogIn = (record) => {
    return formatDate(record?.updatedAt) || "N/A"; // Safely access nested property
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

  const showModal = async (record) => {
    setIsAddMerchantModalOpen(true);
    setUpdateRecord(record);
    const merchant = await getApi("/getall-merchant", {
      page: 1,
      pageSize: 10000,
    });
    if (merchant.error?.error?.response?.status === 401) {
      NotificationManager.error(merchant?.error?.message, 401);
      localStorage.clear();
      navigate("/");
    }

    setAllMerchants(merchant?.data?.data?.merchants);
  };

  const deleteBank = async (record) => {
    setVerification(true); // Password verification while deleting bank account

    const deleteData = {
      bankAccountId: record?.id,
      merchantId: record?.merchants?.map((merchant) => merchant?.id),
      ac_name: record?.ac_name,
    };

    setDeleteRecord(deleteData);
  };

  const downloadBankReport = async () => {
    const data = {
      bankName: bankName,
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
    };
    const res = await getApi("/get-bank-message", data);
    const formatSetting = res?.data?.data?.map((record) => ({
      SNO: record.sno || "",
      ID: record.id || "",
      Status: record.status || "",
      Bank: record.bankName || "",
      "Amount Code": record.amount_code || "",
      Amount: record.amount || "",
      UTR: record.utr || "",
      "IS Used": record.is_used || "",
    }));
    try {
      const csv = await json2csv(formatSetting);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.href = url;
      const fileName = `${bankName}-Report-${formatDate(
        Date.now()
      )}`.toLowerCase();
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error converting data to CSV:", error);
    }
  };

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      const startDate = dayjs(dates[0])
        .tz("Asia/Kolkata")
        .startOf("day")
        .toDate();
      const endDate = dayjs(dates[1]).tz("Asia/Kolkata").endOf("day").toDate();
      const newRange = {
        startDate: startDate,
        endDate: endDate,
      };
    }
  };

  // Password verification while deleting bank account
  const handleToggleModal = () => {
    setVerification(!verification);
    form.resetFields();
  };

  const handleReportToggleModal = () => {
    setDownloadReport(!downloadReport);
    form.resetFields();
  };

  const openEditModal = (record) => {
    form.setFieldsValue({
      name: record.name,
      ac_no: record.ac_no,
      ifsc: record.ifsc,
      upi_id: record.upi_id,
      min_payin: record.min_payin,
      max_payin: record.max_payin,
    });
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };
  const verifyPassword = async (data) => {
    setAddLoading(true);
    const verifyPasswordData = {
      userName: userData.userName,
      password: data.password,
    };
    const res = await postApi("/verify-password", verifyPasswordData);
    setAddLoading(false);
    if (res?.data?.statusCode === 200) {
      setIsDeletePanelOpen(true);
      handleToggleModal();
    } else {
      NotificationManager.error(res?.error?.message);
    }
  };

  const handleEditSubmit = async () => {
    setAddLoading(true);
    try {
      const updatedValues = await form.validateFields();
      const updatedData = {
        id: selectedRecord.id,
        name: updatedValues.name,
        ac_no: updatedValues.ac_no,
        ifsc: updatedValues.ifsc,
        upi_id: updatedValues.upi_id,
        min_payin: updatedValues.min_payin,
        max_payin: updatedValues.max_payin,
      };
      const res = await putApi("/update-bank-details", updatedData);
      setAddLoading(false);
      if (res?.data?.statusCode === 200) {
        NotificationManager.success(res?.data?.message);
      }
      setIsEditModalVisible(false);
    } catch (error) {
      console.log("Edit failed:", error);
    }
  };
  //reset filter from search fields
  const handleResetSearchFields = () => {
    setFilterValues({
      ac_name: "",
      ac_no: "",
      upi_id: "",
      bank_used_for: "", // bank used for filtering
      role: `${userData?.role}`,
      vendor_code: `${userData?.vendorCode || ""}`,
      code: `${userData?.code || ""}`,
      startDate: dayjs().add(0, "day").startOf("day"),
      endDate: dayjs().add(0, "day").endOf("day"),
      page: 1,
      pageSize: 20,
    });
  };

  useEffect(() => {
    getAllVendor();
  }, []);

  const getAllVendor = async () => {
    let data = await getApi("/getall-vendor");
    setAllVendors(data.data.data);
  };

  let tableData = data?.bankAccRes?.map((item) => {
    if (item.vendor_code === "null") {
      return { ...item, vendor_code: "" };
    }
    return item;
  });
  const validateIfscCode = async (ifsc) => {
    try {
      const response = await axios.get(`https://ifsc.razorpay.com/${ifsc}`);
      return response.data;
    } catch (error) {
      return null; // If invalid IFSC or error in API request
    }
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Bank Accounts</p>
        </div>
        <div className="pt-2 flex">
          <div>
            <Button
              className="mr-3 flex bg-green-600 hover:!bg-green-600 text-white hover:!text-white"
              icon={<PlusIcon />}
              onClick={() => setIsAddBankAccountModelOpen(true)}
            >
              <p>Add Bank Account</p>
            </Button>
            <AddBankAccount
              isAddBankAccountModelOpen={isAddBankAccountModelOpen}
              setIsAddBankAccountModelOpen={setIsAddBankAccountModelOpen}
              handleTableChange={handleTableChange}
            />
            <Button
              className="mt-2 w-[175px]"
              onClick={handleResetSearchFields}
            >
              Reset
            </Button>
          </div>
          <Button
            className="mr-5 hover:bg-slate-300"
            icon={<Reload />}
            onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
          />
        </div>
      </div>
      <Table
        dataSource={tableData}
        rowKey={(item) => item.id}
        scroll={{
          x: "120vw",
        }}
        className="font-serif px-3"
        loading={isFetchBanksLoading}
        pagination={paginationConfig}
      >
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Account Name</span>
              <br />
              <Input
                value={filterValues?.ac_name}
                onChange={(e) =>
                  handleFilterValuesChange(e.target.value, "ac_name")
                }
                allowClear
              />
            </>
          }
          dataIndex="ac_name"
          key="ac_name"
          className="bg-white"
          width={"3%"}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Bank Details</span>
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="bank_details"
          key="bank_details"
          className="bg-white"
          width={"3%"}
          render={(_, record) => (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                {record.name}
                <br />
                {record.ac_no}
                <br />
                {record.ifsc}
              </div>
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => openEditModal(record)}
              />
            </div>
          )}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Account Number</span>
              <br />
              <Input
                value={filterValues?.ac_no}
                onChange={(e) =>
                  handleFilterValuesChange(e.target.value, "ac_no")
                }
                allowClear
              />
            </>
          }
          dataIndex="ac_no"
          key="ac_no"
          className="bg-white"
          width={"4%"}
          render={(text) => (
            <>
              {text}&nbsp;&nbsp;
              {/* <CopyOutlined
                className="cursor-pointer text-blue-400 hover:text-blue-600"
                onClick={handleCopy(text)}
              />{" "} */}
            </>
          )}
        />
        <Column
          title={
            <>
              Limits
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="limits"
          key="limits"
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
          title={
            <>
              <span className="whitespace-nowrap">UPI ID</span>
              <br />
              <Input
                value={filterValues?.upi_id}
                onChange={(e) =>
                  handleFilterValuesChange(e.target.value, "upi_id")
                }
                allowClear
              />
            </>
          }
          dataIndex="upi_id"
          key="upi_id"
          className="bg-white"
          width={"4%"}
        />
        {/* Column to display useage of bank and it's bank */}
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Bank Used For</span>
              <br />
              <Select
                className="flex"
                value={filterValues?.bank_used_for}
                onChange={(value) =>
                  handleFilterValuesChange(value, "bank_used_for")
                }
                allowClear
              >
                <Select.Option value="">Select</Select.Option>
                <Select.Option value="payIn">PayIn</Select.Option>
                <Select.Option value="payOut">PayOut</Select.Option>
              </Select>
            </>
          }
          dataIndex="bank_used_for"
          key="bank_used_for"
          className="bg-white"
          width={"4%"}
        />
        {/* Add column for vendor filter */}
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Vendors</span>
              <br />
              <Select
                value={filterValues?.vendor_code}
                options={vendorOptions}
                style={{ width: "90%" }}
                onChange={(e) => handleFilterValuesChange(e, "vendor_code")}
                allowClear
              />
            </>
          }
          dataIndex="vendor_code"
          key="vendor_code"
          hidden={filterValues.role !== "ADMIN"}
          className="bg-white"
          width={"10%"}
        />
        <Column
          title={
            <>
              Balance
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="balance"
          key="balance"
          className="bg-white"
          width={"3%"}
          render={(_, record) => {
            let payInBalance = 0;
            let payInBalanceCount = 0;

            record.payInData?.forEach((data) => {
              payInBalance += Number(data?.confirmed);
              payInBalanceCount += 1;
            });

            return (
              <>
                {payInBalance
                  ? formatCurrency(payInBalance)
                  : formatCurrency(0)}
                <br />
                {payInBalanceCount ? `( ${payInBalanceCount} )` : ""}
              </>
            );
          }}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Allow QR?</span>
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="is_qr"
          key="is_qr"
          className="bg-white"
          width={"3%"}
          render={(value, record) => {
            return (
              <Switch
                defaultValue={value}
                onChange={(e) => {
                  handleStatusChange({
                    id: record.id,
                    fieldName: "is_qr",
                    value: e,
                  });
                }}
              />
            );
          }}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Show Bank</span>
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="is_bank"
          key="is_bank"
          className="bg-white"
          width={"5%"}
          render={(value, record) => {
            return (
              <Switch
                defaultValue={value}
                onChange={(e) => {
                  handleStatusChange({
                    id: record.id,
                    fieldName: "is_bank",
                    value: e,
                  });
                }}
              />
            );
          }}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Status</span>
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="is_enabled"
          key="is_enabled"
          className="bg-white"
          width={"2%"}
          render={(value, record) => {
            return (
              <Switch
                defaultValue={value}
                onChange={(e) => {
                  handleStatusChange({
                    id: record.id,
                    fieldName: "is_enabled",
                    value: e,
                  });
                }}
              />
            );
          }}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Last Scheduled at (IST)</span>
              <br />
              <Input
                disabled
                style={{
                  backgroundColor: "#fafafa",
                  border: "none",
                  cursor: "auto",
                }}
              />
            </>
          }
          dataIndex="updatedAt"
          key="updatedAt"
          className="bg-white"
          width={"6%"}
          render={(text, record) => lastLogIn(record)}
        />
        {(userData?.role === "ADMIN" ||
          userData?.role === "TRANSACTIONS" ||
          userData?.role === "OPERATIONS") && (
            <Column
              title={
                <>
                  Merchants
                  <br />
                  <Input
                    disabled
                    style={{
                      backgroundColor: "#fafafa",
                      border: "none",
                      cursor: "auto",
                    }}
                  />
                </>
              }
              dataIndex="merchants"
              key="merchants"
              className="bg-white"
              width={"6%"}
              render={(_, record) => {
                return (
                  <div className="whitespace-nowrap flex gap-2">
                    <Tooltip
                      color="white"
                      placement="bottomRight"
                      title={
                        <div className="flex flex-col gap-1 text-black p-2">
                          <div className="font-bold">Merchant List</div>
                          {(record?.merchants?.length > 0 &&
                            record?.merchants?.map((merchant) => (
                              <p key={merchant?.id}>{merchant?.code}</p>
                            ))) || <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                        </div>
                      }
                    >
                      <Button type="text" icon={<EyeOutlined />} />
                    </Tooltip>

                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      disabled={record?.bank_used_for === "payIn" ? false : true}
                      title="Edit"
                      onClick={() => showModal(record)}
                    />

                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      title="Delete"
                      onClick={() => deleteBank(record)}
                    />

                    <Button
                      type="text"
                      icon={<DownloadOutlined />}
                      title="Download Report"
                      onClick={() => {
                        setDownloadReport(true);
                        setBankName(record.ac_name);
                      }}
                    />
                  </div>
                );
              }}
            />
          )}
      </Table>

      <UpdateMerchant
        record={updateRecord}
        allMerchants={allMerchants}
        isAddMerchantModalOpen={isAddMerchantModalOpen}
        setIsAddMerchantModalOpen={setIsAddMerchantModalOpen}
        handleTableChange={handleTableChange}
      />

      <DeleteModal
        record={deleteRecord}
        isDeletePanelOpen={isDeletePanelOpen}
        setIsDeletePanelOpen={setIsDeletePanelOpen}
        modalTitle="Delete Bank"
        deleteMessage="Are you sure you want to delete this bank account "
        displayItem={`${deleteRecord?.ac_name}?`}
        handleTableChange={handleTableChange}
      />
      <NotificationContainer />

      {/* Password verification Modal */}
      <Modal
        title="Password Verification"
        onCancel={handleToggleModal}
        open={verification}
        footer={false}
      >
        <Form
          form={form}
          className="pt-[10px]"
          labelAlign="left"
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

          <div className="flex justify-end">
            <Button type="primary" loading={addLoading} htmlType="submit">
              Verify
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Edit Bank Details"
        open={isEditModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the bank name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Account Number"
            name="ac_no"
            rules={[
              { required: true, message: "Please enter the account number" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="IFSC Code"
            name="ifsc"
            rules={[
              {
                required: true,
                message: "Please input your IFSC code!",
              },
              {
                validator: async (_, value) => {
                  if (!value) {
                    return Promise.reject("Please input your IFSC code!");
                  }
                  const ifscValidation = await validateIfscCode(value);
                  if (!ifscValidation) {
                    return Promise.reject(
                      "Invalid IFSC Code. Please enter a valid one."
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="UPI ID"
            name="upi_id"
            rules={[
              {
                required: true,
                message: "Please input your UPI ID!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Min Payin"
            name="min_payin"
            rules={[
              {
                required: true,
                message: "Please input your min payin!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Max Payin"
            name="max_payin"
            rules={[
              {
                required: true,
                message: "Please input your max payin!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Download Bank Report"
        onCancel={handleReportToggleModal}
        open={downloadReport}
        footer={false}
      >
        <RangePicker
          className="w-72 h-12"
          defaultValue={[dateRange.startDate, dateRange.endDate]}
          presets={rangePresets}
          onChange={onRangeChange}
          disabledDate={(current) =>
            current && current > new Date().setHours(23, 59, 59, 999)
          }
        />

        <div className="flex justify-end">
          <Button
            type="primary"
            loading={addLoading}
            onClick={downloadBankReport}
            htmlType="submit"
          >
            Download
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TableComponent;
