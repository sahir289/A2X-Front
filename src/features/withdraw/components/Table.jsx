import { Table as AntTable, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { Columns } from "./Columns";
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
  selectedData,
  selectdatapayout,
  setVerification,
  setSelectedRecord,
  form
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  // const [selectedPayout, setSelectedPayout] = useState([]);
  const handleCheckboxChange = (row, isChecked) => {
    const rowData = [row.id, row.amount];

    if (isChecked) {
      setSelectedRowKeys((prev) => [...prev, rowData]);
      setSelectedData((prev) => [...prev, rowData]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((key) => key[0] !== row.id));
      setSelectedData((prev) => prev.filter((key) => key[0] !== row.id));
    }
  };

  const handleSelectAllChange = (isChecked) => {
    if (isChecked) {
      const selectableRows = data
        .filter((row) => !(row.vendor_code || row.status === "SUCCESS" || row.status === "REJECTED") || row.status === "INITIATED")
        .map((row) => [row.id, row.amount]);

      setSelectedRowKeys(selectableRows);
      setSelectedData(selectableRows);
    } else {
      setSelectedRowKeys([]);
      setSelectedData([]);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
  };
  // if(!selectdatapayout){
  //   setSelectedRowKeys([]);
  //   setSelectedData([]);
  // }
  useEffect(()=>{
    setSelectedRowKeys(selectedData?.length ? selectedData : [])
    // console.log(selectedData,"hi from the selected data")
  },[selectedData,selectdatapayout])

  return (
    <AntTable
      rowKey={data?.map((data, index) => data?.id || index)}
      dataSource={[{}, ...(Array.isArray(data) ? data : [])]}
      pagination={false}
      loading={loading}
    >
     {!(userData?.role=="VENDOR" || userData?.role=="VENDOR_OPERATIONS"|| userData?.role=="MERCHANT" || userData?.role=="MERCHANT_OPERATIONS"  || userData?.role=="MERCHANT_ADMIN")&& <AntTable.Column
        title={<Checkbox onChange={(e) => handleSelectAllChange(e.target.checked)} />}
        dataIndex="id"
        width="80px"
        render={(v, r, i) => {
          if (i) {
            if ((!(r.vendor_code || r.status === "SUCCESS" || r.status === "REJECTED"))||(r.status==="INITIATED")) {
              return (
                <Checkbox
                checked={selectedRowKeys.some((item) => item[0] === r.id && item[1] === r.amount)}
                  onChange={(e) => handleCheckboxChange(r, e.target.checked)}
                  />
              );
            }
          }
          return null;
        }}
      />}
      {Columns(
        merchantOptions,
        vendorOptions,
        payOutBankOptions, 
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
