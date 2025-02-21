import { Table as AntTable, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { Columns } from "./Columns";
import './Table.css'
const Table = ({
  loading,
  data,
  merchantOptions,
  vendorOptions, // getting options of vendors
  payOutBankOptions, // getting options of payout banks
  filters,
  onFilterChange,
  updateWithdraw,
  type,
  userData,
  setSelectedData,
  setTotalAmount,
  setEKOWithdrawalIDs,
  selectedData,
  selectdatapayout,
  setVerification,
  setSelectedRecord,
  form
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedPayout, setSelectedPayout] = useState([]);
  const handleCheckboxChange = (row, isChecked) => {
    if (isChecked) {
      setSelectedRowKeys((prev) => [...prev, row.id]);
      setSelectedData((prev) => [...prev, row.id]);
      setEKOWithdrawalIDs((prev) => [...prev, row.id]);
      setTotalAmount((prev) => Number(prev) + (Number(row.amount) || 0));

    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== row.id));
      setSelectedData((prev) => prev.filter((key) => key !== row.id));
      setEKOWithdrawalIDs((prev) => prev.filter((key) => key !== row.id));
      setTotalAmount((prev) => Number(prev) - (Number(row.amount) || 0));
    }
  };

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      setSelectedRowKeys(data.filter((row => !(row.vendor_code || row.status === "SUCCESS" || row.status === "REJECTED"))).map((row) => row.id));
      setSelectedData(data.filter((row => !(row.vendor_code || row.status === "SUCCESS" || row.status === "REJECTED"))).map((row) => row.id));
      setEKOWithdrawalIDs(data.filter((row => !(row.vendor_code || row.status === "SUCCESS" || row.status === "REJECTED"))).map((row) => row.id));
      setTotalAmount(data.filter((row => !(row.vendor_code || row.status === "SUCCESS" || row.status === "REJECTED"))).reduce((sum, item) => Number(sum) + (Number(item.amount) || 0), 0));
    } else {
      setSelectedRowKeys([]);
      setSelectedData([]);
      setEKOWithdrawalIDs([]);
      setTotalAmount(0);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };
  useEffect(() => {
    setSelectedRowKeys(selectedData?.length ? selectedData : [])
  }, [selectedData, selectdatapayout])

  return (
    <AntTable
      rowKey={data?.map((data, index) => data?.id || index)}
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
      rowClassName={(record) => (record.vendor_code ? "highlight-row" : "")}
    >
      {!(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS" || userData?.role === "MERCHANT" || userData?.role === "MERCHANT_OPERATIONS" || userData?.role === "MERCHANT_ADMIN") && <AntTable.Column
        title={<Checkbox onChange={(e) => handleSelectAllChange(e.target.checked)} />}
        dataIndex="id"
        width="80px"
        render={(v, r, i) => {
          if (i) {
            if (!(r.vendor_code || r.status === "SUCCESS" || r.status === "REJECTED")) {
              return (
                <Checkbox
                checked={selectedRowKeys.includes(r.id)}
                  onChange={(e) => {
                    handleCheckboxChange(r, e.target.checked);
                  }}
                />
              );
            }
          }
          return null;
        }}
      />}
      {Columns(
        merchantOptions,
        vendorOptions, // sending options of vendors
        payOutBankOptions, // sending options of payout banks
        filters,
        onFilterChange,
        updateWithdraw,
        type,
        userData,
        setVerification,
        setSelectedRecord,
        form
      )}
    </AntTable>
  );
};

export default Table;
