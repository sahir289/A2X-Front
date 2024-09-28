import { Button, Input, InputNumber, Select, Table, Tag } from "antd";
import Column from "antd/es/table/Column";
import React from "react";
import { Reload } from "../../../utils/constants";
import { formatCurrency } from "../../../utils/utils";
import AddTelegramResponse from "./AddTelegramResponse";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchBanksLoading,
  handleResetSearchFields,
}) => {
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

  return (
    <>
      <div className="font-serif p-3 flex bg-zinc-50 rounded-lg mb-2">
        <AddTelegramResponse handleTableChange={handleTableChange} />
      </div>
      <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
        <div className="flex">
          <div className=" w-full h-12  pb-3">
            <p className="pt-4 ps-4 text-xl "> Response</p>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <Button className="" onClick={handleResetSearchFields}>
              Reset
            </Button>
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
                <InputNumber
                  min={1}
                  className="w-full"
                  value={filterValues?.sno}
                  onChange={(value) => handleFilterValuesChange(value, "sno")}
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
                <InputNumber
                  min={1}
                  className="w-full"
                  value={filterValues?.amount}
                  onChange={(value) =>
                    handleFilterValuesChange(value, "amount")
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
                <span className="whitespace-nowrap">utr</span>
                <br />
                <InputNumber
                  min={1}
                  maxLength={12}
                  className="w-full"
                  value={filterValues?.utr}
                  onChange={(value) => handleFilterValuesChange(value, "utr")}
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
            width={"1%"}
            render={(text) => {
              return (
                <Tag color={text ? "green" : "red"}>{`${
                  text === true ? "Used" : "Un-Used"
                }`}</Tag>
              );
            }}
          />
        </Table>
      </div>
    </>
  );
};

export default TableComponent;
