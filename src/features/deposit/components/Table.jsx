import { CopyOutlined, ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Button, Form, Input, Modal, Select, Switch, Table, Tag } from 'antd';
import Column from 'antd/es/table/Column';
import React, { useContext, useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { getApi, postApi } from '../../../redux/api';
import { PlusIcon, Reload } from '../../../utils/constants';
import { formatCurrency, formatDate } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { PermissionContext } from '../../../components/AuthLayout/AuthLayout';




const TableComponent = ({ data, filterValues, setFilterValues, totalRecords, currentPage, pageSize, tableChangeHandler, allTable, completedTable, inProgressTable, fetchUsersData, isFetchUsersLoading }) => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [open, setOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [form] = Form.useForm();
  const [paymentUrlModal, setPaymentUrlModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('')
  const navigate = useNavigate()


  const userData = useContext(PermissionContext)
  console.log("🚀 ~ TableComponent ~ userData:", userData)
  const handleCopy = (values) => {
    navigator.clipboard.writeText(values);
    NotificationManager.success("Copied to clipboard")
  };

  const handleFilterValuesChange = (value, fieldName) => {
    setFilterValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const getMerchantCode = (record) => {
    return record?.Merchant?.code || 'N/A'; // Safely access nested property
  };

  const getBankCode = (record) => {
    return 'N/A'; // Safely access nested property
  };

  const lastLogIn = (record) => {
    return formatDate(record?.Merchant?.updatedAt) || 'N/A'; // Safely access nested property
  };

  const handleImageClick = (imageUrl, record) => {
    setSelectedImageUrl(imageUrl);
    setSelectedRecord(record); // Store the selected record data
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedImageUrl(null);
    form.resetFields()
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
    { value: 'PENDING', label: 'PENDING' },
    { value: 'IMG_PENDING', label: 'IMG_PENDING' },
  ];

  const handleUtrSubmit = async (values) => {
    const data = {
      usrSubmittedUtr: values?.utrNumber,
      code: selectedRecord?.upi_short_code,
      amount: selectedRecord?.amount,
      isFront: true,
      filePath: selectedRecord?.user_submitted_image
    }
    const utrRes = await postApi(`/process/${selectedRecord?.id}`, data)
      .finally(() => {
        setIsModalVisible(false);
        form.resetFields()
      })
  }

  const handleToggleModal = () => {
    setOpen(!open);
    form.resetFields();
  };

  const handleGetMerchants = async () => {
    const res = await getApi("/getall-merchant");
    if (res.error?.error?.response?.status === 401) {
      NotificationManager.error(res?.error?.message, 401);
      localStorage.clear();
      navigate('/')
    }

    setMerchants(res.data?.data?.merchants || []);
  }

  useEffect(() => {
    handleGetMerchants();
  }, []);

  const merchantOptions = merchants
    ?.filter(merchant => !userData?.code?.length || userData?.code?.includes(merchant?.code))
    .map(merchant => ({
      label: merchant.code,
      value: merchant.code,
    }));


  const labelCol = { span: 10 };
  const RequiredRule = [
    {
      required: true,
      message: "${label} is Required!",
    }
  ]

  const handleSubmit = (data) => {
    setAddLoading(true)
    if (data?.paymentLink === undefined || data?.paymentLink === false) {
      const unlimitedUrl = `${process.env.REACT_APP_BASE_URL}/payIn?code=${data?.code}&user_id=${data?.userId}&ot=n`

      setPaymentUrl(unlimitedUrl)
      handleToggleModal()
      setPaymentUrlModal(true);
      handleCopy(unlimitedUrl)
      setAddLoading(false)
      // const oneTimeUrlRes = getApi(`/payIn?code=${data?.code}&user_id=${data?.userId}&ot=n`).then((res) => {
      //   if (res?.data?.data) {
      //     setPaymentUrl(res?.data?.data?.payInUrl)
      //     console.log("🚀 ~ oneTimeUrlRes ~ res:", res)
      //     handleToggleModal()
      //     setPaymentUrlModal(true);
      //     handleCopy(res?.data?.data?.payInUrl)
      //   }
      //   else {
      //     NotificationManager.error(res?.error?.message || "Some thing went wrong")
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })

    } else {

      const oneTimeUrlRes = getApi(`/payIn?code=${data?.code}&user_id=${data?.userId}&ot=y`).then((res) => {
        if (res?.data?.data) {
          setPaymentUrl(res?.data?.data?.payInUrl)
          console.log("🚀 ~ oneTimeUrlRes ~ res:", res)
          handleToggleModal()
          setPaymentUrlModal(true);
          handleCopy(res?.data?.data?.payInUrl)
        }
        else {
          NotificationManager.error(res?.error?.message || "Some thing went wrong")
        }
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        setAddLoading(false)
      })
    }

  }

  const handleCancel = () => {
    setPaymentUrlModal(false)
  }
  //reset search fields
  const handleResetSearchFields = () => {
    setFilterValues({ status: allTable ? '' : filterValues?.status || '' });
  }

  console.log("🚀 ~ TableComponent ~ process.env.REACT_S3_URL:", process.env.REACT_APP_S3_URL)


  return (
    <>
      <div className='font-serif pt-3 flex bg-zinc-50 rounded-lg'>
        <div className='w-full h-16 pb-3'>
          <p className='pt-4 ps-4 text-xl'>
            {allTable === true ? "All" : completedTable === true ? "Confirmed" : inProgressTable === true ? "In Progress" : "Dropped"}
          </p>
        </div>

        <div className='pt-2 flex items-start'>
          <div className={`flex flex-col ${!(allTable || inProgressTable) ? 'mr-2' : ''}`}>
            <>
              {!(userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS") &&
                (allTable === true || inProgressTable === true) && (
                  <Button
                    className="mr-3 mb-2 flex bg-green-600 hover:!bg-green-600 text-white hover:!text-white"
                    icon={<PlusIcon />}
                    onClick={handleToggleModal}
                  >
                    <p>New Payment Link</p>
                  </Button>
                )}
              <Button
                className={`${userData?.role === "VENDOR" || userData?.role === "VENDOR_OPERATIONS"
                    ? `w-[80px] ${(allTable || inProgressTable) && 'mr-2'}`
                    : `${!(allTable || inProgressTable) ? 'w-full' : 'w-[178px]'}`
                  }`}
                onClick={handleResetSearchFields}
              >Reset</Button>
            </>
          </div>

          <Button
            className={'mr-5 hover:bg-slate-300'}

            icon={<Reload />} onClick={fetchUsersData} />
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
        loading={isFetchUsersLoading}
      >
        <Column
          title={<>
            <span>Sno.</span>
            <br />
            <Input
              value={filterValues?.sno}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'sno')}
              allowClear
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
              allowClear
            />
          </>}
          dataIndex="upi_short_code"
          key="upi_short_code"
          className="bg-white"
          width={"24px"}
        />
        <Column
          title={<>
            <span className='mb-2' >Confirmed</span>
            <br />
            <Input
              value={filterValues?.confirmed}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'confirmed')}
              allowClear
            />
          </>}
          dataIndex="confirmed"
          key="confirmed"
          className="bg-white"
          width={"24px"}
          render={(value) => formatCurrency(value)}
        />
        {completedTable === true &&
          <Column
            title={<>
              <span className='mb-2' >Commission</span>
              <br />
              <Input
                disabled
                className='outline-none border-none'
                style={{ backgroundColor: "#fafafa", cursor: 'auto' }}
                allowClear
              />
            </>}
            dataIndex="payin_commission"
            key="payin_commission"
            className="bg-white"
            width={"24px"}
            render={(value) => formatCurrency(value)}
          />}

        <Column
          title={<>
            <span className='mb-2' >Amount</span>
            <br />
            <Input
              value={filterValues?.amount}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'amount')}
              allowClear
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
            <span>Status</span>
            <br />
            <Select
              value={filterValues?.status}
              onChange={(value) => handleFilterValuesChange(value, 'status')}
              style={{ width: '90%' }}
              options={statusOptions}
              disabled={allTable === true ? false : true}
              allowClear
            />
          </>}
          dataIndex="status"
          key="status"
          className="bg-white"
          width={"14px"}
          render={(value) => (
            <span>
              <Tag
                color={value === "ASSIGNED" ? 'blue' : value === "SUCCESS" ? 'green' : value === 'INITIATED' ? 'grey' : value === "PENDING" ? "yellow" : value === "DROPPED" ? "red" : '#FF6600'}
                key={value}
                icon={value === "ASSIGNED" ? <SyncOutlined spin /> : value === "SUCCESS" ? '' : <ExclamationCircleOutlined />}
              >
                {value}
              </Tag>
            </span>
          )}
        />
        <Column
          title={<>
            <span>Merchant Order ID</span>
            <br />
            <Input
              value={filterValues?.merchantOrderId}
              onChange={(e) => handleFilterValuesChange(e.target.value, 'merchantOrderId')}
              allowClear
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
                allowClear
                disabled={userData?.role === "MERCHANT" ? true : userData?.role === "OPERATIONS" ? true : false}
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
              allowClear
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
              allowClear
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
              allowClear
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
              allowClear
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
              allowClear
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
              allowClear
            />
          </>}
          dataIndex="bank_name" // Adjust according to actual data structure
          key="bank_name"
          className="bg-white"
          width={"24px"}
        // render={(text, record) => getBankCode(record)}
        />

        <Column
          title="Last logged in (IST)"
          dataIndex="Merchant"
          key="Merchant"
          className="bg-white"
          width={"24px"}
          render={(text, record) => lastLogIn(record)}
        />
        {allTable === true && <Column
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
          render={(imageUrl, record) => (
            <>
              {imageUrl !== null &&
                <img
                  src={`${process.env.REACT_APP_S3_URL}${imageUrl}`}
                  alt="thumbnail"
                  className="thumbnail w-10 h-10"
                  onClick={() => handleImageClick(`${process.env.REACT_APP_S3_URL}${imageUrl}`, record)}
                />
              }
            </>

          )}
        />}

      </Table >

      {/* Image Modal */}
      <Modal open={isModalVisible}   footer={null} onCancel={handleModalClose}>
        <img
          src={selectedImageUrl}
          alt="Enlarged"
          style={{ width: '50%' }}
        />
        <Form layout='vertical'
          onFinish={handleUtrSubmit}
          className='mt-3 mb-2'
          style={{ backgroundColor: "#f7f7f7" }}
        >
          <Form.Item
            label={
              <span className='font-bold font-serif'>
                Add Utr here
              </span>
            }
            name="utrNumber"
            rules={[
              { required: true, message: 'Please enter UTR no' },
              { pattern: /^\d{12}$/, message: 'UTR number must be exactly 12 digits' }
            ]}
            className='ps-6 w-full'
            style={{ backgroundColor: "#f7f7f7" }}
          >
            <div className='flex justify-between w-full'>
              <Input
                className="w-52 mb-3"
                type="number"
                name="utrNumber"

              />
              <Button
                type='primary'
                size='middle'
                htmlType='submit'
                className='pe-5 mr-2 w-[132px] mb-3'
              >
                Submit
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      {/* Payment Link */}
      <Modal
        title="New Payment link"
        onCancel={handleToggleModal}
        open={open}
        footer={false}>
        <Form
          form={form}
          className='pt-[10px]'
          labelAlign='left'
          labelCol={labelCol}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="code"
            label="Merchant"
            rules={RequiredRule}
          >
            <Select
              options={merchantOptions}
            />
          </Form.Item>
          <Form.Item
            name="userId"
            label="User Id"
            rules={RequiredRule}
          >
            <Input type="text" />
          </Form.Item>
          <Form.Item
            label="One time payment link ? : "
            name="paymentLink"
          >
            <Switch />
          </Form.Item>

          <div className='flex justify-end'>
            <Button type='primary'
              loading={addLoading}
              htmlType='submit'
            >
              Create
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Payment Url model */}
      <Modal
        title={
          <div className='flex'>
            <CheckBadgeIcon className="h-6 w-6 text-green-500" />
            &nbsp;&nbsp; Payment Link
          </div>
        }
        open={paymentUrlModal}
        closable={false}
        // onOk={handleCancel}
        onCancel={handleCancel}
        width="40rem" // Use the width property directly
        footer={[
          <Button key="ok" type="primary" onClick={handleCancel}>
            Ok
          </Button>
        ]}
      >
        <div className='ps-10' style={{ width: "42rem" }}>
          {paymentUrl}
        </div>
      </Modal>

      <NotificationContainer />
    </>
  );
};

export default TableComponent;
