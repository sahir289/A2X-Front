import { Button, Input, Modal, Select, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useState } from 'react';
import { PlusIcon, Reload, Reloader } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/utils';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { CopyOutlined } from '@ant-design/icons';

const TableComponent = ({ data, filterValues, setFilterValues, totalRecords, currentPage, pageSize, tableChangeHandler }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);

  const handleCopy = (values) => {
    navigator.clipboard.writeText(values);
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const getMerchantCode = (record) => {
    return record?.Merchant?.code || 'N/A'; // Safely access nested property
  };

  const getBankCode = (record) => {
    return record?.Merchant?.Merchant_Bank[0]?.bankAccount?.bank_name || 'N/A'; // Safely access nested property
  };

  const lastLogIn = (record) => {
    return formatDate(record?.Merchant?.updatedAt) || 'N/A'; // Safely access nested property
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImageUrl(imageUrl);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedImageUrl(null);
  };

  const paginationConfig = {
    current: currentPage,
    pageSize: pageSize,
    total: totalRecords, // Adjust according to your data structure
    showSizeChanger: true,
    pageSizeOptions: ['20', '50', '100'],
    showTotal: (total) => `Total ${total} items`,
  };


  const statusOptions = [
    { value: '', label: 'Select' },
    { value: 'INITIATED', label: 'INITIATED' },
    { value: 'ASSIGNED', label: 'ASSIGNED' },
    { value: 'SUCCESS', label: 'SUCCESS' },
    { value: 'DROPPED', label: 'DROPPED' },
    { value: 'DUPLICATE', label: 'DUPLICATE' },
    { value: 'DISPUTE', label: 'DISPUTE' },
    { value: 'IMG_PENDING', label: 'IMG_PENDING' },
  ];
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
        onChange={tableChangeHandler}
        dataSource={data}
        rowKey="id"
        scroll={{
          x: "2200px"
        }}
        className='font-serif'
        pagination={paginationConfig}
      >
        <Column
          title={<>
            <span>Sno.</span>
            <br />
            <Input
              value={filterValues?.sno}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'sno')}
            />
          </>}
          dataIndex="sno"
          key="sno"
          className="bg-white"
          width={"24px"}
        />
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
          width={"24px"}
        />
        <Column
          title={<>
            <span className='mb-2' >Amount</span>
            <br />
            <Input
              value={filterValues?.amount}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'amount')}
            />
          </>}
          dataIndex="amount"
          key="amount"
          className="bg-white"
          width={"24px"}
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
          width={"150px"}
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
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
          width={"150px"}
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
          width={"100px"}
        />
        <Column
          title={<>
            <span>User Submitted utr</span>
            <br />
            <Input
              value={filterValues?.userSubmittedUtr}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'userSubmittedUtr')}
            />
          </>}
          dataIndex="user_submitted_utr"
          key="user_submitted_utr"
          className="bg-white"
          width={"124px"}
          render={(text) => text || '--'}
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
          width={"14px"}
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
          width={"304px"}
          render={(text) => (
            <>{text}&nbsp;&nbsp;<CopyOutlined className='cursor-pointer text-blue-400 hover:text-blue-600' onClick={() => handleCopy(text)} /> </>
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
          width={"24px"}
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
          width={"24px"}
          render={(text, record) => getBankCode(record)}
        />
        <Column
          title={<>
            <span>Status</span>
            <br />
            <Select
              value={filterValues?.status}
              onChange={(value) => handleFilterValuesChange(value, 'status')}
              style={{ width: '90%' }}
              options={statusOptions}
            />
          </>}
          dataIndex="status"
          key="status"
          className="bg-white"
          width={"14px"}
          render={(value) => (
            <span>
              <Tag
                color={value === "ASSIGNED" ? 'blue' : value === "SUCCESS" ? 'green' : value === 'INITIATED' ? 'grey' : '#FF6600'}
                key={value}
                icon={value === "ASSIGNED" ? <SyncOutlined spin /> : value === "SUCCESS" ? '' : <ExclamationCircleOutlined />}
              >
                {value}
              </Tag>
            </span>
          )}
        />
        <Column
          title="Last logged in (IST)"
          dataIndex="Merchant"
          key="Merchant"
          className="bg-white"
          width={"24px"}
          render={(text, record) => lastLogIn(record)}
        />
        <Column
          title={<>
            <span>Image</span>
            <br />
            <Input
              disabled
              className='outline-none border-none'
              style={{ backgroundColor: "#fafafa", cursor: 'auto' }}
            />
          </>}
          dataIndex="user_submitted_image"
          key="user_submitted_image"
          className="bg-white"
          width={"24px"}
          render={(imageUrl) => (
            <>
              {imageUrl !== null &&
                <img
                  src={`${process.env.REACT_APP_WS_URL}/${imageUrl}`}
                  alt="thumbnail"
                  className="thumbnail w-10 h-10"
                  onClick={() => handleImageClick(`${process.env.REACT_APP_WS_URL}/${imageUrl}`)}
                />
              }
            </>

          )}
        />
      </Table >


      <Modal open={isModalVisible} footer={null} onCancel={handleModalClose}>
        <img
          src={selectedImageUrl}
          alt="Enlarged"
          style={{ width: '50%' }}
        />
      </Modal>
    </>
  );
};

export default TableComponent;
