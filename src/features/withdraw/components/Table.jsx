import { Table as AntTable, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
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
  setSelectedData,
  selectedData
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const handleCheckboxChange = (row, isChecked) => {
    if (isChecked) {
      setSelectedRowKeys((prev) => [...prev, row.id]);
      setSelectedData((prev) => [...prev, row.id]);

    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key !== row.id));
      setSelectedData((prev) => prev.filter((key) => key !== row.id));
    }
  };

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      setSelectedRowKeys(data.map((row) => row.id));
      setSelectedData(data.map((row) => row.id));
    } else {
      setSelectedRowKeys([]);
      setSelectedData([]);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };
  useEffect(()=>{
    setSelectedRowKeys(selectedData?.length ? selectedData : [])
  },[selectedData])

  return (
    <AntTable
      rowKey={data?.map((data, index) => data?.id || index)}
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
    >
     {!(userData?.role=="VENDOR" || userData?.role=="VENDOR_OPERATIONS"|| userData?.role=="MERCHANT" || userData?.role=="MERCHANT_OPERATIONS")&& <AntTable.Column
        title={<Checkbox onChange={(e) => handleSelectAllChange(e.target.checked)} />}
        dataIndex="id"
        width="80px"
        render={(v, r, i) => {
          if (i) {
            return (
              <Checkbox
                checked={selectedRowKeys.includes(r.id)}
                onChange={(e) => handleCheckboxChange(r, e.target.checked)}
              />
            );
          }
          return null; // Render nothing in the header row
        }}
      />}
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
