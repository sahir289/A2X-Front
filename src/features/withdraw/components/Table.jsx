import { Table as AntTable } from "antd";
import React from 'react';
import { Columns } from "./Columns";
const Table = ({ loading, data, merchantOptions, filters, onFilterChange, updateWithdraw, type }) => {
  return (
    <AntTable
      rowKey="id"
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
    >
      {Columns(merchantOptions, filters, onFilterChange, updateWithdraw, type)}
    </AntTable>
  )
}

export default Table
