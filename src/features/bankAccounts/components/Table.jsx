import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Empty, Input, Switch, Table, Tooltip } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { getApi } from "../../../redux/api";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatCurrency, formatDate } from "../../../utils/utils";
import AddBankAccount from "./AddBankAccount";
import DeleteModal from "./DeleteModal";
import UpdateMerchant from "./UpdateMerchant";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [isAddBankAccountModelOpen, setIsAddBankAccountModelOpen] =
    useState(false);
  const [isDeletePanelOpen, setIsDeletePanelOpen] = useState(false);
  const [isAddMerchantModalOpen, setIsAddMerchantModalOpen] = useState(false);
  const [allMerchants, setAllMerchants] = useState([]);
  const [updateRecord, setUpdateRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const handleCopy = (values) => {
    console.log("🚀 ~ handleCopy ~ values:", values);
    navigator.clipboard.writeText(values);
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const lastLogIn = (record) => {
    console.log("🚀 ~ lastLogIn ~ lastLogIn:", record?.Merchant);
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
    if (merchant.error) {
      return;
    }

    setAllMerchants(merchant?.data?.data?.merchants);
  };

  const deleteBank = async (record) => {
    setIsDeletePanelOpen(true);

    const deleteData = {
      bankAccountId: record?.id,
      merchantId: record?.merchants?.map((merchant) => merchant?.id),
      ac_name: record?.ac_name,
    };

    setDeleteRecord(deleteData);
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Enquiry Form</p>
        </div>
        <div className="pt-2 flex">
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
            className="mr-5 hover:bg-slate-300"
            icon={<Reload />}
            onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
          />
        </div>
      </div>
      <Table
        dataSource={data.bankAccRes}
        rowKey={(item) => item.id}
        scroll={{
          // y: 240,
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
            <>
              {record.name}
              <br />
              {record.ac_no}
              <br />
              {record.ifsc}
            </>
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
              />
            </>
          }
          dataIndex="upi_id"
          key="upi_id"
          className="bg-white"
          width={"4%"}
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
          render={(value) => formatCurrency(value)}
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
          render={(text, record) => {
            return <Switch checked={record?.is_qr} />;
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
          render={(text, record) => {
            return <Switch checked={record?.is_bank} />;
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
          render={(_, record) => {
            return <Switch checked={record?.is_enabled} />;
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
                  title="Edit"
                  onClick={() => showModal(record)}
                />

                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  title="Delete"
                  onClick={() => deleteBank(record)}
                />
              </div>
            );
          }}
        />
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
    </div>
  );
};

export default TableComponent;
