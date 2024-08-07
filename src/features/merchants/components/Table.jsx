import { Button, Switch, Table } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { PlusIcon, Reload } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/utils";
import AddMerchant from "./AddMerchant";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

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
        dataSource={data.merchants}
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
      </Table>
    </div>
  );
};

export default TableComponent;
