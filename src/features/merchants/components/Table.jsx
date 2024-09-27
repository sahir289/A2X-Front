import { Button, Switch, Table } from "antd";
import { DeleteOutlined, EditOutlined, CopyOutlined } from "@ant-design/icons";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/utils";
import AddMerchant from "./AddMerchant";
import DeleteModal from "./DeleteModal";
import { NotificationManager } from 'react-notifications';
import UpdateMerchant from "./UpdateMerchant";

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

  const deleteMerchantData = async (record) => {
    console.log("Delete Merchant", record);
    setIsDeletePanelOpen(true);

    const deleteData = {
      merchantId: record?.id,
      merchantCode: record?.code,
    };

    setDeleteRecord(deleteData);
  };

  const showModal = async (record) => {
    setUpdateRecord(record);
    setIsAddMerchantModalOpen(true);
  };

  // added handle copy functionality for merchant code and API key column
  const handleCopy = (values) => {
    navigator.clipboard.writeText(values);
    NotificationManager.success("Copied to clipboard")
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
            onClick={() => handleTableChange({ current: 1, pageSize: 20 })}
          />
        </div>
      </div>
      <Table
        dataSource={data?.merchants}
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
          title="Balance"
          dataIndex="balance"
          key="balance"
          className="bg-white"
          width={"4%"}
          render={(value) => formatCurrency(value)}
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
        {/* {(userData?.role === "ADMIN" || userData?.role === "TRANSACTIONS" || userData?.role === "OPERATIONS") && ( */}
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
                    onClick={() => showModal(record)}
                  />

                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    title="Delete"
                    onClick={() => deleteMerchantData(record)}
                  />
                </div>
              );
            }}
          />
        {/* )} */}
      </Table>

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
    </div>
  );
};

export default TableComponent;
