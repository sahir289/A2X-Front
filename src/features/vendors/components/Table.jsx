import { Button, Input, Table } from "antd";
import Column from "antd/es/table/Column";
import React, { useState } from "react";
import { PlusIcon, Reload } from "../../../utils/constants";
import AddVendor from "./AddVendor";
import { formatDate } from "../../../utils/utils";

const TableComponent = ({
  data,
  filterValues,
  setFilterValues,
  isFetchDataLoading,
}) => {
  const [isAddModelOpen, setIsAddModelOpen] = useState(false);

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const lastLogIn = (record) => {
    return formatDate(record?.updatedAt) || "N/A"; // Safely access nested property
  };
  const paginationConfig = {
    current: filterValues?.page ?? 1, 
    pageSize: filterValues?.pageSize ?? 20, 
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
    setFilterValues((prev) => ({
      ...prev,
      page: current,
      pageSize, 
    }));
  };

  return (
    <div className="font-serif pt-3 bg-zinc-50 rounded-lg">
      <div className="flex">
        <div className=" w-full h-16  pb-3">
          <p className="pt-4 ps-4 text-xl ">Vendors</p>
        </div>
        <div className="pt-2 flex">
          <Button
            className="mr-3 flex bg-green-600 hover:!bg-green-600 text-white hover:!text-white"
            icon={<PlusIcon />}
            onClick={() => setIsAddModelOpen(true)}
          >
            <p>Add Vendor</p>
          </Button>
          <AddVendor
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
        dataSource={data}
        rowKey={(item) => item.id}
        scroll={{
          // y: 240,
          x: "70vw",
        }}
        className="font-serif px-3"
        loading={isFetchDataLoading}
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
          dataIndex="id"
          key="id"
          className="bg-white"
          width={"1%"}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Code</span>
              <br />
              <Input
                value={filterValues?.vendor_code}
                onChange={(e) =>
                  handleFilterValuesChange(e.target.value, "vendor_code")
                }
                allowClear
              />
            </>
          }
          dataIndex="vendor_code"
          key="vendor_code"
          className="bg-white"
          width={"1%"}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Vendor Commission</span>
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
          dataIndex="vendor_commission"
          key="vendor_commission"
          className="bg-white"
          width={"1%"}
          render={(text) => {
            return <>{text} %</>;
          }}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Created Date</span>
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
          dataIndex="createdAt"
          key="createdAt"
          className="bg-white"
          width={"1%"}
          render={(text, record) => lastLogIn(record)}
        />
        <Column
          title={
            <>
              <span className="whitespace-nowrap">Created By</span>
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
          dataIndex="createdBy"
          key="createdBy"
          className="bg-white"
          width={"1%"}
        />
      </Table>
    </div>
  );
};

export default TableComponent;
