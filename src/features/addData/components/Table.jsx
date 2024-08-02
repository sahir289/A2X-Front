import { Button, Input, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { getApi } from "../../../redux/api";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatDate } from "../../../utils/utils";
import AddTelegramResponse from "./AddTelegramResponse";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);
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
    return formatDate(record?.updatedAt) || "N/A";
  };

  const paginationConfig = {
    current: data?.pagination?.page ?? 1,
    pageSize: data?.pagination?.pageSize ?? 15,
    total: data?.pagination?.total ?? 0,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50"],
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

    try {
      const merchant = await getApi("/getall-merchant", {
        page: 1,
        pageSize: 10000,
      });

      setAllMerchants(merchant?.data?.data?.merchants);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteBank = async (record) => {
    setIsDeletePanelOpen(true);

    const deleteData = {
      bankAccountId: record?.id,
      merchantId: record?.merchant?.map((merchant) => merchant?.id),
      ac_name: record?.ac_name,
    };

    setDeleteRecord(deleteData);
  };

  return (
    <>
      <div className="font-serif pt-3 flex bg-zinc-50 rounded-lg">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Telegram Response</p>
        </div>
        <div className="pt-2 flex">
          <Button
            className="mr-3 flex bg-green-600 text-white"
            icon={<PlusIcon />}
            onClick={() => setIsAddModelOpen(true)}
          >
            <p>New</p>
          </Button>
          <AddTelegramResponse
            isAddModelOpen={isAddModelOpen}
            setIsAddModelOpen={setIsAddModelOpen}
            handleTableChange={handleTableChange}
          />
          <Button
            className="mr-5 hover:bg-slate-300"
            icon={<Reload />}
            onClick={() => handleTableChange({ current: 1, pageSize: 10 })}
          />
        </div>
      </div>
      <Table
        dataSource={data.botRes}
        rowKey={(item) => item.id}
        scroll={{
          // y: 240,
          x: "120vw",
        }}
        className="font-serif"
        loading={isFetchBanksLoading}
        pagination={paginationConfig}
      >
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Status </span>
              <br />
              <Select
                className="flex flex-1"
                onChange={(value) => handleFilterValuesChange(value, "status")}
              >
                <Select.Option value="success">Success</Select.Option>
              </Select>
            </>
          }
          dataIndex="status"
          key="status"
          className="bg-white"
          width={"2%"}
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
              />
            </>
          }
          dataIndex="amount"
          key="amount"
          className="bg-white"
          width={"2%"}
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
              />
            </>
          }
          dataIndex="amount_code"
          key="amount_code"
          className="bg-white"
          width={"2%"}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">utr</span>
              <br />
              <Input
                value={filterValues?.utr}
                onChange={(e) =>
                  handleFilterValuesChange(e.target.value, "utr")
                }
              />
            </>
          }
          dataIndex="utr"
          key="utr"
          className="bg-white"
          width={"2%"}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Used</span>
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
          dataIndex="is_used"
          key="is_used"
          className="bg-white"
          width={"2%"}
          render={(text) => {
            return <Tag color={text ? "green" : "red"}>{`${text}`}</Tag>;
          }}
        />
      </Table>
    </>
  );
};

export default TableComponent;
