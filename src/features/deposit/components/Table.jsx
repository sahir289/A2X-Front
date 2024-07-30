import { Button, Input, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import React from 'react';
import { PlusIcon, Reload, Reloader } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/utils';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { CopyOutlined } from '@ant-design/icons';

const TableComponent = ({ data, filterValues, setFilterValues }) => {
  console.log("🚀 ~ TableComponent ~ data:", data)

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
          <p className='pt-4 ps-4 text-xl '>In Progress</p>
        </div>
        <div className='pt-2 flex'>
          <Button className='mr-3 flex bg-green-600 text-white' icon={<PlusIcon />}><p>New Payment Link</p></Button>
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
            <span>Code</span>
            <br />
            <Input
              value={filterValues?.upiShortCode}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'upiShortCode')}
            />
          </>}
          dataIndex="upi_short_code"
          key="upi_short_code"
          className="bg-white"
          width={"3%"}
        />
        <Column
          title={<>
            <span className='mb-2' >Amount</span>
            <br />
            <Input
              // value={filterValues?.amount}
              disabled
              style={{ backgroundColor: "#fafafa", border: 'none', cursor: 'auto' }}
            // onChange={(e) => handleFilterValuesChange(e.target.value, 'amount')}
            />
          </>}
          dataIndex="amount"
          key="amount"
          className="bg-white"
          width={"3%"}
          render={(value) => formatCurrency(value)}

        />
        <Column
          title={<>
            <span>Merchant Order ID</span>
            <br />
            <Input
              value={filterValues?.merchantOrderId}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'merchantOrderId')}
            />
          </>}
          dataIndex="merchant_order_id"
          key="merchant_order_id"
          className="bg-white"
          width={"4%"}
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={handleCopy(text)} /> </>
          )}
        />
        <Column
          title={
            <>
              <span>Merchant Code</span>
              <br />
              <Input
                value={filterValues?.merchantCode}
                onChange={(e) => handleFilterValuesChange(e.target.value, 'merchantCode')}
              />
            </>
          }
          dataIndex="Merchant"
          key="merchant_code"
          className="bg-white"
          width={"4%"}
          render={(text, record) => (
            <>
              {getMerchantCode(record)}
              &nbsp;&nbsp;
              <CopyOutlined
                className='cursor-pointer text-blue-400 hover:text-blue-600'
                onClick={() => handleCopy(getMerchantCode(record))}
              />
            </>
          )}
        />
        <Column
          title={<>
            <span>User ID</span>
            <br />
            <Input
              value={filterValues?.userId}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'userId')}
            />
          </>}
          dataIndex="user_id"
          key="user_id"
          className="bg-white"
          width={"4%"}
        />
        <Column
          title={<>
            <span>UTR</span>
            <br />
            <Input
              value={filterValues?.utr}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'utr')}
            />
          </>}
          dataIndex="utr"
          key="utr"
          className="bg-white"
          width={"4%"}
          render={(text) => text || '--'}
        />
        <Column
          title={<>
            <span>PayIn ID</span>
            <br />
            <Input
              value={filterValues?.payInId}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'payInId')}
            />
          </>}
          dataIndex="id" // Adjust according to actual data structure
          key="id"
          className="bg-white"
          width={"10%"}
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={handleCopy(text)} /> </>
          )}

        />
        <Column
          title={<>
            <span>Dur</span>
            <br />
            <Input
              value={filterValues?.dur}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'dur')}
            />
          </>}
          dataIndex="duration" // Adjust according to actual data structure
          key="duration"
          className="bg-white"
          width={"3%"}
          render={(text) => text || '--'}
        />
        <Column
          title={<>
            <span>Bank</span>
            <br />
            <Input
              value={filterValues?.bank}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'bank')}
            />
          </>}
          dataIndex="Merchant" // Adjust according to actual data structure
          key="bank"
          className="bg-white"
          width={"5%"}
          render={(text, record) => getBankCode(record)}
        />
        <Column
          title={<>
            <span>Status</span>
            <br />
            <Input
              value={filterValues?.status}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'status')}
            />
          </>}
          dataIndex="status"
          key="status"
          className="bg-white"
          width={"2%"}
          render={(value) => {
            console.log("🚀 ~ TableComponent ~ value:", value)
            return (
              <span>
                {<Tag
                  color={value === "ASSIGNED" ? 'blue' : value === "SUCCESS" ? 'green' : '#FF6600'}
                  key={value}
                  icon={value === "ASSIGNED" ? <SyncOutlined spin /> : value === "SUCCESS" ? '' : <ExclamationCircleOutlined />}
                >
                  {value}
                </Tag>}
              </span>
            )

          }
          }
        //
        />
        <Column
          title="Last logged in (IST)"
          dataIndex="Merchant"
          key="Merchant"
          className="bg-white"
          width={"6%"}
          render={(text, record) => lastLogIn(record)}
        />
      </Table>
    </>
  );
};

export default TableComponent;
