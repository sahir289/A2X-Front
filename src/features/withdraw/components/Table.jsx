import { Table as AntTable } from "antd";
import React from "react";
import { Columns } from "./Columns";
const Table = ({
  loading,
  data,
  merchantOptions,
  filters,
  onFilterChange,
  updateWithdraw,
  type,
  userData,
}) => {
  return (
    <AntTable
      rowKey={data?.map((data, index) => data?.sno || index)}
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
    >
      {Columns(
        merchantOptions,
        filters,
        onFilterChange,
        updateWithdraw,
        type,
        userData
      )}
    </AntTable>
  );
};

export default Table;
