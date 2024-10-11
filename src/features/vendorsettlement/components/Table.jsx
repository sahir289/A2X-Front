import { Table as AntTable } from "antd";
import React from 'react';
import { Columns } from './Columns';

export const statusOptions = [
  "INITIATED",
  "ASSIGNED",
  "SUCCESS",
  "DROPPED",
  "DUPLICATE",
  "REVERSED",
]
  .map(el => ({
    value: el,
    label: el.toLowerCase(),
  }))

export const methodOptions = ["BANK", "CASH", "AED", "CRYPTO"]
  .map(el => ({
    value: el,
    label: el.toLowerCase(),
  }))

export const walletOptions = ["WALLET1", "WALLET2"]
  .map(el => ({
    value: el,
    label: el.toLowerCase(),
  }))

const Table = ({ loading, data, merchantOptions, filters, onFilterChange, updateSettlementStatus, userData}) => {
  return (
    <AntTable
      rowKey="id"
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
    >
      {Columns(merchantOptions, filters, onFilterChange, updateSettlementStatus, userData)}
    </AntTable>
  )
}

export default Table;
