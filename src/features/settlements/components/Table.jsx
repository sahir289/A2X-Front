import { CopyOutlined } from '@ant-design/icons';
import { Button, Input, Switch, Table } from 'antd';
import Column from 'antd/es/table/Column';
import React from 'react';
import { PlusIcon, Reload } from '../../../utils/constants';
import { formatDate } from '../../../utils/utils';

const TableComponent = ({ data, filterValues, setFilterValues }) => {
  console.log("🚀 ~ TableComponent ~ data Settlements:", data)

  const handleCopy = (values) => {
    console.log("🚀 ~ handleCopy ~ values:", values)
    navigator.clipboard.writeText(values);
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const getMerchantCode = (record) => {
    console.log("🚀 ~ getMerchantCode ~ record:", record)
    return record?.Merchant?.code || 'N/A'; // Safely access nested property
  };

  const getBankCode = (record) => {
    console.log("🚀 ~ getBankCode ~ record:", record?.Merchant?.Merchant_Bank)
    return record?.Merchant?.Merchant_Bank[0]?.bankAccount?.bank_name || 'N/A'; // Safely access nested property
  };

  const lastLogIn = (record) => {
    console.log("🚀 ~ lastLogIn ~ lastLogIn:", record?.Merchant)
    return formatDate(record?.Merchant?.updatedAt) || 'N/A'; // Safely access nested property
  };


  const paginationConfig = {
    // current: currentPage,
    // pageSize: pageSize,
    // total: data.totalRecords, // Adjust according to your data structure
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50'],
    // onChange: (page, size) => handleTableChange({ current: page, pageSize: size }),
    // onShowSizeChange: (current, size) => handleTableChange({ current, pageSize: size }),
    showTotal: (total) => `Total ${total} items`,
  };
  return (
    <>
      <div className='font-serif pt-3 flex bg-zinc-50 rounded-lg'>
        <div className=' w-full h-16  pb-3'>
          <p className='pt-4 ps-4 text-xl '>Enquiry Form</p>
        </div>
        <div className='pt-2 flex'>
          <Button className='mr-3 flex  text-white' icon={<PlusIcon />}><p>New Payment Link</p></Button>
          <Button className='mr-5 hover:bg-slate-300' icon={<Reload />} />

        </div>
      </div>
      <Table
        dataSource={data}
        rowKey="id"
        scroll={{
          // y: 240,
          x: "120vw"
        }}
        className='font-serif'
        pagination={paginationConfig}
      >
        <Column
          title={<>
            <span className='whitespace-nowrap'>Account Name</span>
            <br />
            <Input
              value={filterValues?.accountName}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'accountName')}
            />
          </>}
          dataIndex="account_name"
          key="account_name"
          className="bg-white"
          width={"3%"}
        />
        <Column
          title={
            <>
              <span className='whitespace-nowrap'>
                Bank Details
              </span>
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="bank_details"
          key="bank_details"
          className="bg-white"
          width={"3%"}

        />
        <Column
          title={<>
            <span className='whitespace-nowrap'>Account Number</span>
            <br />
            <Input
              value={filterValues?.accountNumber}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'accountNumber')}
            />
          </>}
          dataIndex="account_number"
          key="account_number"
          className="bg-white"
          width={"4%"}
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={handleCopy(text)} /> </>
          )}
        />
        <Column
          title={<>
            Limts
            <br />
            <Input
              disabled
              style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
            />
          </>}
          dataIndex="limmts"
          key="limits"
          className="bg-white"
          width={"4%"}
        />
        <Column
          title={<>
            <span className='whitespace-nowrap'>UPI ID</span>
            <br />
            <Input
              value={filterValues?.upiId}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'upiId')}
            />
          </>}
          dataIndex="upi_id"
          key="upi_id"
          className="bg-white"
          width={"4%"}
        />
        <Column
          title="Balance"
          dataIndex="balance"
          key="balance"
          className="bg-white"
          width={"10%"}
        />
        <Column
          title={
            <>
              <span className='whitespace-nowrap'>
                Allow QR?
              </span>
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="allow_qr"
          key="allow_qr"
          className="bg-white"
          width={"3%"}
        />
        <Column
          title={
            <>
              <span className='whitespace-nowrap'>
                Show Bank
              </span>
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="show_bank"
          key="show_bank"
          className="bg-white"
          width={"5%"}
          render={(text, record) => {
            return (
              <Switch defaultChecked={record?.showBank} />
            )
          }}
        />
        <Column
          title={
            <>
              <span className='whitespace-nowrap'>
                Status
              </span>
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="status"
          key="status"
          className="bg-white"
          width={"2%"}
          render={(_, record) => {
            return (
              <Switch defaultChecked={record?.status} />
            )
          }
          }
        />
        <Column
          title={
            <>
              <span className='whitespace-nowrap'>Last Scheduled at (IST)</span>
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="last_scheduled"
          key="last_scheduled"
          className="bg-white"
          width={"6%"}
          render={(text, record) => lastLogIn(record)}
        />
        <Column
          title={
            <>
              Merchants
              <br />
              <Input
                disabled
                style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
              />
            </>
          }
          dataIndex="merchants"
          key="merchants"
          className="bg-white"
          width={"6%"}
          render={(text, record) => {
            return (
              <span>

              </span>
            )

          }}
        />
      </Table>
    </>
  );
};

export default TableComponent;
